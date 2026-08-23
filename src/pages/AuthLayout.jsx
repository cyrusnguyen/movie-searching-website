import { Link } from 'react-router-dom';

import './AuthLayout.css';

/** Shared shell for the sign-in and registration cards. */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <div className="auth__glow" aria-hidden="true" />
      <div className="auth__card card">
        <Link className="auth__brand" to="/">
          Reel
        </Link>
        <h1 className="auth__title">{title}</h1>
        {subtitle ? <p className="auth__subtitle">{subtitle}</p> : null}
        {children}
        {footer ? <p className="auth__footer">{footer}</p> : null}
      </div>
    </div>
  );
}
