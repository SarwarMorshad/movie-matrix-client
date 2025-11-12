import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { MdMovie } from "react-icons/md";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logOut()
      .then(() => {
        // Success handled by auth state change
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

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
        </>
      )}
    </>
  );

  return (
    <nav className="bg-movie-dark/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold font-heading">
            <MdMovie className="text-primary text-3xl" />
            <span className="text-white">
              Movie <span className="text-primary">Matrix</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8 text-base font-medium">{navLinks}</ul>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user.photoURL || "https://i.ibb.co/2FbxWkt/user.png"} alt={user.displayName} />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-movie-card rounded-box w-52 border border-white/10"
                >
                  <li className="menu-title px-4 py-2">
                    <span className="text-white font-semibold">{user.displayName}</span>
                    <span className="text-gray-400 text-xs">{user.email}</span>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <Link to="/my-collection" className="text-white hover:text-primary">
                      <FiUser className="text-lg" />
                      My Collection
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-white hover:text-primary">
                      <FiLogOut className="text-lg" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button className="btn btn-ghost text-white hover:text-primary">Login</button>
                </Link>
                <Link to="/register">
                  <button className="btn bg-primary hover:bg-movie-accent-hover text-white border-none">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <div className="avatar">
                <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                  <img src={user.photoURL || "https://i.ibb.co/2FbxWkt/user.png"} alt={user.displayName} />
                </div>
              </div>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white text-2xl">
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-slideDown">
            <ul className="space-y-3 text-base font-medium">{navLinks}</ul>

            {/* Mobile Auth Section */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              {user ? (
                <>
                  <div className="text-white px-2">
                    <p className="font-semibold">{user.displayName}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn bg-primary hover:bg-movie-accent-hover text-white w-full border-none"
                  >
                    <FiLogOut className="text-lg" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="w-full">
                    <button className="btn btn-outline text-white w-full">Login</button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <button className="btn bg-primary hover:bg-movie-accent-hover text-white w-full border-none">
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
