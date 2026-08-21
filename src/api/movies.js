import { useCallback, useEffect, useState } from 'react';

import { buildQuery, request } from './client';

const EMPTY_PAGINATION = {
  total: 0,
  lastPage: 1,
  perPage: 20,
  currentPage: 1,
  prevPage: null,
  nextPage: null,
  from: 0,
  to: 0,
};

/**
 * Search the catalogue.
 *
 * The old implementation called the same endpoint twice — once for the rows and
 * once for the pagination block — doubling every search, and let the two
 * responses land independently, so the grid could render while `pagination` was
 * still null and crash on `pagination.lastPage`. One request, one state update.
 */
export function useMovieSearch(params) {
  const [state, setState] = useState({
    loading: true,
    movies: [],
    pagination: EMPTY_PAGINATION,
    error: null,
  });

  const query = buildQuery(params);

  useEffect(() => {
    // Ignore a response that arrives after the query has moved on, so a slow
    // early request cannot overwrite the results of a later one.
    let active = true;

    setState((previous) => ({ ...previous, loading: true, error: null }));

    request(`/movies/search${query}`)
      .then((data) => {
        if (!active) return;

        setState({
          loading: false,
          movies: data.data ?? [],
          pagination: data.pagination ?? EMPTY_PAGINATION,
          error: null,
        });
      })
      .catch((error) => {
        if (!active) return;

        setState({
          loading: false,
          movies: [],
          pagination: EMPTY_PAGINATION,
          error,
        });
      });

    return () => {
      active = false;
    };
  }, [query]);

  return state;
}

/** Full record for one film. */
export function useMovieDetail(id) {
  const [state, setState] = useState({ loading: true, movie: null, error: null });

  useEffect(() => {
    // The dependency array used to be empty while the effect read `id`, so
    // navigating from one film to another kept showing the first one's data.
    let active = true;

    setState({ loading: true, movie: null, error: null });

    request(`/movies/data/${encodeURIComponent(id)}`)
      .then((movie) => active && setState({ loading: false, movie, error: null }))
      .catch((error) => active && setState({ loading: false, movie: null, error }));

    return () => {
      active = false;
    };
  }, [id]);

  return state;
}

/** Distinct genres across the catalogue, for the filter bar. */
export function useGenres() {
  const [genres, setGenres] = useState([]);

  const load = useCallback(async () => {
    try {
      const data = await request('/movies/search?per_page=100&sort=rating');
      const unique = new Set();

      for (const movie of data.data ?? []) {
        for (const genre of movie.genres ?? []) {
          unique.add(genre);
        }
      }

      setGenres([...unique].sort());
    } catch {
      setGenres([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return genres;
}
