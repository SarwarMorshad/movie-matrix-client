import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import * as api from "../api/api";
import { Button, ConfirmDialog, PosterCard, Spinner } from "../components/ui";
import SeriesCard from "../components/tv/SeriesCard";

// One page, two tabs: /my-watchlist (My List: movies + series) and /my-collection (movies you added)

const TABS = [
  { path: "/my-watchlist", key: "list", label: "My List" },
  { path: "/my-collection", key: "collection", label: "My Collection" },
];
const FILTERS = [
  { key: "all", label: "All" },
  { key: "movie", label: "Movies" },
  { key: "series", label: "TV Shows" },
];

const grid = "grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

const EmptyState = ({ title, text, children }) => (
  <div className="flex flex-col items-center gap-3 rounded-lg border border-mm-border bg-mm-surface px-6 py-16 text-center">
    <p className="font-display text-2xl font-extrabold text-mm-ink">{title}</p>
    <p className="max-w-md text-mm-muted">{text}</p>
    <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>
  </div>
);

const LoadError = () => (
  <EmptyState title="Couldn't load your library" text="Please check your connection and try again.">
    <Button onClick={() => window.location.reload()}>Try again</Button>
  </EmptyState>
);

// ---------- My List tab ----------
const MyListTab = () => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .getMyList()
      .then(({ items }) => setItems(items))
      .catch(() => setError(true));
  }, []);

  const remove = async (item) => {
    const key = item.type === "movie" ? item._id : item.id;
    setItems((list) => list.filter((i) => i !== item)); // update right away
    try {
      await (item.type === "movie" ? api.removeFromWatchlist(key) : api.removeSeriesFromList(key));
      toast.success(`${item.title} removed from My List`);
    } catch {
      setItems((list) => [item, ...list]);
      toast.error("Couldn't remove it, please try again");
    }
  };

  if (error) return <LoadError />;
  if (!items) return <Spinner fullPage label="Loading My List" />;

  const counts = { all: items.length, movie: items.filter((i) => i.type === "movie").length };
  counts.series = counts.all - counts.movie;
  const shown = filter === "all" ? items : items.filter((i) => i.type === filter);

  if (!items.length) {
    return (
      <EmptyState title="Your list is empty" text="Save movies and TV shows you want to watch, and they'll show up here.">
        <Button to="/movies">Browse movies</Button>
        <Button variant="outline" to="/tv">
          Browse TV shows
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={`h-9 rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
                active ? "border-mm-accent bg-mm-accent text-mm-on-accent" : "border-mm-field text-mm-ink/85 hover:border-mm-muted"
              }`}
            >
              {f.label} <span className={active ? "" : "text-mm-muted"}>· {counts[f.key]}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="text-mm-muted">Nothing here yet.</p>
      ) : (
        <ul className={grid}>
          {shown.map((item) => (
            <li key={`${item.type}-${item.type === "movie" ? item._id : item.id}`}>
              {item.type === "movie" ? <PosterCard movie={item} /> : <SeriesCard series={item} badge="TV" />}
              <Button size="sm" variant="outline" icon={<FiX />} className="mt-3 w-full" onClick={() => remove(item)} aria-label={`Remove ${item.title} from My List`}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ---------- My Collection tab ----------
const CollectionTab = () => {
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .getMyMovies()
      .then(setMovies)
      .catch(() => setError(true));
  }, []);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteMovie(toDelete._id);
      setMovies((list) => list.filter((m) => m._id !== toDelete._id));
      toast.success(`${toDelete.title} deleted`);
      setToDelete(null);
    } catch {
      toast.error("Couldn't delete this movie");
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <LoadError />;
  if (!movies) return <Spinner fullPage label="Loading your collection" />;

  if (!movies.length) {
    return (
      <EmptyState title="No movies added yet" text="Share a favourite movie with the community and it will appear here.">
        <Button to="/add-movie" icon={<FiPlus />}>
          Add a movie
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mm-muted">
          {movies.length} movie{movies.length > 1 ? "s" : ""} you added. Only you can edit or delete them.
        </p>
        <Button size="sm" to="/add-movie" icon={<FiPlus />}>
          Add a movie
        </Button>
      </div>
      <ul className={grid}>
        {movies.map((movie) => (
          <li key={movie._id}>
            <PosterCard movie={movie}>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" icon={<FiEdit2 />} to={`/update-movie/${movie._id}`} className="flex-1">
                  Edit
                </Button>
                <Button size="sm" variant="danger" icon={<FiTrash2 />} onClick={() => setToDelete(movie)} className="flex-1">
                  Delete
                </Button>
              </div>
            </PosterCard>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete ${toDelete?.title ?? "this movie"}?`}
        message="The movie and all its reviews will be removed for everyone. This can't be undone."
        confirmLabel="Delete movie"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

const Library = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const tab = TABS.find((t) => t.path === pathname) ?? TABS[0];

  return (
    <>
      <Helmet>
        <title>{tab.label} · Movie Matrix</title>
      </Helmet>
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-7 px-6 pt-10 pb-20">
        <div>
          <p className="mb-1.5 font-display text-xs font-bold tracking-[0.16em] text-mm-accent uppercase">Your library</p>
          <h1 className="font-display text-4xl font-extrabold text-mm-ink">{tab.label}</h1>
        </div>

        <div role="tablist" aria-label="Library" className="flex gap-1 border-b border-mm-border">
          {TABS.map((t) => {
            const active = t.key === tab.key;
            return (
              <Link
                key={t.key}
                to={t.path}
                role="tab"
                aria-selected={active}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(t.path, { replace: true });
                }}
                className={`-mb-px border-b-[3px] px-4 py-3 font-display text-[15px] font-bold transition-colors ${
                  active ? "border-mm-accent text-mm-ink" : "border-transparent text-mm-muted hover:text-mm-ink"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        <div role="tabpanel">{tab.key === "list" ? <MyListTab /> : <CollectionTab />}</div>
      </div>
    </>
  );
};

export default Library;
