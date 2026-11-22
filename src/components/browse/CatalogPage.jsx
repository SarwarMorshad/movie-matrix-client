import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { Button, MediaRow, Pagination, Spinner } from "../ui";
import FeaturedHero from "./FeaturedHero";

const SORTS = [
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
];

const selectClass =
  "h-10 rounded-[4px] border border-white/40 bg-black/70 px-3 text-sm font-semibold text-mm-ink focus:border-mm-ink focus:outline-none";

const LoadError = ({ noun }) => (
  <div className="flex flex-col items-center gap-3 px-6 py-32 text-center">
    <p className="font-display text-2xl font-extrabold text-mm-ink">Couldn't load {noun}</p>
    <p className="text-mm-muted">Please check your connection and try again.</p>
    <Button className="mt-2" onClick={() => window.location.reload()}>
      Try again
    </Button>
  </div>
);

// Rows view (no genre picked): featured hero + Netflix-style rows
const CatalogRows = ({ config, genreName }) => {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.allSettled(config.rows.map((r) => config.getList(r.list))).then((results) => {
      if (results.every((r) => r.status === "rejected")) return setError(true);
      setRows(config.rows.map((r, i) => ({ ...r, items: results[i].status === "fulfilled" ? results[i].value.results : [] })));
    });
  }, [config]);

  if (error) return <LoadError noun={config.noun} />;
  if (!rows) return <Spinner fullPage label={`Loading ${config.noun}`} />;

  const featured = rows[0].items.find((item) => item.backdropUrl);
  return (
    <>
      <FeaturedHero
        item={featured}
        eyebrow={config.heroEyebrow}
        to={featured ? config.linkTo(featured) : "#"}
        listType={config.listType}
        genreNames={(featured?.genreIds || []).map(genreName).filter(Boolean).slice(0, 3)}
      />
      <div className="relative z-10 -mt-12 flex flex-col gap-10 pb-16 md:-mt-20">
        {rows.map((row, i) => (
          <MediaRow
            key={row.list}
            id={`row-${row.list}`}
            title={row.title}
            items={i === 0 ? row.items.filter((item) => item.id !== featured?.id) : row.items}
            renderItem={config.renderCard}
          />
        ))}
        {config.extraRows}
      </div>
    </>
  );
};

// Genre view: grid of one genre, with sort and pages
const CatalogGrid = ({ config, genre, sort, page, onPage }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    setError(false);
    config
      .discover({ genre, sort, page })
      .then((data) => !cancelled && setResult(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [config, genre, sort, page]);

  if (error) return <LoadError noun={config.noun} />;
  if (!result) return <Spinner fullPage label={`Loading ${config.noun}`} />;

  return (
    <div className="flex flex-col gap-10 px-4 pt-4 pb-16 sm:px-8 lg:px-14">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {result.results.map((item) => (
          <li key={item.id}>{config.renderCard(item)}</li>
        ))}
      </ul>
      <Pagination page={result.page} totalPages={result.totalPages} onChange={onPage} />
    </div>
  );
};

/**
 * Shared layout for the TV Shows and Movies pages: a title bar with a genre
 * picker; without a genre, a featured hero and rows; with one, a sortable grid.
 * Pass a config object that stays the same between renders (define it outside the component):
 *
 *   title, noun          "TV Shows", "TV shows"
 *   rows                 [{ list, title }] — the first one feeds the hero
 *   getList(list)        -> { results }
 *   getGenres()          -> [{ id, name }]
 *   discover(params)     -> { results, page, totalPages }   params: { genre, sort, page }
 *   renderCard(item)     the card for one item
 *   linkTo(item)         its page, for the hero's "More info"
 *   heroEyebrow, listType, description
 *   extraRows            optional elements shown after the rows (e.g. members' movies)
 */
const CatalogPage = ({ config }) => {
  const [params, setParams] = useSearchParams();
  const genre = params.get("genre") || "";
  const sort = params.get("sort") || "popular";
  const page = Math.max(parseInt(params.get("page"), 10) || 1, 1);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    config.getGenres().then(setGenres).catch(() => {});
  }, [config]);

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
  const id = config.noun.replace(/\W+/g, "-");

  return (
    <div className="relative">
      <Helmet>
        <title>{`${currentGenre ? `${currentGenre} ${config.noun}` : config.title} · Movie Matrix`}</title>
        <meta name="description" content={config.description} />
      </Helmet>

      {/* Page title bar with the genre picker, under the navbar like on streaming sites */}
      <div className={`z-20 flex flex-wrap items-center gap-x-6 gap-y-3 px-4 sm:px-8 lg:px-14 ${genre ? "pt-24 pb-6" : "absolute inset-x-0 top-16 pt-4 lg:top-[68px]"}`}>
        <h1 className="font-display text-3xl font-extrabold text-mm-ink md:text-4xl">
          {currentGenre ? (
            <>
              <span className="text-mm-muted">{config.title} ›</span> {currentGenre}
            </>
          ) : (
            config.title
          )}
        </h1>
        <label htmlFor={`${id}-genre`} className="sr-only">
          Genre
        </label>
        <select id={`${id}-genre`} value={genre} onChange={(e) => setParam("genre", e.target.value)} className={selectClass}>
          <option value="">Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        {genre && (
          <>
            <label htmlFor={`${id}-sort`} className="sr-only">
              Sort by
            </label>
            <select
              id={`${id}-sort`}
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
        <CatalogGrid config={config} genre={genre} sort={sort} page={page} onPage={goToPage} />
      ) : (
        <CatalogRows config={config} genreName={genreName} />
      )}
    </div>
  );
};

export default CatalogPage;
