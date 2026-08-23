import { useContext } from 'react';

import { AuthContext } from '../contexts/authContext';

/**
 * Kept in its own module so AuthContext.jsx only exports components — which
 * keeps react-refresh working and avoids the circular import that used to exist
 * between AuthContext and authAPI.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return context;
}
