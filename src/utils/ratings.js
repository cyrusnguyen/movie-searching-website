export const RATING_BUCKETS = [
  '0–1', '1–2', '2–3', '3–4', '4–5', '5–6', '6–7', '7–8', '8–9', '9–10',
];

/**
 * Counts how many of the given credits fall into each rating band.
 *
 * The old inline version did `counts[Math.floor(rating)] += 1`, which wrote to
 * index 10 for a 10.0 rating — one past the end of the ten-element array — and
 * to index NaN whenever a credit had no rating at all.
 */
export function bucketRatings(roles = []) {
  const counts = new Array(RATING_BUCKETS.length).fill(0);

  for (const role of roles) {
    const raw = role?.imdbRating;

    // Number(null) is 0 and Number('') is 0, both of which are finite — so an
    // unrated credit would otherwise be counted in the 0–1 band.
    if (raw === null || raw === undefined || raw === '') continue;

    const rating = Number(raw);

    if (!Number.isFinite(rating)) continue;

    const index = Math.min(RATING_BUCKETS.length - 1, Math.max(0, Math.ceil(rating) - 1));
    counts[index] += 1;
  }

  return counts;
}
