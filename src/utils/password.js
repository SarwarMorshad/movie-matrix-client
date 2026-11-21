// Sign-up password rules, shown as a live checklist on the sign-up page
export const PASSWORD_RULES = [
  { id: "length", label: "At least 6 characters", test: (p) => p.length >= 6 },
  { id: "upper", label: "An uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "A lowercase letter", test: (p) => /[a-z]/.test(p) },
];

export const passwordMeetsRules = (password) => PASSWORD_RULES.every((rule) => rule.test(password));

// Rough strength on a 0-4 scale, for the meter only (the rules above decide what's allowed)
export const passwordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
};
