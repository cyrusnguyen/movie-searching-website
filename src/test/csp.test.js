import { describe, expect, it } from 'vitest';

import { buildCsp, originOf } from '../../csp';

describe('originOf', () => {
  it('reduces an API URL to its origin', () => {
    expect(originOf('https://movie-api.fly.dev/movies/search?title=lord')).toBe(
      'https://movie-api.fly.dev'
    );
  });

  it('treats a missing or relative URL as same-origin', () => {
    // Nothing to add: 'self' already covers it.
    expect(originOf(undefined)).toBeNull();
    expect(originOf('')).toBeNull();
    expect(originOf('/api')).toBeNull();
  });
});

describe('buildCsp', () => {
  it('allows the API origin so the deployed app can reach its own backend', () => {
    // The failure this guards against is silent: a policy that omits the API
    // leaves every request refused with nothing in the UI to explain it.
    const csp = buildCsp('https://movie-api.fly.dev');

    expect(csp).toContain("connect-src 'self' https://movie-api.fly.dev");
  });

  it('never allows inline script', () => {
    // The whole value of the policy. Vite emits one external module and no
    // inline scripts, so there is no reason to weaken this.
    const csp = buildCsp('https://movie-api.fly.dev');
    const scriptSrc = csp.split('; ').find((d) => d.startsWith('script-src'));

    expect(scriptSrc).toBe("script-src 'self'");
    expect(scriptSrc).not.toContain('unsafe-inline');
    expect(scriptSrc).not.toContain('unsafe-eval');
  });

  it('pins base-uri, so an injected <base> cannot repoint relative scripts', () => {
    expect(buildCsp('https://api.example.com')).toContain("base-uri 'self'");
  });

  it('drops connect-src to self alone when the API is same-origin', () => {
    const csp = buildCsp('');

    expect(csp).toContain("connect-src 'self';");
  });
});
