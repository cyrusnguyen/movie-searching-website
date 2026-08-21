import { createContext } from 'react';

/**
 * Lives in its own module so the provider file exports only components, which
 * keeps react-refresh working during development.
 */
export const AuthContext = createContext(null);
