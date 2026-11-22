import { useContext, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { FiMail } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { AuthShell, AuthField, SubmitButton } from "../components/auth";

/**
 * Sends a password reset link. The result message is the same whether or not
 * an account exists, so the page can't be used to find out who has signed up.
 */
const ForgotPassword = () => {
  const { resetPassword } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [sentTo, setSentTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    setBusy(true);
    setError("");
    try {
      await resetPassword(email);
      setSentTo(email);
    } catch (err) {
      if (err.code === "auth/invalid-email") setError("That doesn't look like a valid email address.");
      else if (err.code === "auth/too-many-requests") setError("Too many requests. Please wait a few minutes and try again.");
      else if (err.code === "auth/network-request-failed") setError("Network problem. Check your connection and try again.");
      else setSentTo(email); // e.g. no such account: don't reveal that
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset your password · Movie Matrix</title>
      </Helmet>

      {sentTo ? (
        <AuthShell>
          <div className="flex flex-col items-center gap-5 text-center">
            <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-mm-accent/15 text-3xl text-mm-accent">
              <FiMail />
            </span>
            <h1 className="font-display text-3xl font-extrabold text-mm-ink">Check your email</h1>
            <p role="status" className="leading-relaxed text-mm-muted">
              If an account exists for <strong className="break-all text-mm-ink">{sentTo}</strong>, we've sent a link to reset
              your password. It can take a minute to arrive, so check your spam folder too.
            </p>
            <Link
              to="/login"
              className="flex h-12 w-full items-center justify-center rounded-[4px] bg-mm-accent font-display font-bold text-mm-on-accent hover:bg-mm-accent-hover"
            >
              Back to Sign In
            </Link>
            <button type="button" onClick={() => setSentTo("")} className="text-sm text-mm-muted hover:text-mm-ink hover:underline">
              Use a different email
            </button>
          </div>
        </AuthShell>
      ) : (
        <AuthShell title="Reset your password" subtitle="Enter the email you signed up with and we'll send you a link to choose a new password.">
          {error && (
            <p role="alert" className="mb-5 rounded-[4px] bg-mm-accent px-4 py-3 text-sm font-medium text-mm-on-accent">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AuthField
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={searchParams.get("email") || ""}
              required
            />
            <SubmitButton busy={busy} busyText="Sending…">
              Email Me a Link
            </SubmitButton>
          </form>
          <p className="mt-8 text-mm-muted">
            Remembered it?{" "}
            <Link to="/login" className="font-semibold text-mm-ink hover:underline">
              Sign in.
            </Link>
          </p>
          <p className="mt-4 text-xs leading-relaxed text-mm-faint">Signed up with Google? Use "Continue with Google" instead; there's no password to reset.</p>
        </AuthShell>
      )}
    </>
  );
};

export default ForgotPassword;
