/**
 * The sample catalogue ships without poster images, so each film gets a stable
 * generated one instead of a broken <img> or a grey box.
 *
 * The hue is derived from the title, so a given film always looks the same.
 */

function hashString(value) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // force back to a 32-bit int
  }

  return Math.abs(hash);
}

export function posterGradient(title = '') {
  const hash = hashString(title);
  const hue = hash % 360;
  const partner = (hue + 40 + (hash % 60)) % 360;

  return `linear-gradient(150deg,
    hsl(${hue} 55% 26%) 0%,
    hsl(${partner} 48% 16%) 55%,
    hsl(${(partner + 20) % 360} 40% 10%) 100%)`;
}

/** Up to three characters to sit on the generated poster. */
export function posterInitials(title = '') {
  const words = title
    .replace(/^(the|a|an)\s+/i, '')
    .split(/[\s:]+/)
    .filter(Boolean);

  if (words.length === 0) return '?';

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}
