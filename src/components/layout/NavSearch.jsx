import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FiSearch, FiX } from "react-icons/fi";
import * as api from "../../api/api";
import useDebounced from "../../hooks/useDebounced";

const MAX_TITLES = 6;
const MAX_MEMBERS = 3;

// Suggestions for a query: TMDB titles first, then members' movies, each with where it leads
const toSuggestions = (data) => [
  ...data.results.slice(0, MAX_TITLES).map((t) => ({
    key: `${t.type}-${t.id}`,
    to: t.type === "series" ? `/tv/${t.id}` : `/film/${t.id}`,
    title: t.title,
    posterUrl: t.posterUrl,
    meta: [t.year, t.type === "series" ? "TV show" : "Movie"].filter(Boolean).join(" · "),
  })),
  ...data.members.slice(0, MAX_MEMBERS).map((m) => ({
    key: `member-${m._id}`,
    to: `/movies/${m._id}`,
    title: m.title,
    posterUrl: m.posterUrl,
    meta: [m.releaseYear, "Members' movie"].filter(Boolean).join(" · "),
  })),
];

/**
 * Navbar search: a search icon that opens into a box with instant suggestions.
 * Arrow keys move through them, Enter opens one, or shows every result on /search.
 */
const NavSearch = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState(null); // null = nothing to show yet
  const [active, setActive] = useState(-1);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const typed = useDebounced(query.trim(), 250);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActive(-1);
    if (typed.length < 2) return setSuggestions(null);
    const controller = new AbortController();
    api
      .search(typed, {}, { signal: controller.signal })
      .then((data) => setSuggestions(toSuggestions(data)))
      .catch(() => {});
    return () => controller.abort();
  }, [typed]);

  const close = () => {
    setQuery("");
    setSuggestions(null);
    setOpen(false);
  };

  const go = (to) => {
    close();
    navigate(to);
  };

  const submit = (e) => {
    e.preventDefault();
    if (active >= 0 && suggestions?.[active]) return go(suggestions[active].to);
    const q = query.trim();
    if (q) go(`/search?q=${encodeURIComponent(q)}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") return close();
    if (!suggestions?.length || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    e.preventDefault();
    // Cycle through -1 (just the typed text) and each suggestion
    const step = e.key === "ArrowDown" ? 1 : -1;
    const count = suggestions.length + 1;
    setActive((i) => ((i + 1 + step + count) % count) - 1);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex size-10 items-center justify-center text-xl text-mm-ink hover:text-mm-accent"
      >
        <FiSearch aria-hidden="true" />
      </button>
    );
  }

  const showList = focused && suggestions !== null && query.trim().length >= 2;
  const optionId = (i) => `nav-search-option-${i}`;

  return (
    <form
      role="search"
      onSubmit={submit}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setFocused(false);
        if (!query) close();
      }}
      className="relative"
    >
      <div className="flex h-10 w-[min(70vw,280px)] items-center gap-2 border border-white/80 bg-black/80 px-2.5 motion-safe:animate-[searchOpen_200ms_ease-out]">
        <FiSearch aria-hidden="true" className="shrink-0 text-lg text-mm-ink" />
        <label htmlFor="nav-search" className="sr-only">
          Search movies and TV shows
        </label>
        <input
          id="nav-search"
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls="nav-search-list"
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Titles, TV shows, members' picks"
          className="min-w-0 flex-1 bg-transparent text-sm text-mm-ink placeholder:text-mm-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <button type="button" onClick={close} aria-label="Close search" className="shrink-0 text-mm-muted hover:text-mm-ink">
          <FiX aria-hidden="true" />
        </button>
      </div>

      {showList && (
        <div className="absolute top-full right-0 z-50 mt-1 w-[min(92vw,360px)] overflow-hidden rounded-[4px] border border-mm-border bg-mm-surface shadow-2xl shadow-black/60">
          <ul id="nav-search-list" role="listbox" aria-label="Suggestions" className="max-h-[60vh] overflow-y-auto py-1">
            {suggestions.map((s, i) => (
              <li
                key={s.key}
                id={optionId(i)}
                role="option"
                aria-selected={active === i}
                onMouseDown={(e) => e.preventDefault()} // keep focus so the click lands
                onClick={() => go(s.to)}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${active === i ? "bg-mm-raised" : ""}`}
              >
                <span className="h-14 w-10 shrink-0 overflow-hidden rounded-[3px] bg-mm-raised">
                  {s.posterUrl && <img src={s.posterUrl} alt="" loading="lazy" className="size-full object-cover" />}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-mm-ink">{s.title}</span>
                  <span className="truncate text-xs text-mm-muted">{s.meta}</span>
                </span>
              </li>
            ))}
            {suggestions.length === 0 && <li className="px-3 py-3 text-sm text-mm-muted">No quick matches</li>}
          </ul>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
            className="block w-full border-t border-mm-border px-3 py-2.5 text-left text-sm font-semibold text-mm-accent hover:bg-mm-raised"
          >
            See all results for “{query.trim()}” ›
          </button>
        </div>
      )}
    </form>
  );
};

export default NavSearch;
