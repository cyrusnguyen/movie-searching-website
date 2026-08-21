import { Link } from 'react-router-dom';

import MovieCard, { MovieCardSkeleton } from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { useMovieSearch } from '../api/movies';
import './Home.css';

export default function Home() {
  const { movies, loading, error } = useMovieSearch({ sort: 'rating', per_page: 12 });

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__inner">
          <p className="hero__eyebrow">Movie database</p>
          <h1 className="hero__title">
            Every film worth <span className="gradient-text">arguing about</span>
          </h1>
          <p className="hero__lede">
            Search the catalogue, compare how the critics and the crowd scored it, and follow the
            cast and crew from one film to the next.
          </p>

          <SearchBar size="large" />

          <p className="hero__hint">
            Try <Link to="/movies?title=matrix">The Matrix</Link>,{' '}
            <Link to="/movies?title=lord+of+the+rings">Lord of the Rings</Link>, or{' '}
            <Link to="/movies?sort=rating">browse the highest rated</Link>.
          </p>
        </div>
      </section>

      <section className="container home__section">
        <header className="home__section-header">
          <h2 className="home__section-title">Top rated</h2>
          <Link className="home__section-link" to="/movies?sort=rating">
            See all →
          </Link>
        </header>

        {error ? (
          <p className="notice notice--error">{error.message}</p>
        ) : (
          <div className="movie-grid">
            {loading
              ? Array.from({ length: 12 }, (_, index) => <MovieCardSkeleton key={index} />)
              : movies.map((movie) => <MovieCard key={movie.imdbID} movie={movie} />)}
          </div>
        )}
      </section>
    </div>
  );
}
