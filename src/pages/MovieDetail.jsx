import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { ErrorState, Spinner } from '../components/States';
import { useMovieDetail } from '../api/movies';
import { formatCharacters, formatCurrency, formatRuntime, titleCase } from '../utils/format';
import { gridHeight } from '../utils/grid';
import { posterGradient, posterInitials } from '../utils/poster';
import './MovieDetail.css';

const RATING_MAX = {
  'Internet Movie Database': 10,
  'Rotten Tomatoes': 100,
  Metacritic: 100,
};

const COLUMNS = [
  { headerName: 'ID', field: 'id', hide: true },
  { headerName: 'Role', field: 'category', filter: 'agTextColumnFilter', minWidth: 140, maxWidth: 200 },
  { headerName: 'Name', field: 'name', filter: 'agTextColumnFilter', minWidth: 200, flex: 1 },
  { headerName: 'Character', field: 'characters', filter: 'agTextColumnFilter', minWidth: 200, flex: 1 },
];

// This was written as an array in all three grids. ag-grid expects an object,
// so sorting and resizing were silently disabled everywhere.
const DEFAULT_COL_DEF = {
  sortable: true,
  resizable: true,
  minWidth: 120,
};

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, loading, error } = useMovieDetail(id);

  const rows = useMemo(
    () =>
      (movie?.principals ?? []).map((person) => ({
        id: person.id,
        category: titleCase(person.category ?? ''),
        name: person.name,
        characters: formatCharacters(person.characters),
      })),
    [movie]
  );

  if (loading) return <Spinner label="Loading film" />;
  if (error) return <ErrorState error={error} title="Could not load this film" />;
  if (!movie) return <ErrorState error="This film is not in the catalogue." title="Not found" />;

  // Every one of these used to be read straight off the response — a null
  // boxoffice or genres list crashed the page.
  const boxOffice = formatCurrency(movie.boxoffice);
  const runtime = formatRuntime(movie.runtime);
  const genres = Array.isArray(movie.genres) ? movie.genres : [];

  return (
    <article className="detail">
      <div className="detail__backdrop" style={{ backgroundImage: posterGradient(movie.title) }} aria-hidden="true" />

      <div className="container detail__inner">
        <div className="detail__hero">
          <div
            className="detail__poster"
            style={movie.poster ? undefined : { backgroundImage: posterGradient(movie.title) }}
          >
            {movie.poster ? (
              <img src={movie.poster} alt={`Poster for ${movie.title}`} />
            ) : (
              <span className="detail__poster-initials" aria-hidden="true">
                {posterInitials(movie.title)}
              </span>
            )}
          </div>

          <div className="detail__summary">
            <h1 className="detail__title">{movie.title}</h1>

            <div className="detail__chips">
              {movie.year ? <span className="badge">{movie.year}</span> : null}
              {runtime ? <span className="badge">{runtime}</span> : null}
              {movie.classification ? <span className="badge">{movie.classification}</span> : null}
              {movie.country ? <span className="badge">{movie.country}</span> : null}
            </div>

            {genres.length > 0 ? (
              <ul className="detail__genres">
                {genres.map((genre) => (
                  <li key={genre} className="detail__genre">
                    {genre}
                  </li>
                ))}
              </ul>
            ) : null}

            {movie.plot ? <p className="detail__plot">{movie.plot}</p> : null}

            {movie.ratings?.length > 0 ? (
              <div className="ratings">
                {movie.ratings.map((rating) => {
                  const max = RATING_MAX[rating.source] ?? 100;
                  const percent =
                    rating.value === null ? 0 : Math.min(100, (rating.value / max) * 100);

                  return (
                    <div className="rating" key={rating.source}>
                      <p className="rating__source">{rating.source}</p>
                      <p className="rating__value">
                        {rating.value === null ? '—' : rating.value}
                        <span className="rating__max">/{max}</span>
                      </p>
                      <div
                        className="rating__bar"
                        role="img"
                        aria-label={`${rating.value ?? 'no'} out of ${max}`}
                      >
                        <span className="rating__fill" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {boxOffice ? (
              <p className="detail__boxoffice">
                <span className="detail__boxoffice-label">Box office</span>
                <strong>{boxOffice}</strong>
              </p>
            ) : null}
          </div>
        </div>

        <section className="detail__credits">
          <h2 className="detail__section-title">Cast &amp; crew</h2>

          {rows.length === 0 ? (
            <p className="notice notice--info">No credits are recorded for this film.</p>
          ) : (
            <div className="ag-theme-alpine grid-theme" style={{ height: gridHeight(rows.length) }}>
              <AgGridReact
                columnDefs={COLUMNS}
                rowData={rows}
                defaultColDef={DEFAULT_COL_DEF}
                animateRows
                pagination
                paginationAutoPageSize
                onRowClicked={(row) => navigate(`/person/${row.data.id}`)}
              />
            </div>
          )}
          <p className="detail__hint">Select a row to see everything that person is credited on.</p>
        </section>
      </div>
    </article>
  );
}
