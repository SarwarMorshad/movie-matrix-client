import { useId, useState } from "react";
import { FiChevronDown, FiEye, FiEyeOff } from "react-icons/fi";

// "Raised" = the field has focus or a value: the label sits on the border
const RAISED = "peer-focus:[&>legend]:max-w-full peer-[:not(:placeholder-shown)]:[&>legend]:max-w-full";
const EASE = "duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]";

/**
 * Outlined form field used across the app. The label starts inside the box
 * and moves up into a gap in the border once the field has focus or a value.
 *
 *   as="input"     (default) any input type; password fields get a show/hide toggle
 *   as="textarea"  multi-line text
 *   as="select"    pass `options` (strings or { value, label }); its label always sits on the border
 *
 * `error` shows a message under the field, `hint` shows help text, required
 * fields get an asterisk, and `children` render under the field (e.g. a checklist).
 *
 * <TextField label="Email" name="email" type="email" autoComplete="email" required />
 * <TextField as="select" label="Genre" name="genre" options={GENRES} placeholder="Pick a genre" required />
 */
const TextField = ({ as = "input", label, type = "text", options = [], placeholder, error, hint, className = "", children, ...props }) => {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = as === "input" && type === "password";
  const isSelect = as === "select";
  const isTextarea = as === "textarea";
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const text = props.required ? `${label} *` : label;

  const shared = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    ...props,
  };
  const base = "peer w-full rounded-xl bg-transparent px-4 text-base text-mm-ink focus:outline-none";

  let control;
  if (isSelect) {
    control = (
      <select {...shared} className={`${base} h-14 cursor-pointer appearance-none pr-10 [&>option]:bg-mm-surface`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const { value, label: optionLabel } = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={value} value={value}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    );
  } else if (isTextarea) {
    control = <textarea placeholder=" " {...shared} className={`${base} block min-h-32 resize-y pt-4 pb-3 leading-relaxed`} />;
  } else {
    control = (
      <input
        type={isPassword && visible ? "text" : type}
        placeholder=" "
        {...shared}
        className={`${base} h-14 ${isPassword ? "pr-12" : ""}`}
      />
    );
  }

  // Where the label rests before it's raised
  const restingLabel = isSelect
    ? "top-0 text-xs"
    : `${isTextarea ? "top-7" : "top-1/2"} text-base peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs`;

  return (
    <div className={className}>
      <div className="relative">
        {control}
        {/* The border. Its legend holds an invisible copy of the label, which
            opens the gap in the top border when the label is raised. */}
        <fieldset
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 -top-[5px] bottom-0 rounded-xl border px-3 transition-[border-color,filter] duration-300 ${
            isSelect ? "[&>legend]:max-w-full" : RAISED
          } ${
            error
              ? "border-mm-danger peer-focus:drop-shadow-[0_0_4px_rgb(242_84_91/0.35)]"
              : "border-white/25 peer-hover:border-white/50 peer-focus:border-mm-accent motion-safe:peer-focus:animate-field-focus peer-focus:drop-shadow-[0_0_4px_rgb(255_176_32/0.35)] peer-focus:peer-hover:border-mm-accent"
          }`}
        >
          <legend className={`invisible block h-[11px] max-w-[0.01px] text-xs whitespace-nowrap transition-[max-width] ${EASE}`}>
            <span className="px-1">{text}</span>
          </legend>
        </fieldset>
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 -translate-y-1/2 transition-all ${EASE} ${restingLabel} ${
            error ? "text-mm-danger-ink" : "text-mm-muted peer-focus:text-mm-accent"
          }`}
        >
          {text}
        </label>
        {isSelect && (
          <FiChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg text-mm-muted" />
        )}
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

export default TextField;
