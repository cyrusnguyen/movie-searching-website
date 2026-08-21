import { useId, useState } from 'react';

import { PASSWORD_LEVELS, scorePassword } from '../utils/password';

/**
 * Password field with a show/hide toggle and an optional strength meter.
 */
export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete = 'current-password',
  placeholder,
  hint,
  error,
  showStrength = false,
  required = true,
}) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = [hint ? `${inputId}-hint` : null, error ? `${inputId}-error` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
        {required ? <span className="field__required"> *</span> : null}
      </label>

      <div className="password-field">
        <input
          className="field__input"
          id={inputId}
          name={inputId}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          required={required}
        />
        <button
          className="password-toggle"
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-pressed={visible}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>

      {showStrength && value ? <StrengthMeter password={value} /> : null}
      {hint ? (
        <p className="field__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field__error" id={`${inputId}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function StrengthMeter({ password }) {
  const score = scorePassword(password);
  const level = PASSWORD_LEVELS[Math.max(0, score - 1)];

  return (
    <div className="strength">
      <span className="strength__track">
        <span
          className="strength__fill"
          style={{ width: `${(score / PASSWORD_LEVELS.length) * 100}%`, background: level.color }}
        />
      </span>
      <span className="strength__label">{level.label}</span>
    </div>
  );
}
