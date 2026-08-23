import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import AuthLayout from './AuthLayout';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Send people back where they were headed before being asked to sign in.
  const redirectTo = location.state?.from ?? '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Sign in to browse cast and crew and keep a profile."
      footer={
        <>
          Don’t have an account? <Link to="/register">Create one</Link>
        </>
      }
    >
      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        {error ? (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="field">
          <label className="field__label" htmlFor="email">
            Email
          </label>
          <input
            className="field__input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          placeholder="Your password"
        />

        <button
          className="btn btn--primary btn--block"
          type="submit"
          disabled={submitting || !email || !password}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
