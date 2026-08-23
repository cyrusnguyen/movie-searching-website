const HEADER_HEIGHT = 49;
const ROW_HEIGHT = 42;
const PAGINATION_HEIGHT = 48;

/**
 * Height for an ag-grid container, sized to its content.
 *
 * A fixed height left most of the grid empty — a film with four credits still
 * reserved 420px — while a long filmography needs a scroll cap.
 */
export function gridHeight(rowCount, { min = 180, max = 460 } = {}) {
  // The slack matters: ag-grid's paginationAutoPageSize floors the rows that
  // fit, so a container sized to exactly N rows can end up showing N-1 and
  // paginating a table that had room for everything.
  const SLACK = 12;
  const needed = HEADER_HEIGHT + Math.max(rowCount, 1) * ROW_HEIGHT + PAGINATION_HEIGHT + SLACK;

  return Math.min(max, Math.max(min, needed));
}
