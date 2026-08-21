import { useEffect, useState } from 'react';

import { useAuth } from '../hooks/useAuth';

/**
 * Cast/crew detail. This endpoint requires a bearer token.
 *
 * The old version called checkAuthStatus() inside the effect, which popped an
 * alert() and navigated away as a side effect of rendering. Now it just reports
 * the error and lets the page decide what to show.
 */
export function usePersonDetail(id) {
  const { authedRequest, isAuthenticated } = useAuth();
  const [state, setState] = useState({ loading: true, person: null, error: null });

  useEffect(() => {
    let active = true;

    setState({ loading: true, person: null, error: null });

    authedRequest(`/people/${encodeURIComponent(id)}`)
      .then((person) => active && setState({ loading: false, person, error: null }))
      .catch((error) => active && setState({ loading: false, person: null, error }));

    return () => {
      active = false;
    };
  }, [id, authedRequest, isAuthenticated]);

  return state;
}
