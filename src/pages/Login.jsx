import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { isAccountActive } from "../config/auth";
import * as api from "../api/api";
import { authErrorMessage, isCancelledPopup } from "../utils/authErrors";
import { AuthShell, AuthField, GoogleButton, SubmitButton } from "../components/auth";

// Save the profile the first time someone signs in; failures aren't worth bothering them with
const saveProfile = (user) =>
  api.saveUser({ name: user.displayName, email: user.email, photoURL: user.photoURL }).catch(() => {});

const Login = () => {
  const { signInUser, signInWithGoogle } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";
  const params = new URLSearchParams(location.search);
  // The verification email's link brings people here with ?verified=1
  const verifiedFromLink = params.get("verified") === "1";

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    setBusy(true);
    setError("");

    try {
      const { user } = await signInUser(form.email.value.trim(), form.password.value);
      await saveProfile(user);

      // New accounts must verify their email before they can use the app
      if (!isAccountActive(user)) {
        toast("Please verify your email to finish signing in");
        navigate("/verify-email", { replace: true, state: { from: location.state?.from } });
        return;
      }

      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err, "Couldn't sign in. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError("");
    try {
      const { user } = await signInWithGoogle();
      await saveProfile(user);
      toast.success("Welcome to Movie Matrix!");
      navigate(from, { replace: true });
    } catch (err) {
      if (!isCancelledPopup(err)) setError(authErrorMessage(err, "Couldn't sign in with Google."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign in · Movie Matrix</title>
        <meta name="description" content="Sign in to Movie Matrix to see your list, reviews and collection." />
      </Helmet>

      <AuthShell title="Sign In">
        {verifiedFromLink && (
          <p role="status" className="mb-5 rounded-[4px] bg-green-500/15 px-4 py-3 text-sm text-green-300">
            Your email is verified. Sign in to continue.
          </p>
        )}
        {error && (
          <p role="alert" className="mb-5 rounded-[4px] bg-mm-accent px-4 py-3 text-sm font-medium text-mm-on-accent">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <AuthField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={params.get("email") || ""}
            required
          />
          <AuthField label="Password" name="password" type="password" autoComplete="current-password" required />
          <SubmitButton busy={busy} busyText="Signing in…">
            Sign In
          </SubmitButton>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-mm-ink underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>

        <GoogleButton onClick={handleGoogle} disabled={busy} />

        <p className="mt-8 text-mm-muted">
          New to Movie Matrix?{" "}
          <Link to="/register" state={location.state} className="font-semibold text-mm-ink hover:underline">
            Sign up now.
          </Link>
        </p>
      </AuthShell>
    </>
  );
};

export default Login;
