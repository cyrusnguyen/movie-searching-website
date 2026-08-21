import { Link } from 'react-router-dom';

import SearchBar from '../components/SearchBar';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="container notfound">
      <p className="notfound__code gradient-text">404</p>
      <h1 className="notfound__title">We couldn’t find that page</h1>
      <p className="notfound__lede">
        The link may be out of date, or the film may not be in the catalogue. Try a search instead.
      </p>
      <SearchBar />
      <Link className="btn btn--ghost" to="/">
        Back to home
      </Link>
    </div>
  );
}
