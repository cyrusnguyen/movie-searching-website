/**
 * Content-Security-Policy for the built app.
 *
 * A CSP is what stops injected script from *executing*, which is the defence
 * that actually matters for XSS — where the token is stored only decides what
 * an attacker can do afterwards.
 *
 * The policy is generated at build time rather than written by hand into
 * vercel.json, because `connect-src` has to name the API's origin. Hard-coding
 * it there means the two can drift apart, and the failure is silent and total:
 * the deployed app is refused every request to its own API, with nothing in the
 * UI to say why. Deriving both from VITE_API_URL makes that impossible.
 */

/**
 * The origin of a URL, or null when there is nothing cross-origin to allow.
 *
 * A relative or empty VITE_API_URL means the API is served from the same
 * origin, which `'self'` already covers.
 */
export function originOf(url) {
  if (!url) return null;

  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export function buildCsp(apiUrl) {
  const api = originOf(apiUrl);

  const directives = {
    'default-src': ["'self'"],

    // No 'unsafe-inline' here, which is the entire point of having a policy:
    // Vite emits one external module script and no inline ones, so a strict
    // script-src costs nothing. Anything injected into the DOM cannot run.
    'script-src': ["'self'"],

    // Inline *styles* are unavoidable — React style={{…}} and ag-grid both set
    // style attributes on elements. Far lower risk than inline script: it can
    // be abused to restyle the page, not to execute code.
    'style-src': ["'self'", "'unsafe-inline'"],

    // Posters may be hotlinked from anywhere; an image URL cannot execute.
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],

    // Where the app is allowed to send data. Keeping this tight is what stops
    // an attacker exfiltrating to their own host.
    'connect-src': ["'self'", api].filter(Boolean),

    // Without this, an injected <base> tag can repoint every relative script
    // URL at another host — walking straight around script-src 'self'.
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'object-src': ["'none'"],
  };

  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Injects the policy as a <meta> tag in the built HTML.
 *
 * Build only: Vite's dev server serves inline scripts and uses eval for hot
 * module replacement, so a strict script-src would break `npm run dev`.
 *
 * frame-ancestors is deliberately absent — browsers ignore it in a meta tag.
 * It is set as a real header in vercel.json instead.
 */
export function csp(apiUrl) {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return {
          html,
          tags: [
            {
              tag: 'meta',
              attrs: {
                'http-equiv': 'Content-Security-Policy',
                content: buildCsp(apiUrl),
              },
              injectTo: 'head-prepend',
            },
          ],
        };
      },
    },
  };
}
