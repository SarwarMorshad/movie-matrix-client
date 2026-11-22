import { useContext, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import * as api from "../api/api";
import { passwordMeetsRules } from "../utils/password";
import { authErrorMessage, isCancelledPopup } from "../utils/authErrors";
import { TextField } from "../components/ui";
import { AuthShell, GoogleButton, SubmitButton, PasswordChecklist } from "../components/auth";

const MAX_NAME_LENGTH = 60; // same limit as the server

const isHttpUrl = (text) => {
  try {
    return ["http:", "https:"].includes(new URL(text).protocol);
  } catch {
    return false;
  }
};

// Check the form before talking to Firebase; returns { field: message } for anything wrong
const validate = ({ name, email, photoURL, password }) => {
  const errors = {};
  if (!name) errors.name = "Please enter your name.";
  else if (name.length > MAX_NAME_LENGTH) errors.name = `Keep your name under ${MAX_NAME_LENGTH} characters.`;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (photoURL && !isHttpUrl(photoURL)) errors.photoURL = "Use a link that starts with http:// or https://";
  if (!passwordMeetsRules(password)) errors.password = "Your password doesn't meet all the rules below yet.";
  return errors;
};

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, sendVerificationEmail } = useContext(AuthContext);
  const [searchParams] = useSearchParams(); // ?email= from the landing page form
  const location = useLocation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const values = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      photoURL: form.photoURL.value.trim(),
      password,
    };

    const errors = validate(values);
    setFieldErrors(errors);
    setError("");
    if (Object.keys(errors).length) return;

    setBusy(true);
    try {
      await createUser(values.email, values.password);
      await updateUserProfile(values.name, values.photoURL || null);

      // Prove the email is real: the account stays inactive until the link is clicked
      let linkSent = true;
      try {
        await sendVerificationEmail();
      } catch {
        linkSent = false; // they can resend from the next page
      }

      // Save the profile (the server allows this before verification)
      await api.saveUser({ name: values.name, email: values.email, photoURL: values.photoURL }).catch(() => {});

      navigate("/verify-email", { replace: true, state: { justSent: linkSent, from: location.state?.from } });
    } catch (err) {
      setError(authErrorMessage(err, "Couldn't create your account. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError("");
    try {
      const { user } = await signInWithGoogle();
      await api.saveUser({ name: user.displayName, email: user.email, photoURL: user.photoURL }).catch(() => {});
      toast.success("Welcome to Movie Matrix!");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      if (!isCancelledPopup(err)) setError(authErrorMessage(err, "Couldn't sign up with Google."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign up · Movie Matrix</title>
        <meta name="description" content="Create a free Movie Matrix account to keep a list, rate movies and share reviews." />
      </Helmet>

      <AuthShell flipped title="Sign Up" subtitle="Create a free account to keep your list, rate movies and share reviews.">
        {error && (
          <p role="alert" className="mb-5 rounded-[4px] bg-mm-accent px-4 py-3 text-sm font-medium text-mm-on-accent">
            {error}{" "}
            {error.includes("already exists") && (
              <Link to="/login" className="font-bold underline">
                Sign in
              </Link>
            )}
          </p>
        )}

        <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4">
          <TextField
            label="Your name"
            name="name"
            autoComplete="name"
            maxLength={MAX_NAME_LENGTH}
            error={fieldErrors.name}
            required
          />
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={searchParams.get("email") || ""}
            error={fieldErrors.email}
            required
          />
          <TextField
            label="Photo URL (optional)"
            name="photoURL"
            type="url"
            autoComplete="photo"
            error={fieldErrors.photoURL}
            hint="A link to a picture for your profile. You can add one later."
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            required
          >
            <PasswordChecklist password={password} />
          </TextField>

          <SubmitButton busy={busy} busyText="Creating account…">
            Create Account
          </SubmitButton>
        </form>

        <GoogleButton onClick={handleGoogle} disabled={busy} />

        <p className="mt-8 text-mm-muted">
          Already have an account?{" "}
          <Link to="/login" state={location.state} viewTransition className="font-semibold text-mm-ink hover:underline">
            Sign in.
          </Link>
        </p>
        <p className="mt-4 text-xs leading-relaxed text-mm-faint">
          We'll send a link to your email to make sure it's yours before you can sign in.
        </p>
      </AuthShell>
    </>
  );
};

export default Register;
