import { FcGoogle } from "react-icons/fc";

// "Continue with Google" button with the "or" divider above it
const GoogleButton = ({ onClick, disabled }) => (
  <>
    <div className="my-5 flex items-center gap-3 text-sm text-mm-muted" aria-hidden="true">
      <span className="h-px flex-1 bg-white/20" />
      OR
      <span className="h-px flex-1 bg-white/20" />
    </div>
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-[4px] bg-white/15 font-semibold text-mm-ink transition-colors hover:bg-white/25 disabled:opacity-60"
    >
      <FcGoogle aria-hidden="true" className="text-2xl" />
      Continue with Google
    </button>
  </>
);

export default GoogleButton;
