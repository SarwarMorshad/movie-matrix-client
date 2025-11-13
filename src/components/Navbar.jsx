import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiFilm } from "react-icons/fi";
import { MdMovie, MdVideoLibrary } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLogout = () => {
    logOut()
      .then(() => {
        setIsProfileOpen(false);
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

  // Framer Motion Variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
  };

  const avatarVariants = {
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.5,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const statusDotVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const iconBadgeVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <nav className="bg-movie-dark/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold font-heading">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <MdMovie className="text-primary text-3xl" />
            </motion.div>
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
              <div className="relative">
                {/* Profile Button */}
                <motion.button
                  variants={avatarVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative focus:outline-none"
                >
                  <div className="w-11 h-11 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                    <img
                      src={userAvatar}
                      alt={user.displayName || "User"}
                      onError={() => setImageError(true)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Online Status with pulse */}
                  <motion.span
                    variants={statusDotVariants}
                    animate="pulse"
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-base-100 rounded-full"
                  />
                </motion.button>

                {/* Dropdown Menu with Framer Motion */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsProfileOpen(false)}
                        className="fixed inset-0 z-40"
                      />

                      {/* Dropdown */}
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-4 w-72 bg-gradient-to-br from-base-200 to-base-300 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50"
                      >
                        {/* User Info Header */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="px-4 py-4 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="avatar">
                              <div className="w-14 h-14 rounded-full ring-2 ring-primary">
                                <img
                                  src={userAvatar}
                                  alt={user.displayName || "User"}
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <motion.h3
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-white font-bold text-base truncate flex items-center gap-2"
                              >
                                {user.displayName || "User"}
                                <motion.span
                                  animate={{
                                    rotate: [0, 10, -10, 10, 0],
                                    scale: [1, 1.2, 1],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                  }}
                                >
                                  <HiSparkles className="text-yellow-400 text-sm" />
                                </motion.span>
                              </motion.h3>
                              <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-400 text-xs truncate"
                              >
                                {user.email}
                              </motion.p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Divider */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.2 }}
                          className="divider my-0 px-4"
                        />

                        {/* Menu Items */}
                        <div className="p-2">
                          {/* My Collection */}
                          <motion.div
                            custom={0}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              to="/my-collection"
                              onClick={() => setIsProfileOpen(false)}
                              className="block"
                            >
                              <motion.div
                                whileHover={{ x: 5 }}
                                className="text-white hover:bg-primary/20 hover:text-primary rounded-xl px-4 py-3 transition-colors duration-200 flex items-center gap-3"
                              >
                                <motion.div
                                  variants={iconBadgeVariants}
                                  whileHover="hover"
                                  className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                                >
                                  <MdVideoLibrary className="text-xl text-primary" />
                                </motion.div>
                                <div className="flex-1">
                                  <p className="font-semibold">My Collection</p>
                                  <p className="text-xs text-gray-400">View your movies</p>
                                </div>
                              </motion.div>
                            </Link>
                          </motion.div>

                          {/* My Watchlist */}
                          <motion.div
                            custom={1}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              to="/my-watchlist"
                              onClick={() => setIsProfileOpen(false)}
                              className="block"
                            >
                              <motion.div
                                whileHover={{ x: 5 }}
                                className="text-white hover:bg-secondary/20 hover:text-secondary rounded-xl px-4 py-3 transition-colors duration-200 flex items-center gap-3"
                              >
                                <motion.div
                                  variants={iconBadgeVariants}
                                  whileHover="hover"
                                  className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center"
                                >
                                  <FiHeart className="text-xl text-secondary" />
                                </motion.div>
                                <div className="flex-1">
                                  <p className="font-semibold">My Watchlist</p>
                                  <p className="text-xs text-gray-400">Saved for later</p>
                                </div>
                              </motion.div>
                            </Link>
                          </motion.div>

                          {/* Add Movie */}
                          <motion.div
                            custom={2}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link to="/add-movie" onClick={() => setIsProfileOpen(false)} className="block">
                              <motion.div
                                whileHover={{ x: 5 }}
                                className="text-white hover:bg-blue-500/20 hover:text-blue-400 rounded-xl px-4 py-3 transition-colors duration-200 flex items-center gap-3"
                              >
                                <motion.div
                                  variants={iconBadgeVariants}
                                  whileHover="hover"
                                  className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"
                                >
                                  <FiFilm className="text-xl text-blue-400" />
                                </motion.div>
                                <div className="flex-1">
                                  <p className="font-semibold">Add Movie</p>
                                  <p className="text-xs text-gray-400">Share a favorite</p>
                                </div>
                              </motion.div>
                            </Link>
                          </motion.div>
                        </div>

                        {/* Divider */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.3 }}
                          className="divider my-0 px-4"
                        />

                        {/* Logout Button */}
                        <div className="p-2">
                          <motion.div
                            custom={3}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={handleLogout}
                              className="text-error hover:bg-error/20 rounded-xl px-4 py-3 transition-colors duration-200 flex items-center gap-3 w-full"
                            >
                              <motion.div
                                variants={iconBadgeVariants}
                                whileHover="hover"
                                className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center"
                              >
                                <FiLogOut className="text-xl text-error" />
                              </motion.div>
                              <div className="flex-1 text-left">
                                <p className="font-semibold">Logout</p>
                                <p className="text-xs text-gray-400">See you soon!</p>
                              </div>
                            </motion.button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-ghost text-white hover:text-primary"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn bg-primary hover:bg-movie-accent-hover text-white border-none"
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />

            {user && (
              <motion.div whileHover={{ scale: 1.1 }} className="avatar">
                <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                  <img
                    src={userAvatar}
                    alt={user.displayName || "User"}
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white text-2xl"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pb-4 overflow-hidden"
            >
              <ul className="space-y-3 text-base font-medium">{navLinks}</ul>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-4"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="avatar">
                          <div className="w-12 rounded-full ring-2 ring-primary">
                            <img src={userAvatar} alt={user.displayName || "User"} />
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{user.displayName || "User"}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="btn bg-error hover:bg-red-600 text-white w-full border-none"
                    >
                      <FiLogOut className="text-lg" />
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/login" className="w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-outline text-white w-full"
                      >
                        Login
                      </motion.button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn bg-primary hover:bg-movie-accent-hover text-white w-full border-none"
                      >
                        Register
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
