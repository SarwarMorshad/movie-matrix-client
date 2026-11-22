import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FiKey, FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../ui";

const formatDate = (value, withTime = false) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(withTime && { hour: "2-digit", minute: "2-digit" }),
      })
    : "Unknown";

/**
 * Account facts (email, sign-in method, dates) plus password reset and sign out.
 */
const AccountDetails = () => {
  const { user, resetPassword, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  const usesPassword = user.providerData.some((p) => p.providerId === "password");
  const usesGoogle = user.providerData.some((p) => p.providerId === "google.com");
  const method = [usesGoogle && "Google", usesPassword && "Email and password"].filter(Boolean).join(", ") || "Email";

  const rows = [
    ["Email", user.email],
    ["Signs in with", method],
    ["Account created", formatDate(user.metadata?.creationTime)],
    ["Last sign in", formatDate(user.metadata?.lastSignInTime, true)],
  ];

  const sendReset = async () => {
    setSending(true);
    try {
      await resetPassword(user.email);
      toast.success(`We sent a password reset link to ${user.email}`);
    } catch {
      toast.error("Couldn't send the email. Please try again in a few minutes.");
    } finally {
      setSending(false);
    }
  };

  const signOut = async () => {
    await logOut();
    navigate("/", { replace: true });
  };

  return (
    <section aria-labelledby="account-title" className="rounded-card border border-mm-border bg-mm-surface p-6 sm:p-7">
      <p className="text-xs font-semibold tracking-[0.2em] text-mm-accent uppercase">Account</p>
      <h2 id="account-title" className="mt-1 font-display text-2xl font-extrabold text-mm-ink">
        Account details
      </h2>

      <dl className="mt-4 divide-y divide-mm-border">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-sm text-mm-muted">{label}</dt>
            <dd className="break-all text-sm font-medium text-mm-ink sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap gap-3">
        {usesPassword && (
          <Button variant="secondary" icon={<FiKey />} onClick={sendReset} disabled={sending}>
            {sending ? "Sending…" : "Change password"}
          </Button>
        )}
        <Button variant="ghost" icon={<FiLogOut />} onClick={signOut}>
          Sign out
        </Button>
      </div>
    </section>
  );
};

export default AccountDetails;
