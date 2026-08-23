import { Link } from 'react-router-dom';

import { posterGradient, posterInitials } from '../utils/poster';
import './MovieCard.css';

const ratingTone = (rating) => {
  if (rating >= 8) return 'is-high';
  if (rating >= 6.5) return 'is-mid';

  return 'is-low';
};

export default function MovieCard({ movie }) {
  const { imdbID, title, year, imdbRating, classification, genres = [], poster } = movie;

  return (
    <article className="movie-card">
      <Link className="movie-card__link" to={`/movie/${imdbID}`}>
        <div
          className="movie-card__poster"
          style={poster ? undefined : { backgroundImage: posterGradient(title) }}
        >
          {poster ? (
            <img src={poster} alt="" loading="lazy" />
          ) : (
            <span className="movie-card__initials" aria-hidden="true">
              {posterInitials(title)}
            </span>
          )}

          {imdbRating ? (
            <span className={`movie-card__rating ${ratingTone(imdbRating)}`}>
              <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.3 6 20.6l1.3-6.8-5-4.7 6.8-.8z"
                />
              </svg>
              {imdbRating.toFixed(1)}
            </span>
          ) : null}
        </div>

        <div className="movie-card__body">
          <h3 className="movie-card__title">{title}</h3>
          <p className="movie-card__meta">
            {year ?? 'Year unknown'}
            {classification ? <span className="movie-card__rated">{classification}</span> : null}
          </p>
          {genres.length > 0 ? (
            <p className="movie-card__genres">{genres.slice(0, 3).join(' · ')}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export function MovieCardSkeleton() {
  return (
    <article className="movie-card movie-card--skeleton" aria-hidden="true">
      <div className="movie-card__poster skeleton" />
      <div className="movie-card__body">
        <div className="skeleton" style={{ height: '1rem', width: '80%' }} />
        <div className="skeleton" style={{ height: '0.75rem', width: '45%' }} />
      </div>
    </article>
  );
}
