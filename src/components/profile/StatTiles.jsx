import { Link } from "react-router";
import { FiBookmark, FiFilm, FiStar } from "react-icons/fi";

/**
 * Three counters under the profile banner. Each links to where those items live.
 *
 * <StatTiles stats={{ myList: 4, moviesAdded: 2, reviews: 7 }} />
 */
const StatTiles = ({ stats }) => {
  const tiles = [
    { label: "In My List", value: stats?.myList, icon: FiBookmark, to: "/my-watchlist" },
    { label: "Movies added", value: stats?.moviesAdded, icon: FiFilm, to: "/my-collection" },
    { label: "Reviews written", value: stats?.reviews, icon: FiStar, to: "/movies" },
  ];

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {tiles.map(({ label, value, icon: Icon, to }) => (
        <li key={label}>
          <Link
            to={to}
            className="group flex items-center gap-4 rounded-card border border-mm-border bg-mm-surface p-5 transition-colors hover:border-mm-field focus-visible:outline-2 focus-visible:outline-mm-accent"
          >
            <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-card bg-mm-accent/12 text-2xl text-mm-accent">
              <Icon />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-3xl font-extrabold text-mm-ink tabular-nums">
                {value ?? <span className="inline-block h-8 w-10 animate-pulse rounded bg-mm-raised align-middle" />}
              </span>
              <span className="text-sm text-mm-muted group-hover:text-mm-ink">{label}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default StatTiles;
