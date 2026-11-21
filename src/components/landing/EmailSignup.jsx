import { useId, useState } from "react";
import { useNavigate } from "react-router";
import { FiChevronRight } from "react-icons/fi";

// "Email address + Get started" form; continues on the sign-up page with the email filled in
const EmailSignup = ({ prompt = "Ready to start? Enter your email to create your free account." }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const id = useId();

  const submit = (e) => {
    e.preventDefault();
    navigate(`/register${email ? `?email=${encodeURIComponent(email.trim())}` : ""}`);
  };

  return (
    <form onSubmit={submit} className="flex w-full max-w-2xl flex-col items-center gap-4">
      <p className="text-center text-base text-mm-ink md:text-lg">{prompt}</p>
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            id={id}
            type="email"
            required
            autoComplete="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer h-14 w-full rounded-[4px] border border-white/40 bg-black/60 px-4 pt-4 text-base text-mm-ink backdrop-blur-sm focus:border-mm-ink focus:outline-none"
          />
          <label
            htmlFor={id}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base text-mm-muted transition-all peer-focus:top-3.5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Email address
          </label>
        </div>
        <button
          type="submit"
          className="flex h-14 items-center justify-center gap-1 rounded-[4px] bg-mm-accent px-7 font-display text-xl font-bold text-mm-on-accent transition-colors hover:bg-mm-accent-hover"
        >
          Get Started <FiChevronRight aria-hidden="true" className="text-2xl" />
        </button>
      </div>
    </form>
  );
};

export default EmailSignup;
