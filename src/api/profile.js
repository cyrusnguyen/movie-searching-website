import { useCallback, useEffect, useState } from 'react';

import { request } from './client';
import { useAuth } from '../hooks/useAuth';

/**
 * The API has always exposed these two endpoints; the old UI never used them.
 */
export function useProfile(email) {
  const { authedRequest } = useAuth();
  const [state, setState] = useState({ loading: true, profile: null, error: null });

  const load = useCallback(async () => {
    if (!email) {
      setState({ loading: false, profile: null, error: null });
      return;
    }

    setState({ loading: true, profile: null, error: null });

    try {
      const profile = await authedRequest(`/user/${encodeURIComponent(email)}/profile`);
      setState({ loading: false, profile, error: null });
    } catch {
      // Fall back to the public view rather than showing nothing at all.
      try {
        const profile = await request(`/user/${encodeURIComponent(email)}/profile`);
        setState({ loading: false, profile, error: null });
      } catch (publicError) {
        setState({ loading: false, profile: null, error: publicError });
      }
    }
  }, [email, authedRequest]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (fields) => {
      const profile = await authedRequest(`/user/${encodeURIComponent(email)}/profile`, {
        method: 'PUT',
        body: fields,
      });

      setState({ loading: false, profile, error: null });

      return profile;
    },
    [email, authedRequest]
  );

  return { ...state, save, reload: load };
}
