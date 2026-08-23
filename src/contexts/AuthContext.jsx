import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import { AuthContext } from './authContext';
import { request, ApiError } from '../api/client';

const STORAGE = {
  bearer: 'bearerToken',
  refresh: 'refreshToken',
};

/**
 * Reads a stored token and returns its payload, or null.
 *
 * The old code called jwtDecode() unguarded, so any malformed value left in
 * localStorage threw during render and took the whole app down.
 */
function decode(token) {
  if (!token) return null;

  try {
    const payload = jwtDecode(token);

    return payload?.exp && payload?.email ? payload : null;
  } catch {
    return null;
  }
}

const isExpired = (payload) => !payload || payload.exp <= Date.now() / 1000;

const readStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* Private browsing or blocked storage — the session just won't persist. */
  }
};

/**
 * Derives auth state from the token itself rather than from a separate
 * `isAuthenticated` flag. The old version stored that flag in localStorage and
 * trusted it, so setting it by hand made the UI believe you were signed in.
 */
function stateFromStorage() {
  const bearer = readStorage(STORAGE.bearer);
  const refresh = readStorage(STORAGE.refresh);
  const payload = decode(bearer);

  if (!payload || isExpired(payload)) {
    // A usable refresh token means we are still signed in, pending a refresh.
    const refreshPayload = decode(refresh);

    if (refreshPayload && !isExpired(refreshPayload)) {
      return {
        isAuthenticated: true,
        user: refreshPayload.email,
        bearerToken: null,
        refreshToken: refresh,
      };
    }

    return { isAuthenticated: false, user: null, bearerToken: null, refreshToken: null };
  }

  return {
    isAuthenticated: true,
    user: payload.email,
    bearerToken: bearer,
    refreshToken: refresh,
  };
}

const SIGNED_OUT = {
  isAuthenticated: false,
  user: null,
  bearerToken: null,
  refreshToken: null,
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(stateFromStorage);

  // Guards against a burst of concurrent requests each firing their own
  // refresh; they all await the same in-flight promise instead.
  const refreshInFlight = useRef(null);

  const persist = useCallback((next) => {
    writeStorage(STORAGE.bearer, next.bearerToken);
    writeStorage(STORAGE.refresh, next.refreshToken);
    setAuthState(next);
  }, []);

  const signOutLocally = useCallback(() => {
    writeStorage(STORAGE.bearer, null);
    writeStorage(STORAGE.refresh, null);
    setAuthState(SIGNED_OUT);
  }, []);

  const refresh = useCallback(async () => {
    const refreshToken = readStorage(STORAGE.refresh);

    if (!refreshToken) {
      signOutLocally();
      return null;
    }

    if (refreshInFlight.current) {
      return refreshInFlight.current;
    }

    refreshInFlight.current = (async () => {
      try {
        const data = await request('/user/refresh', {
          method: 'POST',
          body: { refreshToken },
        });

        persist({
          isAuthenticated: true,
          user: decode(data.bearerToken.token)?.email ?? null,
          bearerToken: data.bearerToken.token,
          refreshToken: data.refreshToken.token,
        });

        return data.bearerToken.token;
      } catch {
        signOutLocally();
        return null;
      } finally {
        refreshInFlight.current = null;
      }
    })();

    return refreshInFlight.current;
  }, [persist, signOutLocally]);

  /**
   * Returns a bearer token that is valid right now, refreshing first if needed.
   * Callers that need authentication await this instead of reading localStorage.
   */
  const getAccessToken = useCallback(async () => {
    const bearer = readStorage(STORAGE.bearer);
    const payload = decode(bearer);

    // Refresh slightly early so a token does not expire mid-flight.
    if (payload && payload.exp - 15 > Date.now() / 1000) {
      return bearer;
    }

    return refresh();
  }, [refresh]);

  const signIn = useCallback(
    async (email, password) => {
      const data = await request('/user/login', {
        method: 'POST',
        body: { email, password },
      });

      persist({
        isAuthenticated: true,
        user: email,
        bearerToken: data.bearerToken.token,
        refreshToken: data.refreshToken.token,
      });
    },
    [persist]
  );

  const signOut = useCallback(async () => {
    const refreshToken = readStorage(STORAGE.refresh);

    if (refreshToken) {
      // Best effort: the local session is cleared either way.
      await request('/user/logout', { method: 'POST', body: { refreshToken } }).catch(() => {});
    }

    signOutLocally();
  }, [signOutLocally]);

  const register = useCallback(
    // The old hook posted to `${API}/register`; the API mounts this router at
    // /user, so registration never worked.
    (email, password) => request('/user/register', { method: 'POST', body: { email, password } }),
    []
  );

  /** Fetch helper that attaches a fresh token and retries once on a 401. */
  const authedRequest = useCallback(
    async (path, options = {}) => {
      const token = await getAccessToken();

      if (!token) {
        throw new ApiError('You need to sign in to view this.', 401);
      }

      try {
        return await request(path, { ...options, token });
      } catch (err) {
        if (err.status !== 401) throw err;

        const retryToken = await refresh();

        if (!retryToken) {
          throw new ApiError('Your session has expired. Please sign in again.', 401);
        }

        return request(path, { ...options, token: retryToken });
      }
    },
    [getAccessToken, refresh]
  );

  // Keep tabs in step: signing out in one window signs out the others.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE.bearer || event.key === STORAGE.refresh) {
        setAuthState(stateFromStorage());
      }
    };

    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(
    () => ({ ...authState, signIn, signOut, register, refresh, getAccessToken, authedRequest }),
    [authState, signIn, signOut, register, refresh, getAccessToken, authedRequest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
