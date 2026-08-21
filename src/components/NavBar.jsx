import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png';
import './NavBar.css';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        {/* reactstrap's NavbarBrand was given an `as` prop, which it ignores —
            it takes `tag` — so the logo rendered as an <a> with no href. */}
        <Link className="navbar__brand" to="/">
          <img src={logo} alt="" width="32" height="32" />
          <span className="navbar__wordmark">Reel</span>
        </Link>

        <button
          className="navbar__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={`navbar__burger ${open ? 'is-open' : ''}`} aria-hidden="true" />
        </button>

        <nav
          className={`navbar__nav ${open ? 'is-open' : ''}`}
          id="primary-navigation"
          aria-label="Primary"
        >
          <NavLink className="navbar__link" to="/" end>
            Home
          </NavLink>
          <NavLink className="navbar__link" to="/movies">
            Movies
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink className="navbar__link" to="/profile">
                Profile
              </NavLink>
              <div className="navbar__account">
                <span className="navbar__user" title={user ?? ''}>
                  {user}
                </span>
                {/* This used to be a styled(Link) with an onClick and no `to`,
                    which react-router rejects. */}
                <button className="btn btn--ghost navbar__signout" type="button" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="navbar__account">
              <Link className="navbar__link" to="/login">
                Sign in
              </Link>
              <Link className="btn btn--primary navbar__cta" to="/register">
                Create account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
