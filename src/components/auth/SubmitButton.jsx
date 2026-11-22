// Full-width accent submit button for the auth forms
const SubmitButton = ({ busy, busyText, disabled, children }) => (
  <button
    type="submit"
    disabled={busy || disabled}
    className="flex h-12 w-full items-center justify-center rounded-[4px] bg-mm-accent font-display text-base font-bold text-mm-on-accent transition-colors hover:bg-mm-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
  >
    {busy ? busyText : children}
  </button>
);

export default SubmitButton;
