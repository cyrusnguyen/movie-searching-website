import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__credit">
          Built by Minh Nguyen · <span className="footer__muted">© 2023–2026 · QUT</span>
        </p>
        <p className="footer__links">
          <a href="mailto:hoangminh0268@gmail.com">hoangminh0268@gmail.com</a>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/cyrusnguyen/movie-searching-website"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
      </div>
    </footer>
  );
}
