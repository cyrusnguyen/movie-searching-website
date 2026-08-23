import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './SearchBar.css';

/**
 * Search input. Previously rendered globally — including on the login and 404
 * pages — and interpolated the raw term into the URL, so a title containing
 * & or # produced a broken query.
 */
export default function SearchBar({ initialValue = '', size = 'default', autoFocus = false }) {
  const [term, setTerm] = useState(initialValue);
  const navigate = useNavigate();

  useEffect(() => setTerm(initialValue), [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/movies?${new URLSearchParams({ title: term.trim() })}`);
  };

  return (
    <form className={`searchbar searchbar--${size}`} role="search" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="movie-search">
        Search for a film by title
      </label>

      <span className="searchbar__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
      </span>

      <input
        className="searchbar__input"
        id="movie-search"
        type="search"
        value={term}
        autoFocus={autoFocus}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search by title…"
      />

      {term ? (
        <button
          className="searchbar__clear"
          type="button"
          onClick={() => setTerm('')}
          aria-label="Clear search"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}

      <button className="searchbar__submit btn btn--primary" type="submit">
        Search
      </button>
    </form>
  );
}
