import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import * as api from "../api/api";
import { Button, MediaRow, Pagination, Spinner } from "../components/ui";
import SeriesCard from "../components/tv/SeriesCard";
import TvHero from "../components/tv/TvHero";

const ROWS = [
  { list: "trending", title: "Trending Now" },
  { list: "popular", title: "Popular" },
  { list: "top_rated", title: "Top Rated" },
  { list: "on_the_air", title: "New Episodes This Week" },
  { list: "airing_today", title: "Airing Today" },
];
const SORTS = [
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
];

const selectClass =
  "h-10 rounded-[4px] border border-white/40 bg-black/70 px-3 text-sm font-semibold text-mm-ink focus:border-mm-ink focus:outline-none";

// Rows view (no genre picked): hero + Netflix-style rows
const TvRows = ({ genreNames }) => {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.allSettled(ROWS.map((r) => api.getTvList(r.list))).then((results) => {
      if (results.every((r) => r.status === "rejected")) return setError(true);
      setRows(ROWS.map((r, i) => ({ ...r, items: results[i].status === "fulfilled" ? results[i].value.results : [] })));
    });
  }, []);

  if (error) return <LoadError />;
  if (!rows) return <Spinner fullPage label="Loading TV shows" />;

  const featured = rows[0].items.find((s) => s.backdropUrl);
  return (
    <>
      <TvHero series={featured} genreNames={(featured?.genreIds || []).map(genreNames).filter(Boolean).slice(0, 3)} />
      <div className="relative z-10 -mt-12 flex flex-col gap-10 pb-16 md:-mt-20">
        {rows.map((row) => (
          <MediaRow
            key={row.list}
            id={`row-${row.list}`}
            title={row.title}
            items={row.items.filter((s) => s.id !== featured?.id || row.list !== "trending")}
            renderItem={(s) => <SeriesCard series={s} />}
          />
        ))}
      </div>
    </>
  );
};

// Genre view: grid of series in one genre, with sort and pages
const TvGenreGrid = ({ genre, sort, page, onPage }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    setError(false);
    api
      .discoverTv({ genre, sort, page })
      .then((data) => !cancelled && setResult(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [genre, sort, page]);

  if (error) return <LoadError />;
  if (!result) return <Spinner fullPage label="Loading TV shows" />;

  return (
    <div className="flex flex-col gap-10 px-4 pt-4 pb-16 sm:px-8 lg:px-14">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {result.results.map((s) => (
          <li key={s.id}>
            <SeriesCard series={s} />
          </li>
        ))}
      </ul>
      <Pagination page={result.page} totalPages={result.totalPages} onChange={onPage} />
    </div>
  );
};

const LoadError = () => (
  <div className="flex flex-col items-center gap-3 px-6 py-32 text-center">
    <p className="font-display text-2xl font-extrabold text-mm-ink">Couldn't load TV shows</p>
    <p className="text-mm-muted">Please check your connection and try again.</p>
    <Button className="mt-2" onClick={() => window.location.reload()}>
      Try again
    </Button>
  </div>
);

const TvShows = () => {
  const [params, setParams] = useSearchParams();
  const genre = params.get("genre") || "";
  const sort = params.get("sort") || "popular";
  const page = Math.max(parseInt(params.get("page"), 10) || 1, 1);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    api.getTvGenres().then(setGenres).catch(() => {});
  }, []);

  const genreName = useMemo(() => {
    const byId = Object.fromEntries(genres.map((g) => [g.id, g.name]));
    return (id) => byId[id];
  }, [genres]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  };
  const goToPage = (p) => {
    setParam("page", p > 1 ? String(p) : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentGenre = genre ? genreName(Number(genre)) : null;

  return (
    <div className="relative">
      <Helmet>
        <title>{currentGenre ? `${currentGenre} TV shows` : "TV shows"} · Movie Matrix</title>
        <meta name="description" content="Browse trending, popular and top rated TV series, or explore by genre." />
      </Helmet>

      {/* Page title bar with the genre picker, under the navbar like on streaming sites */}
      <div className={`z-20 flex flex-wrap items-center gap-x-6 gap-y-3 px-4 sm:px-8 lg:px-14 ${genre ? "pt-24 pb-6" : "absolute inset-x-0 top-16 pt-4 lg:top-[68px]"}`}>
        <h1 className="font-display text-3xl font-extrabold text-mm-ink md:text-4xl">
          {currentGenre ? (
            <>
              <span className="text-mm-muted">TV Shows ›</span> {currentGenre}
            </>
          ) : (
            "TV Shows"
          )}
        </h1>
        <label htmlFor="tv-genre" className="sr-only">
          Genre
        </label>
        <select id="tv-genre" value={genre} onChange={(e) => setParam("genre", e.target.value)} className={selectClass}>
          <option value="">Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        {genre && (
          <>
            <label htmlFor="tv-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="tv-sort"
              value={sort}
              onChange={(e) => setParam("sort", e.target.value === "popular" ? "" : e.target.value)}
              className={selectClass}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {genre ? (
        <TvGenreGrid genre={genre} sort={sort} page={page} onPage={goToPage} />
      ) : (
        <TvRows genreNames={genreName} />
      )}
    </div>
  );
};

export default TvShows;
