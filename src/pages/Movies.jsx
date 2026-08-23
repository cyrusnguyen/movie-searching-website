import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import MovieCard, { MovieCardSkeleton } from '../components/MovieCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { EmptyState, ErrorState } from '../components/States';
import { useGenres, useMovieSearch } from '../api/movies';
import './Movies.css';

const SORTS = [
  { value: 'relevance', label: 'A–Z' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

const RATINGS = [
  { value: '', label: 'Any rating' },
  { value: '6', label: '6.0+' },
  { value: '7', label: '7.0+' },
  { value: '8', label: '8.0+' },
  { value: '9', label: '9.0+' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1980 + 1 }, (_, i) => CURRENT_YEAR - i);

/**
 * The URL is the single source of truth for the search. The old version kept a
 * parallel `searchQuery` string in state and re-synced it from three separate
 * effects, which is what made the filters and pagination fight each other.
 */
export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genres = useGenres();

  const title = searchParams.get('title') ?? '';
  const year = searchParams.get('year') ?? '';
  const genre = searchParams.get('genre') ?? '';
  const minRating = searchParams.get('minRating') ?? '';
  const sort = searchParams.get('sort') ?? 'relevance';
  const page = Number(searchParams.get('page')) || 1;

  const query = useMemo(
    () => ({ title, year, genre, minRating, sort, page, per_page: 24 }),
    [title, year, genre, minRating, sort, page]
  );

  const { movies, pagination, loading, error } = useMovieSearch(query);

  const updateParam = useCallback(
    (patch) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);

          for (const [key, value] of Object.entries(patch)) {
            if (value === '' || value === null || value === undefined) next.delete(key);
            else next.set(key, value);
          }

          // Any filter change resets to the first page — otherwise you land on
          // page 7 of a result set that now has two pages.
          if (!('page' in patch)) next.delete('page');

          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const changePage = useCallback(
    (nextPage) => {
      updateParam({ page: nextPage === 1 ? '' : String(nextPage) });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateParam]
  );

  const hasFilters = Boolean(title || year || genre || minRating);

  return (
    <div className="movies">
      <div className="container">
        <header className="movies__header">
          <div>
            <h1 className="movies__title">{title ? `Results for “${title}”` : 'Browse films'}</h1>
            <p className="movies__subtitle">
              {loading
                ? 'Searching…'
                : `${pagination.total} ${pagination.total === 1 ? 'film' : 'films'} in the catalogue`}
            </p>
          </div>

          <SearchBar initialValue={title} />
        </header>

        <div className="filters" role="group" aria-label="Filter results">
          <div className="filters__field">
            <label className="filters__label" htmlFor="filter-year">
              Year
            </label>
            <select
              className="filters__select"
              id="filter-year"
              value={year}
              onChange={(event) => updateParam({ year: event.target.value })}
            >
              <option value="">Any year</option>
              {YEARS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="filters__field">
            <label className="filters__label" htmlFor="filter-genre">
              Genre
            </label>
            <select
              className="filters__select"
              id="filter-genre"
              value={genre}
              onChange={(event) => updateParam({ genre: event.target.value })}
            >
              <option value="">All genres</option>
              {genres.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="filters__field">
            <label className="filters__label" htmlFor="filter-rating">
              Rating
            </label>
            <select
              className="filters__select"
              id="filter-rating"
              value={minRating}
              onChange={(event) => updateParam({ minRating: event.target.value })}
            >
              {RATINGS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filters__field">
            <label className="filters__label" htmlFor="filter-sort">
              Sort
            </label>
            <select
              className="filters__select"
              id="filter-sort"
              value={sort}
              onChange={(event) => updateParam({ sort: event.target.value })}
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {hasFilters ? (
            <button
              className="btn btn--ghost filters__clear"
              type="button"
              onClick={() => setSearchParams({}, { replace: true })}
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {error ? (
          <ErrorState error={error} title="Could not load films" />
        ) : loading ? (
          <div className="movie-grid">
            {Array.from({ length: 12 }, (_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <EmptyState
            title="No films match those filters"
            description="Try a different title, widen the year range, or clear the filters and start again."
            action={
              hasFilters ? (
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={() => setSearchParams({}, { replace: true })}
                >
                  Clear filters
                </button>
              ) : null
            }
          />
        ) : (
          <>
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
            <Pagination pagination={pagination} onPageChange={changePage} />
          </>
        )}
      </div>
    </div>
  );
}
