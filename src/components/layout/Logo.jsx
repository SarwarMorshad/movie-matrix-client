import { Link } from "react-router";

// "Movie Matrix" wordmark with the play-button badge
const Logo = ({ size = "md" }) => {
  const big = size === "md";
  return (
    <Link
      to="/"
      aria-label="Movie Matrix home"
      className={`flex shrink-0 items-center gap-2.5 font-display font-extrabold tracking-tight text-mm-ink ${
        big ? "text-[22px]" : "text-lg"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex items-center justify-center rounded-card bg-mm-accent text-mm-on-accent ${big ? "size-[34px]" : "size-7"}`}
      >
        <svg width={big ? 18 : 15} height={big ? 18 : 15} viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5.5v13l10.5-6.5z" />
        </svg>
      </span>
      <span>
        Movie<span className="text-mm-accent">Matrix</span>
      </span>
    </Link>
  );
};

export default Logo;
