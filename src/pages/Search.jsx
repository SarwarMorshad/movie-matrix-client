import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { FiSearch, FiX } from "react-icons/fi";
import * as api from "../api/api";
import { MediaRow, Pagination, PosterCard, Spinner } from "../components/ui";
import TitleCard from "../components/search/TitleCard";
import useDebounced from "../hooks/useDebounced";

const TYPES = [
  { value: "all", label: "All" },
  { value: "film", label: "Movies" },
  { value: "series", label: "TV Shows" },
];

const Message = ({ title, children }) => (
  <div className="flex flex-col items-center gap-2 px-6 py-24 text-center">
    <p className="font-display text-2xl font-extrabold text-mm-ink">{title}</p>
    <p className="max-w-md text-mm-muted">{children}</p>
  </div>
);

/**
 * /search?q=&type=all|film|series&page=
 * One search for everything: TMDB movies and series, plus the members' own movies.
 * Results update as you type; the navbar search lands here too.
 */
const Search = () => {
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const type = TYPES.some((t) => t.value === params.get("type")) ? params.get("type") : "all";
  const page = Math.max(parseInt(params.get("page"), 10) || 1, 1);

  const [text, setText] = useState(q);
  const typed = useDebounced(text.trim(), 350);
  const lastWritten = useRef(q);
  const inputRef = useRef(null);
  const [state, setState] = useState({ status: "idle" });

  // Typing here updates ?q= (without filling the history with every letter)
  useEffect(() => {
    if (typed === lastWritten.current) return;
    lastWritten.current = typed;
    const next = new URLSearchParams(params);
    typed ? next.set("q", typed) : next.delete("q");
    next.delete("page");
    setParams(next, { replace: true });
  }, [typed, params, setParams]);

  // A new ?q= from elsewhere (the navbar) fills the box
  useEffect(() => {
    if (q !== lastWritten.current) {
      lastWritten.current = q;
      setText(q);
    }
  }, [q]);

  useEffect(() => {
    if (!q) return setState({ status: "idle" });
    const controller = new AbortController();
    setState((s) => ({ ...s, status: "loading" }));
    api
      .search(q, { type, page }, { signal: controller.signal })
      .then((data) => setState({ status: "done", data }))
      .catch((err) => err.name !== "CanceledError" && setState({ status: "error" }));
    return () => controller.abort();
  }, [q, type, page]);

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

  const { status, data } = state;
  const members = type === "all" ? data?.members || [] : [];
  const nothingFound = status === "done" && !data.results.length && !members.length;

  return (
    <div className="flex min-h-screen flex-col gap-8 pt-24 pb-16">
      <Helmet>
        <title>{q ? `“${q}” · Search · Movie Matrix` : "Search · Movie Matrix"}</title>
        <meta name="description" content="Search movies and TV shows, and the movies our members have added." />
      </Helmet>

      <div className="flex flex-col gap-5 px-4 sm:px-8 lg:px-14">
        <h1 className="font-display text-3xl font-extrabold text-mm-ink md:text-4xl">Search</h1>

        <form role="search" onSubmit={(e) => e.preventDefault()} className="relative max-w-3xl">
          <label htmlFor="page-search" className="sr-only">
            Search movies and TV shows
          </label>
          <FiSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-xl text-mm-muted" />
          <input
            id="page-search"
            ref={inputRef}
            type="search"
            autoFocus={!q}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Movies, TV shows, members' picks"
            autoComplete="off"
            className="h-14 w-full rounded-[4px] border border-white/30 bg-black/60 pr-12 pl-12 text-lg text-mm-ink placeholder:text-mm-faint focus:border-mm-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {text && (
            <button
              type="button"
              onClick={() => {
                setText("");
                inputRef.current?.focus(); // keep typing without clicking the box again
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center text-xl text-mm-muted hover:text-mm-ink"
            >
              <FiX aria-hidden="true" />
            </button>
          )}
        </form>

        <div role="group" aria-label="Show" className="flex flex-wrap items-center gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={type === t.value}
              onClick={() => setParam("type", t.value === "all" ? "" : t.value)}
              className={`h-9 rounded-full border px-4 text-sm font-semibold transition-colors ${
                type === t.value
                  ? "border-mm-ink bg-mm-ink text-mm-bg"
                  : "border-white/30 text-mm-ink hover:border-mm-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
          {status === "done" && data.total > 0 && (
            <p aria-live="polite" className="ml-2 text-sm text-mm-muted">
              {data.total.toLocaleString()} {data.total === 1 ? "title" : "titles"}
            </p>
          )}
        </div>
      </div>

      {status === "idle" && (
        <Message title="Find something to watch">Search by title across movies, TV shows and the movies our members have added.</Message>
      )}
      {status === "error" && <Message title="Search isn't working right now">Please check your connection and try again.</Message>}
      {status === "loading" && !data && <Spinner fullPage label="Searching" />}
      {nothingFound && (
        <Message title={`No matches for “${q}”`}>
          Check the spelling, try fewer words{type !== "all" ? ", or search all titles" : ""}.
        </Message>
      )}

      {data && !nothingFound && status !== "error" && status !== "idle" && (
        <div className={`flex flex-col gap-10 transition-opacity ${status === "loading" ? "opacity-50" : ""}`} aria-busy={status === "loading"}>
          {page === 1 && (
            <MediaRow
              id="search-members"
              title="From our members"
              items={members}
              renderItem={(movie) => <PosterCard movie={movie} />}
              getKey={(movie) => movie._id}
            />
          )}

          {data.results.length > 0 && (
            <section aria-labelledby="search-titles" className="flex flex-col gap-6 px-4 sm:px-8 lg:px-14">
              <h2 id="search-titles" className="font-display text-lg font-bold text-mm-ink md:text-xl">
                {{ all: "Movies & TV shows", film: "Movies", series: "TV shows" }[type]}
              </h2>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {data.results.map((item) => (
                  <li key={`${item.type}-${item.id}`}>
                    <TitleCard item={item} />
                  </li>
                ))}
              </ul>
              <Pagination page={data.page} totalPages={data.totalPages} onChange={goToPage} />
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
