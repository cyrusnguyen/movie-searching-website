import { pageItems } from '../utils/pagination';
import './Pagination.css';

export default function Pagination({ pagination, onPageChange }) {
  const { currentPage = 1, lastPage = 1, total = 0, from = 0, to = 0 } = pagination ?? {};

  if (total === 0) return null;

  const items = lastPage <= 1 ? [] : pageItems(currentPage, lastPage);

  return (
    <div className="pagination">
      <p className="pagination__summary" aria-live="polite">
        Showing <strong>{total === 0 ? 0 : from + 1}</strong>–<strong>{to}</strong> of{' '}
        <strong>{total}</strong> {total === 1 ? 'film' : 'films'}
      </p>

      {items.length > 0 ? (
        <nav className="pagination__nav" aria-label="Search results pages">
          <button
            className="pagination__button"
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <span aria-hidden="true">‹</span>
            <span className="visually-hidden">Previous page</span>
          </button>

          {items.map((item) =>
            item.type === 'gap' ? (
              <span className="pagination__gap" key={item.key} aria-hidden="true">
                …
              </span>
            ) : (
              <button
                className={`pagination__button ${item.page === currentPage ? 'is-current' : ''}`}
                key={item.key}
                type="button"
                aria-current={item.page === currentPage ? 'page' : undefined}
                onClick={() => onPageChange(item.page)}
              >
                {item.page}
              </button>
            )
          )}

          <button
            className="pagination__button"
            type="button"
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <span aria-hidden="true">›</span>
            <span className="visually-hidden">Next page</span>
          </button>
        </nav>
      ) : null}
    </div>
  );
}
