export const PASSWORD_LEVELS = [
  { label: 'Weak', color: 'var(--danger-500)' },
  { label: 'Fair', color: 'var(--warning-400)' },
  { label: 'Good', color: 'var(--brand-500)' },
  { label: 'Strong', color: 'var(--success-600)' },
];

/** Rough guidance for the strength meter — the server enforces the real rule. */
export function scorePassword(password = '') {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^\w\s]/.test(password)) score += 1;

  return Math.min(score, PASSWORD_LEVELS.length);
}
