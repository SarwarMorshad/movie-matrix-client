import { Link } from "react-router";

// Genre tiles with counts; each opens All Movies filtered to that genre
const GenreGrid = ({ genres }) => (
  <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
    {genres.map(({ genre, count }) => (
      <li key={genre}>
        <Link
          to={`/movies?genre=${encodeURIComponent(genre)}`}
          className="flex h-14 items-center justify-between rounded-card border border-mm-border bg-mm-surface px-4 text-[15px] font-semibold text-mm-ink transition-colors hover:border-mm-accent hover:text-mm-accent"
        >
          {genre}
          <span className="text-xs text-mm-muted">{count}</span>
        </Link>
      </li>
    ))}
  </ul>
);

export default GenreGrid;
