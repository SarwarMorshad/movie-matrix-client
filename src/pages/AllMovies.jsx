import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { FiSearch, FiX } from "react-icons/fi";
import * as api from "../api/api";
import { Button, Pagination, PosterCard } from "../components/ui";

const PAGE_SIZE = 20;
const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest releases" },
  { value: "added", label: "Recently added" },
  { value: "title", label: "Title A–Z" },
];
const RATING_OPTIONS = [
  { value: "", label: "Any rating" },
  { value: "7", label: "7+" },
  { value: "8", label: "8+" },
  { value: "9", label: "9+" },
];

const fieldClass =
  "h-11 w-full rounded-card border border-mm-field bg-mm-bg px-3 text-[15px] text-mm-ink focus:border-mm-accent focus:outline-none";

const Field = ({ id, label, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label htmlFor={id} className="text-xs font-semibold text-mm-muted">
      {label}
    </label>
    {children}
  </div>
);

const SkeletonGrid = () => (
  <ul aria-hidden="true" className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    {Array.from({ length: 10 }, (_, i) => (
      <li key={i} className="flex flex-col gap-2.5">
        <div className="aspect-2/3 animate-pulse rounded-card bg-mm-raised" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-mm-raised" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-mm-raised" />
      </li>
    ))}
  </ul>
);

const AllMovies = () => {
  // Every filter lives in the URL, so results are shareable and Back works
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const genre = params.get("genre") || "";
  const language = params.get("language") || "";
  const minRating = params.get("minRating") || "";
  const sort = params.get("sort") || "rating";
  const page = Math.max(parseInt(params.get("page"), 10) || 1, 1);

  const [searchInput, setSearchInput] = useState(search);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  // Change one filter (empty value removes it) and go back to page 1.
  // Built from the address bar as it is right now (not this render's copy), so
  // a delayed search-as-you-type update can't bring back cleared filters.
  const update = (changes, { replace = false } = {}) => {
    const next = new URLSearchParams(window.location.search);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    if (!("page" in changes)) next.delete("page");
    setParams(next, { replace });
  };

  // Genre chips and language options
  useEffect(() => {
    api.getGenreCounts().then(setGenres).catch(() => {});
    api.getLanguageCounts().then(setLanguages).catch(() => {});
  }, []);

  // Keep the box in sync when the search changes from outside (navbar search, Back)
  useEffect(() => setSearchInput(search), [search]);

  // Search as you type, 400 ms after the last keystroke
  useEffect(() => {
    if (searchInput.trim() === search) return;
    const timer = setTimeout(() => update({ search: searchInput.trim() }, { replace: true }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Load the current page of results
  useEffect(() => {
    let cancelled = false;
    setError(false);
    api
      .browseMovies({
        search: search || undefined,
        genre: genre || undefined,
        language: language || undefined,
        minRating: minRating || undefined,
        sort,
        page,
        limit: PAGE_SIZE,
      })
      .then((data) => !cancelled && setResult(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [search, genre, language, minRating, sort, page]);

  const goToPage = (p) => {
    update({ page: p > 1 ? String(p) : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = Boolean(search || genre || language || minRating);
  const clearFilters = () => {
    setSearchInput("");
    setParams(sort !== "rating" ? { sort } : {});
  };

  const movies = result?.movies ?? [];
  const from = result ? (result.page - 1) * result.limit + 1 : 0;
  const to = result ? from + movies.length - 1 : 0;

  return (
    <>
      <Helmet>
        <title>{genre ? `${genre} · Members' movies` : "Members' movies"} · Movie Matrix</title>
        <meta name="description" content="Browse, search and filter the movies Movie Matrix members have added." />
      </Helmet>

      <div className="border-b border-mm-border bg-mm-surface">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-6 pt-9 pb-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1.5 font-display text-xs font-bold tracking-[0.16em] text-mm-accent uppercase">From our members</p>
              <h1 className="font-display text-4xl font-extrabold text-mm-ink">{genre ? `${genre} Movies` : "Members' Movies"}</h1>
            </div>
            <p aria-live="polite" className="text-sm text-mm-muted">
              {result && (result.total ? `Showing ${from}–${to} of ${result.total} movies` : "No movies found")}
            </p>
          </div>

          <form role="search" onSubmit={(e) => e.preventDefault()} className="flex flex-wrap items-end gap-3">
            <Field id="filter-search" label="Search" className="min-w-[240px] flex-[3_1_280px]">
              <div className="relative">
                <FiSearch aria-hidden="true" className="absolute top-1/2 left-3 -translate-y-1/2 text-mm-muted" />
                <input
                  id="filter-search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by title..."
                  className={`${fieldClass} pl-9`}
                />
              </div>
            </Field>
            <Field id="filter-language" label="Language" className="flex-[1_1_150px]">
              <select
                id="filter-language"
                value={language}
                onChange={(e) => update({ language: e.target.value })}
                className={fieldClass}
              >
                <option value="">All languages</option>
                {languages.map((l) => (
                  <option key={l.language} value={l.language}>
                    {l.language} ({l.count})
                  </option>
                ))}
              </select>
            </Field>
            <Field id="filter-rating" label="Rating" className="flex-[1_1_130px]">
              <select
                id="filter-rating"
                value={minRating}
                onChange={(e) => update({ minRating: e.target.value })}
                className={fieldClass}
              >
                {RATING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="filter-sort" label="Sort by" className="flex-[1_1_150px]">
              <select
                id="filter-sort"
                value={sort}
                onChange={(e) => update({ sort: e.target.value === "rating" ? "" : e.target.value })}
                className={fieldClass}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </form>

          <div role="group" aria-label="Genre" className="flex flex-wrap gap-2">
            {[{ genre: "", count: null }, ...genres].map((g) => {
              const active = g.genre === genre;
              return (
                <button
                  key={g.genre || "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ genre: g.genre })}
                  className={`h-9 rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
                    active
                      ? "border-mm-accent bg-mm-accent text-mm-on-accent"
                      : "border-mm-field text-mm-ink/85 hover:border-mm-muted hover:text-mm-ink"
                  }`}
                >
                  {g.genre || "All"}
                  {g.count != null && <span className={active ? "" : "text-mm-muted"}> · {g.count}</span>}
                </button>
              );
            })}
          </div>

          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-mm-muted">Active:</span>
              {search && <Chip label={`“${search}”`} onRemove={() => update({ search: "" })} />}
              {language && <Chip label={language} onRemove={() => update({ language: "" })} />}
              {minRating && <Chip label={`Rating ${minRating}+`} onRemove={() => update({ minRating: "" })} />}
              <button type="button" onClick={clearFilters} className="ml-1 font-semibold text-mm-accent hover:underline">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <section aria-label="Results" className="mx-auto flex w-full max-w-[1180px] flex-col gap-10 px-6 pt-9 pb-16">
        {error ? (
          <EmptyState title="Couldn't load movies" text="Please check your connection and try again.">
            <Button onClick={() => window.location.reload()}>Try again</Button>
          </EmptyState>
        ) : !result ? (
          <SkeletonGrid />
        ) : movies.length === 0 ? (
          <EmptyState title="No movies match these filters" text="Try another genre or search, or clear the filters.">
            <Button onClick={clearFilters}>Clear filters</Button>
          </EmptyState>
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movies.map((movie) => (
                <li key={movie._id}>
                  <PosterCard movie={movie} />
                </li>
              ))}
            </ul>
            <Pagination page={result.page} totalPages={result.totalPages} onChange={goToPage} />
          </>
        )}
      </section>
    </>
  );
};

const Chip = ({ label, onRemove }) => (
  <span className="flex h-8 items-center gap-1.5 rounded-full border border-mm-accent pr-1.5 pl-3 text-mm-ink">
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter ${label}`}
      className="flex size-6 items-center justify-center rounded-full hover:bg-white/10"
    >
      <FiX aria-hidden="true" />
    </button>
  </span>
);

const EmptyState = ({ title, text, children }) => (
  <div className="flex flex-col items-center gap-3 rounded-lg border border-mm-border bg-mm-surface px-6 py-16 text-center">
    <p className="font-display text-2xl font-extrabold text-mm-ink">{title}</p>
    <p className="text-mm-muted">{text}</p>
    <div className="mt-2">{children}</div>
  </div>
);

export default AllMovies;
