import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX, FiLogOut, FiHeart, FiUser } from "react-icons/fi";
import { MdMovie, MdVideoLibrary } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLogout = () => {
    logOut()
      .then(() => {
        // Success handled by auth state change
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  // Default avatar fallback
  const defaultAvatar = "https://i.ibb.co/2FbxWkt/user.png";
  const userAvatar = imageError ? defaultAvatar : user?.photoURL || defaultAvatar;

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : "text-white hover:text-primary transition-colors"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/movies"
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : "text-white hover:text-primary transition-colors"
          }
        >
          All Movies
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink
              to="/add-movie"
              className={({ isActive }) =>
                isActive ? "text-primary font-semibold" : "text-white hover:text-primary transition-colors"
              }
            >
              Add Movie
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-collection"
              className={({ isActive }) =>
                isActive ? "text-primary font-semibold" : "text-white hover:text-primary transition-colors"
              }
            >
              My Collection
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-watchlist"
              className={({ isActive }) =>
                isActive ? "text-primary font-semibold" : "text-white hover:text-primary transition-colors"
              }
            >
              Watchlist
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-movie-dark/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold font-heading group">
            <MdMovie className="text-primary text-3xl group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-white">
              Movie <span className="text-primary">Matrix</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8 text-base font-medium">{navLinks}</ul>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {user ? (
              <div className="dropdown dropdown-end">
                {/* Avatar Button */}
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform duration-300"
                >
                  <div className="w-11 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2 hover:ring-secondary transition-all duration-300">
                    <img
                      src={userAvatar}
                      alt={user.displayName || "User"}
                      onError={() => setImageError(true)}
                      referrerPolicy="no-referrer"
                      className="hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  {/* Online Status Dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-base-100 rounded-full animate-pulse"></span>
                </div>

                {/* Dropdown Menu - BEAUTIFUL TAILWIND DESIGN */}
                <ul
                  tabIndex={0}
                  className="menu dropdown-content mt-4 z-[1] w-80 bg-gradient-to-br from-base-200 to-base-300 rounded-2xl shadow-2xl border border-white/10 p-0 overflow-hidden animate-fade-in-down"
                >
                  {/* User Info Header with Gradient */}
                  <li className="menu-title p-0 m-0">
                    <div className="bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm px-5 py-4 rounded-t-2xl">
                      <div className="flex items-center gap-3">
                        {/* Large Avatar */}
                        <div className="avatar">
                          <div className="w-16 rounded-full ring-2 ring-primary shadow-lg hover:scale-110 transition-transform duration-300">
                            <img
                              src={userAvatar}
                              alt={user.displayName || "User"}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                        {/* User Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-lg">{user.displayName || "User"}</span>
                            <HiSparkles className="text-yellow-400 text-lg animate-bounce" />
                          </div>
                          <span className="text-gray-400 text-sm">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </li>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2"></div>

                  {/* Navigation Section */}
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                      Navigation
                    </p>

                    {/* Profile */}
                    <li className="mb-1">
                      <Link
                        to="/profile"
                        className="group relative bg-gradient-to-r from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 rounded-xl px-4 py-3 text-white hover:text-blue-400 transition-all duration-300 hover:translate-x-2 hover:shadow-lg hover:shadow-blue-500/20"
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon Badge */}
                          <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                            <FiUser className="text-2xl text-blue-400" />
                          </div>
                          {/* Text */}
                          <div className="flex-1">
                            <p className="font-bold text-base">My Profile</p>
                            <p className="text-xs text-gray-400">View your info</p>
                          </div>
                        </div>
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      </Link>
                    </li>

                    {/* My Collection */}
                    <li className="mb-1">
                      <Link
                        to="/my-collection"
                        className="group relative bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 rounded-xl px-4 py-3 text-white hover:text-primary transition-all duration-300 hover:translate-x-2 hover:shadow-lg hover:shadow-primary/20"
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon Badge */}
                          <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                            <MdVideoLibrary className="text-2xl text-primary" />
                          </div>
                          {/* Text */}
                          <div className="flex-1">
                            <p className="font-bold text-base">My Collection</p>
                            <p className="text-xs text-gray-400">View your movies</p>
                          </div>
                        </div>
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      </Link>
                    </li>

                    {/* My Watchlist */}
                    <li className="mb-1">
                      <Link
                        to="/my-watchlist"
                        className="group relative bg-gradient-to-r from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10 rounded-xl px-4 py-3 text-white hover:text-secondary transition-all duration-300 hover:translate-x-2 hover:shadow-lg hover:shadow-secondary/20"
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon Badge */}
                          <div className="w-11 h-11 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                            <FiHeart className="text-2xl text-secondary" />
                          </div>
                          {/* Text */}
                          <div className="flex-1">
                            <p className="font-bold text-base">My Watchlist</p>
                            <p className="text-xs text-gray-400">Saved for later</p>
                          </div>
                        </div>
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      </Link>
                    </li>
                  </div>

                  {/* Divider with More Space */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-3"></div>

                  {/* Account Section */}
                  <div className="px-3 pb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                      Account
                    </p>

                    {/* Logout */}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="group relative bg-gradient-to-r from-error/10 to-error/5 hover:from-error/20 hover:to-error/10 rounded-xl px-4 py-3 text-white hover:text-error transition-all duration-300 hover:translate-x-2 hover:shadow-lg hover:shadow-error/20 w-full"
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon Badge */}
                          <div className="w-11 h-11 rounded-xl bg-error/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                            <FiLogOut className="text-2xl text-error" />
                          </div>
                          {/* Text */}
                          <div className="flex-1 text-left">
                            <p className="font-bold text-base">Logout</p>
                            <p className="text-xs text-gray-400">See you soon!</p>
                          </div>
                        </div>
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      </button>
                    </li>
                  </div>
                </ul>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button className="btn btn-outline text-white w-full hover:scale-105 transition-all duration-300">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-primary hover:bg-movie-accent-hover text-white border-none hover:scale-105 transition-all duration-300">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {user && (
              <div className="avatar">
                <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 hover:scale-110 transition-transform duration-300">
                  <img
                    src={userAvatar}
                    alt={user.displayName || "User"}
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white text-2xl hover:scale-110 transition-transform duration-300"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <ul className="space-y-3 text-base font-medium">{navLinks}</ul>

            {/* Mobile Auth Section */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              {user ? (
                <>
                  <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="w-12 rounded-full ring-2 ring-primary">
                          <img src={userAvatar} alt={user.displayName || "User"} />
                        </div>
                      </div>
                      <div>
                        <p className="text-white font-semibold flex items-center gap-2">
                          {user.displayName || "User"}
                          <HiSparkles className="text-yellow-400 animate-pulse" />
                        </p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Button - Mobile */}
                  <Link to="/profile" className="w-full block">
                    <button className="btn bg-blue-500 hover:bg-blue-600 text-white w-full border-none">
                      <FiUser className="text-lg" />
                      View Profile
                    </button>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="btn bg-error hover:bg-red-600 text-white w-full border-none hover:scale-105 transition-transform duration-300"
                  >
                    <FiLogOut className="text-lg" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="w-full">
                    <button className="btn btn-outline text-white w-full hover:scale-105 transition-all duration-300">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <button className="btn btn-primary hover:bg-movie-accent-hover text-white w-full border-none hover:scale-105 transition-all duration-300">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
