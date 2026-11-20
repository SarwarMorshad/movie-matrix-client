import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { FiChevronDown, FiFilm, FiHeart, FiLogOut, FiMenu, FiPlus, FiSearch, FiUser, FiX } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import Button from "../ui/Button";
import Logo from "./Logo";

const linkClass = ({ isActive }) =>
  `font-display text-sm font-bold tracking-[0.04em] uppercase transition-colors ${
    isActive ? "text-mm-accent" : "text-mm-ink hover:text-mm-accent"
  }`;

// Search box: sends the user to All Movies with ?search=
const SearchForm = ({ className = "", onDone }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/movies?search=${encodeURIComponent(q)}` : "/movies");
    setQuery("");
    onDone?.();
  };

  return (
    <form role="search" onSubmit={submit} className={`flex h-[42px] overflow-hidden rounded-card bg-white ${className}`}>
      <label htmlFor="nav-search" className="sr-only">
        Search movies
      </label>
      <input
        id="nav-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="min-w-0 flex-1 bg-transparent px-3.5 text-sm text-mm-bg placeholder:text-gray-500 focus:outline-none"
      />
      <button type="submit" aria-label="Search" className="flex w-11 items-center justify-center text-mm-bg hover:text-black">
        <FiSearch className="text-lg" aria-hidden="true" />
      </button>
    </form>
  );
};

// Avatar button with Profile / Collection / Watchlist / Log out
const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const ref = useRef(null);

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
  }, [open]);

  const initial = (user.displayName || user.email || "?").charAt(0).toUpperCase();
  const item = "flex items-center gap-3 rounded-card px-3 py-2.5 text-sm text-mm-ink hover:bg-white/5";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-1.5 rounded-full p-0.5 text-mm-muted hover:text-mm-ink"
      >
        <span className="flex size-[42px] items-center justify-center overflow-hidden rounded-full bg-mm-raised font-display font-extrabold text-mm-accent">
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
        <FiChevronDown aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-3 w-64 rounded-lg border border-mm-border bg-mm-surface p-2 shadow-2xl shadow-black/50"
        >
          <div className="border-b border-mm-border px-3 pt-2 pb-3">
            <p className="truncate font-display font-extrabold text-mm-ink">{user.displayName || "Member"}</p>
            <p className="truncate text-xs text-mm-muted">{user.email}</p>
          </div>
          <div className="flex flex-col pt-2" onClick={() => setOpen(false)}>
            <Link role="menuitem" to="/profile" className={item}>
              <FiUser aria-hidden="true" /> Profile
            </Link>
            <Link role="menuitem" to="/my-collection" className={item}>
              <FiFilm aria-hidden="true" /> My collection
            </Link>
            <Link role="menuitem" to="/my-watchlist" className={item}>
              <FiHeart aria-hidden="true" /> Watchlist
            </Link>
            <button role="menuitem" type="button" onClick={onLogout} className={`${item} text-mm-danger-ink`}>
              <FiLogOut aria-hidden="true" /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the page changes
  useEffect(() => setMenuOpen(false), [pathname]);

  const handleLogout = () => logOut().catch((error) => console.error("Logout error:", error));

  const links = (
    <>
      <NavLink to="/" end className={linkClass}>
        Home
      </NavLink>
      <NavLink to="/movies" className={linkClass}>
        Movies
      </NavLink>
      {user && (
        <>
          <NavLink to="/my-watchlist" className={linkClass}>
            Watchlist
          </NavLink>
          <NavLink to="/my-collection" className={linkClass}>
            My collection
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-mm-border bg-mm-surface/95 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex max-w-[1180px] items-center gap-7 px-6 py-3.5">
        <Logo />

        <div className="hidden items-center gap-6 lg:flex">{links}</div>

        <SearchForm className="ml-auto hidden w-full max-w-[300px] md:flex" />

        <div className="hidden items-center gap-2.5 lg:flex">
          {user ? (
            <>
              <Button variant="outline" to="/add-movie" icon={<FiPlus />}>
                Add movie
              </Button>
              <UserMenu user={user} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Button variant="outline" to="/login">
                Log in
              </Button>
              <Button to="/register">Sign up</Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="ml-auto flex size-11 items-center justify-center rounded-card text-2xl text-mm-ink hover:bg-white/5 md:ml-0 lg:hidden"
        >
          {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-mm-border bg-mm-surface px-6 pt-4 pb-6 lg:hidden">
          <SearchForm className="mb-5 md:hidden" onDone={() => setMenuOpen(false)} />
          <div className="flex flex-col gap-4">{links}</div>
          <div className="mt-6 flex flex-wrap gap-3 border-t border-mm-border pt-5">
            {user ? (
              <>
                <Button variant="outline" to="/add-movie" icon={<FiPlus />}>
                  Add movie
                </Button>
                <Button variant="outline" to="/profile" icon={<FiUser />}>
                  Profile
                </Button>
                <Button variant="danger" onClick={handleLogout} icon={<FiLogOut />}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" to="/login">
                  Log in
                </Button>
                <Button to="/register">Sign up</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
