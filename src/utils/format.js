/**
 * Formatting helpers that tolerate missing values.
 *
 * The detail page used to call `boxoffice.toLocaleString()` and `genres.join()`
 * directly, so any record with a null in either field crashed the page.
 */

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatRuntime(minutes) {
  const total = Number(minutes);

  if (!total || Number.isNaN(total)) return null;

  const hours = Math.floor(total / 60);
  const rest = total % 60;

  return hours > 0 ? `${hours}h ${rest}m` : `${rest}m`;
}

export function formatLifespan(birthYear, deathYear) {
  if (!birthYear && !deathYear) return null;
  if (birthYear && deathYear) return `${birthYear} – ${deathYear}`;
  if (birthYear) return `Born ${birthYear}`;

  return `Died ${deathYear}`;
}

/** Characters come back as an array; render them as readable prose. */
export function formatCharacters(characters) {
  if (!Array.isArray(characters) || characters.length === 0) return '';

  return characters.join(', ');
}

export const titleCase = (value = '') =>
  value.charAt(0).toUpperCase() + value.slice(1);
