import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

/**
 * Redirects to the sign-in page, remembering where the user was going.
 *
 * The old app enforced this from inside a data-fetching effect, which fired an
 * alert() and a navigate() as a side effect of rendering — so an anonymous
 * visitor got a browser dialog before the page had even painted.
 */
export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
}
