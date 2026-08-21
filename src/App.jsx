import { Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';

import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import RequireAuth from './components/RequireAuth';
import { Spinner } from './components/States';
import Home from './pages/Home';
import Login from './pages/Login';
import Movies from './pages/Movies';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Register from './pages/Register';
import './App.css';

// The detail pages pull in ag-grid (~1 MB) and chart.js. Loading them on demand
// keeps those out of the initial bundle, which most visits never need.
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const PersonDetail = lazy(() => import('./pages/PersonDetail'));

/** Client-side navigation does not reset scroll on its own. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <NavBar />
      <ScrollToTop />

      {/* The search bar used to live here, so it appeared on the login,
          register and 404 pages too. It belongs to the pages that search. */}
      <main className="app__main" id="main">
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route
                path="/person/:id"
                element={
                  <RequireAuth>
                    <PersonDetail />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
