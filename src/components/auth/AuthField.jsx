import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

// "Raised" = the field has focus or a value: the label sits on the border
const RAISED = "peer-focus:[&>legend]:max-w-full peer-[:not(:placeholder-shown)]:[&>legend]:max-w-full";

/**
 * Outlined input for the auth forms. The label starts inside the box and moves
 * up into a gap in the border once the field has focus or a value. Password
 * fields get a show/hide toggle. Pass `error` to show a message under the
 * field, or `hint` for help text. Required fields get an asterisk.
 *
 * <AuthField label="Email" name="email" type="email" autoComplete="email" required />
 */
const AuthField = ({ label, type = "text", error, hint, className = "", children, ...inputProps }) => {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const text = inputProps.required ? `${label} *` : label;

  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`peer h-14 w-full rounded-xl bg-transparent px-4 text-base text-mm-ink focus:outline-none ${isPassword ? "pr-12" : ""}`}
          {...inputProps}
        />
        {/* The border. Its legend holds an invisible copy of the label, which
            opens the gap in the top border when the label is raised. */}
        <fieldset
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 -top-[5px] bottom-0 rounded-xl border px-3 transition-[border-color,filter] duration-300 ${RAISED} ${
            error
              ? "border-mm-danger peer-focus:drop-shadow-[0_0_4px_rgb(242_84_91/0.35)]"
              : "border-white/25 peer-hover:border-white/50 peer-focus:border-mm-accent motion-safe:peer-focus:animate-field-focus peer-focus:drop-shadow-[0_0_4px_rgb(255_176_32/0.35)] peer-focus:peer-hover:border-mm-accent"
          }`}
        >
          <legend className="invisible block h-[11px] max-w-[0.01px] text-xs whitespace-nowrap transition-[max-width] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <span className="px-1">{text}</span>
          </legend>
        </fieldset>
        <label
          htmlFor={id}
          className={`pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs ${
            error ? "text-mm-danger-ink" : "text-mm-muted peer-focus:text-mm-accent"
          }`}
        >
          {text}
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
