import { useRef } from "react";
import { Link } from "react-router";
import Logo from "../layout/Logo";
import useAuthBackdrop from "../../hooks/useAuthBackdrop";

/**
 * Split-screen frame for the log in / sign up / password pages: the form on
 * the left, a big trending backdrop on the right (hidden on small screens).
 * `flipped` swaps the sides (picture left, form right).
 *
 * <AuthShell title="Sign In" subtitle="...">...form...</AuthShell>
 */
const AuthShell = ({ title, subtitle, flipped = false, children }) => {
  const backdrop = useAuthBackdrop();
  // Fade the picture in only when it first loads, not when it's already on screen
  // and just sliding across between Sign in and Sign up
  const fadeIn = useRef(!backdrop).current;

  return (
    <div className="grid min-h-screen flex-1 lg:grid-cols-2">
      {/* Form side */}
      {/* The two panels carry view-transition names, so switching between Sign in
          and Sign up (links with viewTransition) slides them past each other */}
      <div className="flex flex-col px-6 py-6 [view-transition-name:auth-form] sm:px-10 lg:px-14">
        <Logo />
        <main className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[380px]">
            {title && <h1 className="font-display text-3xl font-extrabold text-mm-ink">{title}</h1>}
            {subtitle && <p className="mt-2 text-sm leading-relaxed text-mm-muted">{subtitle}</p>}
            <div className={title || subtitle ? "mt-8" : ""}>{children}</div>
          </div>
        </main>
        <p className="text-xs text-mm-faint">
          © {new Date().getFullYear()} Movie Matrix ·{" "}
          <Link to="/" className="hover:text-mm-muted">
            Back to home
          </Link>
        </p>
      </div>

      {/* Picture side */}
      <div aria-hidden="true" className={`relative hidden overflow-hidden bg-mm-surface [view-transition-name:auth-picture] lg:block ${
          flipped ? "lg:order-first" : ""
        }`}>
        {backdrop && (
          <img src={backdrop.backdropUrl} alt="" className={`absolute inset-0 size-full object-cover ${fadeIn ? "motion-safe:animate-fadeIn" : ""}`} />
        )}
        {/* Fade the picture into the form side */}
        <div
          className={`absolute inset-y-0 w-40 from-mm-bg to-transparent ${flipped ? "right-0 bg-linear-to-l" : "left-0 bg-linear-to-r"}`}
        />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black/85 to-transparent" />
        {backdrop && (
          <div className={`absolute bottom-10 ${flipped ? "right-16 left-10" : "right-10 left-16"}`}>
            <p className="text-xs font-semibold tracking-[0.2em] text-mm-accent uppercase">Trending now</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-white drop-shadow">{backdrop.title}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthShell;
