import { describe, expect, it } from 'vitest';

import { bucketRatings, RATING_BUCKETS } from '../utils/ratings';
import { pageItems } from '../utils/pagination';
import { formatCharacters, formatCurrency, formatLifespan, formatRuntime } from '../utils/format';
import { scorePassword } from '../utils/password';
import { posterInitials } from '../utils/poster';

describe('bucketRatings', () => {
  it('puts a perfect 10 in the last bucket rather than off the end', () => {
    // The old code indexed with Math.floor(10) === 10, one past the array.
    const counts = bucketRatings([{ imdbRating: 10 }]);

    expect(counts).toHaveLength(RATING_BUCKETS.length);
    expect(counts[RATING_BUCKETS.length - 1]).toBe(1);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(1);
  });

  it('ignores credits with no rating instead of writing to index NaN', () => {
    const counts = bucketRatings([
      { imdbRating: null },
      { imdbRating: undefined },
      { imdbRating: 'n/a' },
      { imdbRating: 8.7 },
    ]);

    expect(counts.reduce((a, b) => a + b, 0)).toBe(1);
    expect(counts[8]).toBe(1); // 8.7 falls in the 8–9 band
  });

  it('handles an empty list', () => {
    expect(bucketRatings([])).toEqual(new Array(10).fill(0));
    expect(bucketRatings()).toEqual(new Array(10).fill(0));
  });
});

describe('pageItems', () => {
  it('returns a single page when there is only one', () => {
    expect(pageItems(1, 1)).toEqual([{ type: 'page', page: 1, key: 'page-1' }]);
  });

  it('always includes the first and last page', () => {
    const pages = pageItems(50, 100).filter((item) => item.type === 'page').map((i) => i.page);

    expect(pages).toContain(1);
    expect(pages).toContain(100);
    expect(pages).toContain(50);
  });

  it('never runs past the last page', () => {
    const pages = pageItems(3, 3).filter((item) => item.type === 'page').map((i) => i.page);

    expect(Math.max(...pages)).toBe(3);
  });

  it('inserts gaps where pages are skipped', () => {
    expect(pageItems(50, 100).some((item) => item.type === 'gap')).toBe(true);
    expect(pageItems(2, 4).some((item) => item.type === 'gap')).toBe(false);
  });
});

describe('formatters', () => {
  it('returns null for a missing box office rather than throwing', () => {
    // MovieDetail used to call boxoffice.toLocaleString() directly.
    expect(formatCurrency(null)).toBeNull();
    expect(formatCurrency(undefined)).toBeNull();
    expect(formatCurrency(1000000)).toBe('$1,000,000');
  });

  it('formats runtimes and tolerates missing ones', () => {
    expect(formatRuntime(142)).toBe('2h 22m');
    expect(formatRuntime(45)).toBe('45m');
    expect(formatRuntime(null)).toBeNull();
  });

  it('formats a lifespan from partial data', () => {
    expect(formatLifespan(1970, 2020)).toBe('1970 – 2020');
    expect(formatLifespan(1970, null)).toBe('Born 1970');
    expect(formatLifespan(null, null)).toBeNull();
  });

  it('joins characters and tolerates non-arrays', () => {
    expect(formatCharacters(['Neo'])).toBe('Neo');
    expect(formatCharacters(['Neo', 'Thomas Anderson'])).toBe('Neo, Thomas Anderson');
    expect(formatCharacters(null)).toBe('');
    expect(formatCharacters([])).toBe('');
  });
});

describe('scorePassword', () => {
  it('scores short passwords lowest and strong ones highest', () => {
    expect(scorePassword('abc')).toBe(0);
    expect(scorePassword('password')).toBe(1);
    expect(scorePassword('Correct-Horse-9')).toBe(4);
  });
});

describe('posterInitials', () => {
  it('drops a leading article and initialises the rest', () => {
    expect(posterInitials('The Matrix')).toBe('MA');
    expect(posterInitials('Pulp Fiction')).toBe('PF');
    expect(posterInitials('The Lord of the Rings: The Two Towers')).toBe('LOT');
    expect(posterInitials('')).toBe('?');
  });
});
