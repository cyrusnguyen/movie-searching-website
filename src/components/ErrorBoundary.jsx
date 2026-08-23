import { Component } from 'react';

/**
 * Catches render-time errors so one broken page shows a message instead of a
 * blank white screen. The old app had no boundary at all, so a single throw
 * (for example the `console(...)` call in AuthContext) unmounted everything.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info);
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        <div className="state state--error" role="alert">
          <h1 className="state__title">This page hit an unexpected error</h1>
          <p className="state__description">{error.message}</p>
          <button className="btn btn--primary" type="button" onClick={() => window.location.assign('/')}>
            Back to home
          </button>
        </div>
      </div>
    );
  }
}
