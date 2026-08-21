/**
 * Builds a page list with ellipses, always including the first and last page.
 *
 * The old pagination rendered a fixed four-page window computed from
 * `pagination.lastPage`, which could be read while pagination was still null.
 */
export function pageItems(current, last, window = 1) {
  if (last <= 1) return [{ type: 'page', page: 1, key: 'page-1' }];

  const pages = new Set([1, last, current]);

  for (let offset = 1; offset <= window; offset += 1) {
    if (current - offset >= 1) pages.add(current - offset);
    if (current + offset <= last) pages.add(current + offset);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      items.push({ type: 'gap', key: `gap-${page}` });
    }

    items.push({ type: 'page', page, key: `page-${page}` });
  });

  return items;
}
