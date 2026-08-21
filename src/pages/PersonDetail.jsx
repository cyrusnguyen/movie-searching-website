import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
} from 'chart.js';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { ErrorState, Spinner } from '../components/States';
import { usePersonDetail } from '../api/people';
import { formatCharacters, formatLifespan, titleCase } from '../utils/format';
import { gridHeight } from '../utils/grid';
import { RATING_BUCKETS, bucketRatings } from '../utils/ratings';
import './PersonDetail.css';

// Register only what the chart uses, rather than pulling in chart.js/auto.
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip);

const COLUMNS = [
  { headerName: 'ID', field: 'id', hide: true },
  { headerName: 'Film', field: 'movieName', filter: 'agTextColumnFilter', minWidth: 220, flex: 1 },
  { headerName: 'Year', field: 'year', filter: 'agNumberColumnFilter', minWidth: 100, maxWidth: 120 },
  { headerName: 'Role', field: 'role', filter: 'agTextColumnFilter', minWidth: 130, maxWidth: 180 },
  { headerName: 'Character', field: 'characters', filter: 'agTextColumnFilter', minWidth: 180, flex: 1 },
  { headerName: 'Rating', field: 'rating', filter: 'agNumberColumnFilter', minWidth: 100, maxWidth: 130 },
];

const DEFAULT_COL_DEF = { sortable: true, resizable: true, minWidth: 100 };

export default function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { person, loading, error } = usePersonDetail(id);

  // Memoised so the two useMemo blocks below do not see a new array identity
  // on every render.
  const roles = useMemo(() => person?.roles ?? [], [person]);

  const rows = useMemo(
    () =>
      roles.map((role) => ({
        id: role.movieId,
        movieName: role.movieName,
        year: role.year ?? null,
        role: titleCase(role.category ?? ''),
        characters: formatCharacters(role.characters),
        rating: role.imdbRating ?? null,
      })),
    [roles]
  );

  const chartData = useMemo(() => {
    const counts = bucketRatings(roles);

    return {
      labels: RATING_BUCKETS,
      datasets: [
        {
          label: 'Films',
          data: counts,
          // A fixed brand colour. The old chart generated random RGBA values on
          // every render, so the bars changed colour as you interacted with it.
          backgroundColor: 'rgba(139, 92, 246, 0.55)',
          hoverBackgroundColor: 'rgba(167, 139, 250, 0.85)',
          borderColor: 'rgba(167, 139, 250, 0.9)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [roles]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => `IMDB ${items[0].label}`,
            label: (item) => `${item.parsed.y} ${item.parsed.y === 1 ? 'film' : 'films'}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#9494a3', font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#9494a3', precision: 0, font: { size: 11 } },
          grid: { color: 'rgba(255,255,255,0.06)' },
        },
      },
    }),
    []
  );

  if (loading) return <Spinner label="Loading person" />;
  if (error) return <ErrorState error={error} title="Could not load this person" />;
  if (!person) return <ErrorState error="No record of this person." title="Not found" />;

  const lifespan = formatLifespan(person.birthYear, person.deathYear);
  const rated = roles.filter(
    (role) =>
      role.imdbRating !== null &&
      role.imdbRating !== undefined &&
      Number.isFinite(Number(role.imdbRating))
  );
  const average =
    rated.length === 0
      ? null
      : (rated.reduce((sum, role) => sum + Number(role.imdbRating), 0) / rated.length).toFixed(1);

  return (
    <div className="container person">
      <header className="person__header">
        <h1 className="person__name">{person.name}</h1>
        {lifespan ? <p className="person__lifespan">{lifespan}</p> : null}

        <div className="person__stats">
          <div className="person__stat">
            <span className="person__stat-value">{roles.length}</span>
            <span className="person__stat-label">{roles.length === 1 ? 'Credit' : 'Credits'}</span>
          </div>
          {average ? (
            <div className="person__stat">
              <span className="person__stat-value">{average}</span>
              <span className="person__stat-label">Average rating</span>
            </div>
          ) : null}
        </div>
      </header>

      {roles.length === 0 ? (
        <p className="notice notice--info">No credits are recorded for this person.</p>
      ) : (
        <>
          <section className="person__section">
            <h2 className="person__section-title">Filmography</h2>
            <div className="ag-theme-alpine grid-theme" style={{ height: gridHeight(rows.length) }}>
              <AgGridReact
                columnDefs={COLUMNS}
                rowData={rows}
                defaultColDef={DEFAULT_COL_DEF}
                animateRows
                pagination
                paginationAutoPageSize
                onRowClicked={(row) => navigate(`/movie/${row.data.id}`)}
              />
            </div>
          </section>

          <section className="person__section">
            <h2 className="person__section-title">IMDB ratings at a glance</h2>
            <div className="person__chart card">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
