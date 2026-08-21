import { Link } from 'react-router-dom';

import './States.css';

/**
 * Shared loading / empty / error presentation.
 *
 * The old app had a bare <h1>Loading...</h1> in one place, a blank screen in
 * another, and "ERROR!" in a third.
 */

export function EmptyState({ title, description, action }) {
  return (
    <div className="state">
      <div className="state__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="state__title">{title}</h2>
      {description ? <p className="state__description">{description}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ error, title = 'Something went wrong', action }) {
  const message =
    typeof error === 'string' ? error : error?.message || 'An unexpected error occurred.';

  const needsSignIn = error?.status === 401;

  return (
    <div className="state state--error" role="alert">
      <div className="state__icon state__icon--error" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5.5" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <h2 className="state__title">{needsSignIn ? 'Sign in to continue' : title}</h2>
      <p className="state__description">{message}</p>
      {action ??
        (needsSignIn ? (
          <Link className="btn btn--primary" to="/login">
            Sign in
          </Link>
        ) : null)}
    </div>
  );
}

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="spinner" role="status">
      <span className="spinner__ring" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
