import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from './AuthLayout';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../hooks/useAuth';

const MIN_PASSWORD_LENGTH = 8;

export default function Register() {
  // These were bound as `value={state.email.value}` — `state.email` is a
  // string, so `.value` was always undefined and every input was uncontrolled.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, signIn } = useAuth();
  const navigate = useNavigate();

  const mismatch = touched && confirmPassword.length > 0 && password !== confirmPassword;
  const tooShort = touched && password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const canSubmit =
    email.trim().length > 0 &&
    password.length >= MIN_PASSWORD_LENGTH &&
    password === confirmPassword &&
    !submitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);
    setError(null);

    if (!canSubmit) return;

    setSubmitting(true);

    try {
      await register(email.trim(), password);
      setCreated(true);

      // Sign straight in rather than making them retype the credentials.
      try {
        await signIn(email.trim(), password);
        navigate('/', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="An account lets you browse cast and crew and keep a profile."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        {error ? (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        ) : null}

        {created && !error ? (
          // Previously rendered with the error styling, so a successful
          // registration was announced in red.
          <p className="notice notice--success" role="status">
            Account created — signing you in…
          </p>
        ) : null}

        <div className="field">
          <label className="field__label" htmlFor="email">
            Email<span className="field__required"> *</span>
          </label>
          <input
            className="field__input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="you@example.com"
            required
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          hint={`Use ${MIN_PASSWORD_LENGTH} characters or more.`}
          error={tooShort ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters` : null}
          showStrength
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Repeat your password"
          error={mismatch ? 'Passwords do not match' : null}
        />

        <button className="btn btn--primary btn--block" type="submit" disabled={!canSubmit}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
