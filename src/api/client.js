/**
 * Thin fetch wrapper shared by every API module.
 *
 * Centralising this fixes two problems in the old code: each hook built its own
 * URL by string concatenation (which is how /register ended up missing its
 * /user prefix), and none of them checked response.ok before reading the body,
 * so an error payload was happily rendered as if it were data.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Messages for the statuses worth phrasing ourselves. */
const FALLBACK_MESSAGES = {
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you were looking for.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Something went wrong on our end. Please try again.',
};

export async function request(path, { token, ...options } = {}) {
  const headers = { ...(options.headers || {}) };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(
      'Could not reach the API. Check that it is running and that VITE_API_URL is correct.',
      0
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.message || FALLBACK_MESSAGES[response.status] || 'Request failed',
      response.status
    );
  }

  return payload;
}

export const buildQuery = (params) => {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    // encodeURIComponent is handled by URLSearchParams — the old code
    // interpolated the search term straight into the URL, so a title
    // containing & or # produced a broken request.
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  }

  const query = search.toString();

  return query ? `?${query}` : '';
};

export { BASE_URL };
