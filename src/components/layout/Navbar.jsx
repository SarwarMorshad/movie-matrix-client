import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { FiChevronDown, FiFilm, FiHeart, FiLogOut, FiPlus, FiSearch, FiUser, FiX } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import Logo from "./Logo";
import { hasHero } from "../../utils/heroPages";

// Netflix-style top bar: transparent over the home hero, solid once you scroll,
// small text links, an expanding search, and a square avatar menu.

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/tv", label: "TV Shows" },
  { to: "/movies", label: "Movies" },
  { to: "/my-watchlist", label: "My List", auth: true },
  { to: "/my-collection", label: "My Collection", auth: true },
];

// Closes a popup on outside click or Escape
const useDismiss = (open, setOpen, ref) => {
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (e.type === "keydown" ? e.key === "Escape" : !ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open, setOpen, ref]);
};

// Search icon that opens into a box; Enter goes to All Movies with ?search=
const ExpandingSearch = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/movies?search=${encodeURIComponent(q)}`);
  };

  const close = () => {
    setQuery("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search movies"
        className="flex size-10 items-center justify-center text-xl text-mm-ink hover:text-mm-accent"
      >
        <FiSearch aria-hidden="true" />
      </button>
    );
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      onKeyDown={(e) => e.key === "Escape" && close()}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && !query && close()}
      className="flex h-10 w-[min(70vw,260px)] items-center gap-2 border border-white/80 bg-black/80 px-2.5 motion-safe:animate-[searchOpen_200ms_ease-out]"
    >
      <FiSearch aria-hidden="true" className="shrink-0 text-lg text-mm-ink" />
      <label htmlFor="nav-search" className="sr-only">
        Search movies
      </label>
      <input
        id="nav-search"
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Titles, genres, people"
        className="min-w-0 flex-1 bg-transparent text-sm text-mm-ink placeholder:text-mm-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="button"
        onClick={close}
        aria-label="Close search"
        className="shrink-0 text-mm-muted hover:text-mm-ink"
      >
        <FiX aria-hidden="true" />
      </button>
    </form>
  );
};

// "Browse" dropdown that replaces the links on small screens
const BrowseMenu = ({ links }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, setOpen, ref);

  return (
    <div ref={ref} className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-10 items-center gap-1 text-sm font-semibold text-mm-ink"
      >
        Browse <FiChevronDown aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-full left-1/2 z-50 mt-3 w-56 -translate-x-1/2 border-t-2 border-mm-ink bg-black/95 py-2"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-center text-sm hover:bg-white/5 ${isActive ? "font-bold text-mm-ink" : "text-mm-muted"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

// Square avatar + caret, opening the account menu
const ProfileMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const ref = useRef(null);
  useDismiss(open, setOpen, ref);

  const initial = (user.displayName || user.email || "?").charAt(0).toUpperCase();
  const avatar = (size) => (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-mm-accent font-display font-extrabold text-mm-on-accent`}
    >
      {user.photoURL && !imageFailed ? (
        <img
          src={user.photoURL}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
  const item = "flex items-center gap-3 px-4 py-2.5 text-sm text-mm-ink hover:underline";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 text-mm-ink"
      >
        {avatar("size-8")}
        <FiChevronDown aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-4 w-60 border border-white/15 bg-black/95 shadow-2xl"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {avatar("size-8")}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-mm-ink">{user.displayName || "Member"}</p>
              <p className="truncate text-xs text-mm-muted">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-col py-1" onClick={() => setOpen(false)}>
            <Link role="menuitem" to="/profile" className={item}>
              <FiUser aria-hidden="true" className="text-mm-muted" /> Account
            </Link>
            <Link role="menuitem" to="/my-watchlist" className={item}>
              <FiHeart aria-hidden="true" className="text-mm-muted" /> My List
            </Link>
            <Link role="menuitem" to="/my-collection" className={item}>
              <FiFilm aria-hidden="true" className="text-mm-muted" /> My Collection
            </Link>
            <Link role="menuitem" to="/add-movie" className={item}>
              <FiPlus aria-hidden="true" className="text-mm-muted" /> Add a movie
            </Link>
          </div>
          <button
            role="menuitem"
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 border-t border-white/15 px-4 py-3.5 text-sm text-mm-ink hover:underline"
          >
            <FiLogOut aria-hidden="true" /> Sign out of Movie Matrix
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = NAV_LINKS.filter((l) => !l.auth || user);
  const handleLogout = () => logOut().catch((error) => console.error("Logout error:", error));

  // Only the home page has a hero to sit on; elsewhere the bar is always solid
  const transparent = hasHero(pathname) && !scrolled;
  // Logged-out landing page: just the logo and Sign in, like a streaming sign-up page
  const minimal = pathname === "/" && !user;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        transparent ? "bg-linear-to-b from-black/80 to-transparent" : "bg-mm-bg shadow-lg shadow-black/30"
      }`}
    >
      <nav aria-label="Main" className="flex h-16 items-center gap-3 px-4 sm:gap-6 sm:px-8 lg:h-[68px] lg:px-14">
        <Logo />

        {!minimal && (
          <>
            <ul className="hidden items-center gap-5 lg:flex">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `text-sm transition-colors ${isActive ? "font-bold text-mm-ink" : "text-mm-ink/75 hover:text-mm-muted"}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <BrowseMenu links={links} />
          </>
        )}

        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          {!minimal && <ExpandingSearch />}
          {user ? (
            <ProfileMenu user={user} onLogout={handleLogout} />
          ) : (
            <Link
              to="/login"
              className="rounded-[4px] bg-mm-accent px-4 py-1.5 text-sm font-semibold text-mm-on-accent hover:bg-mm-accent-hover"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
