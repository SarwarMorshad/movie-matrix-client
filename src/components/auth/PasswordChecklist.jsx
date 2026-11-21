import { FiCheck, FiCircle } from "react-icons/fi";
import { PASSWORD_RULES, passwordStrength } from "../../utils/password";

const LEVELS = [
  { label: "Too weak", color: "bg-mm-danger" },
  { label: "Weak", color: "bg-mm-danger" },
  { label: "Fair", color: "bg-mm-accent" },
  { label: "Good", color: "bg-green-500" },
  { label: "Strong", color: "bg-green-500" },
];

// Live strength meter plus a tick list of the sign-up password rules
const PasswordChecklist = ({ password }) => {
  const strength = passwordStrength(password);
  const level = LEVELS[strength];

  return (
    <div className="mt-2.5 flex flex-col gap-2">
      {password && (
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-1" aria-hidden="true">
            {[1, 2, 3, 4].map((step) => (
              <span key={step} className={`h-1 flex-1 rounded-full ${strength >= step ? level.color : "bg-white/15"}`} />
            ))}
          </div>
          <span className="w-16 text-right text-xs text-mm-muted">{level.label}</span>
        </div>
      )}
      <ul className="flex flex-col gap-1 text-xs" aria-label="Password rules">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.id} className={`flex items-center gap-2 ${ok ? "text-green-400" : "text-mm-muted"}`}>
              {ok ? <FiCheck aria-hidden="true" /> : <FiCircle aria-hidden="true" className="text-[0.6rem]" />}
              {rule.label}
              <span className="sr-only">{ok ? "(done)" : "(missing)"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordChecklist;
