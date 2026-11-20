import { Link } from "react-router";
import Logo from "./Logo";

const links = [
  { to: "/movies", label: "Movies" },
  { to: "/my-watchlist", label: "Watchlist" },
  { to: "/add-movie", label: "Add a movie" },
  { to: "/plans", label: "Plans" },
];

const Footer = () => (
  <footer className="border-t border-mm-border bg-mm-footer">
    <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 px-6 py-9 text-sm text-mm-muted">
      <Logo size="sm" />
      <nav aria-label="Footer">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="hover:text-mm-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p>© {new Date().getFullYear()} Movie Matrix</p>
    </div>
  </footer>
);

export default Footer;
