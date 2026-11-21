import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { Button, Spinner } from "../components/ui";

const RESEND_COOLDOWN_S = 60;

/**
 * "Check your inbox" page for new email/password accounts that haven't
 * clicked their verification link yet.
 */
const VerifyEmail = () => {
  const { user, pendingUser, loading, sendVerificationEmail, refreshVerification, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [cooldown, setCooldown] = useState(location.state?.justSent ? RESEND_COOLDOWN_S : 0);
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);

  // Count the resend cooldown down
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Already verified (or a Google account): nothing to do here
  useEffect(() => {
    if (!loading && user) navigate(from, { replace: true });
  }, [loading, user, from, navigate]);

  const resend = async () => {
    setSending(true);
    try {
      await sendVerificationEmail();
      toast.success("Verification email sent");
      setCooldown(RESEND_COOLDOWN_S);
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many emails sent. Please wait a few minutes and try again.");
        setCooldown(RESEND_COOLDOWN_S);
      } else {
        toast.error("Couldn't send the email, please try again");
      }
    } finally {
      setSending(false);
    }
  };

  const checkNow = async () => {
    setChecking(true);
    try {
      const ok = await refreshVerification();
      if (ok) {
        toast.success("Email verified. Welcome to Movie Matrix!");
        navigate(from, { replace: true });
      } else {
        toast.error("Not verified yet. Click the link in the email first.");
      }
    } catch {
      toast.error("Couldn't check right now, please try again");
    } finally {
      setChecking(false);
    }
  };

  const useAnotherAccount = async () => {
    await logOut();
    navigate("/login", { replace: true });
  };

  if (loading) return <Spinner fullPage />;

  return (
    <>
      <Helmet>
        <title>Verify your email · Movie Matrix</title>
      </Helmet>
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-xl border border-mm-border bg-mm-surface p-8 text-center">
          <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-mm-accent/15 text-3xl text-mm-accent">
            <FiMail />
          </span>

          {pendingUser ? (
            <>
              <h1 className="font-display text-3xl font-extrabold text-mm-ink">Check your inbox</h1>
              <p className="leading-relaxed text-mm-muted">
                We sent a verification link to <strong className="break-all text-mm-ink">{pendingUser.email}</strong>. Click it to
                activate your account, then come back here.
              </p>
              <p className="text-sm text-mm-muted">Can't find it? Check your spam or promotions folder.</p>

              <div className="flex w-full flex-col gap-3 pt-2">
                <Button size="lg" onClick={checkNow} disabled={checking}>
                  {checking ? "Checking…" : "I've verified, continue"}
                </Button>
                <Button size="lg" variant="outline" onClick={resend} disabled={sending || cooldown > 0}>
                  {cooldown > 0 ? `Resend email in ${cooldown}s` : sending ? "Sending…" : "Resend email"}
                </Button>
              </div>
              <button type="button" onClick={useAnotherAccount} className="text-sm text-mm-muted underline-offset-4 hover:text-mm-ink hover:underline">
                Use a different account
              </button>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-extrabold text-mm-ink">Verify your email</h1>
              <p className="leading-relaxed text-mm-muted">
                Log in with your email and password to continue. If your email isn't verified yet, we'll help you get a new link.
              </p>
              <Button size="lg" to="/login" className="w-full">
                Log in
              </Button>
              <p className="text-sm text-mm-muted">
                New here?{" "}
                <Link to="/register" className="font-semibold text-mm-accent hover:underline">
                  Create an account
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
