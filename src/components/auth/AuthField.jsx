import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Floating-label input for the auth forms. Password fields get a show/hide
 * toggle. Pass `error` to show a message under the field, or `hint` for help text.
 *
 * <AuthField label="Email" name="email" type="email" autoComplete="email" required />
 */
const AuthField = ({ label, type = "text", error, hint, className = "", children, ...inputProps }) => {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`peer h-14 w-full rounded-[4px] border bg-mm-field/40 px-4 pt-4 text-base text-mm-ink focus:outline-none ${
            isPassword ? "pr-12" : ""
          } ${error ? "border-mm-danger focus:border-mm-danger" : "border-white/30 focus:border-mm-ink"}`}
          {...inputProps}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base text-mm-muted transition-all peer-focus:top-3.5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-xs"
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-xl text-mm-muted hover:text-mm-ink"
          >
            {visible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-mm-danger-ink">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-mm-faint">
            {hint}
          </p>
        )
      )}
      {children}
    </div>
  );
};

export default AuthField;
