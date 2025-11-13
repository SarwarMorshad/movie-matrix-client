import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiMail, FiUser, FiCalendar, FiAward, FiFilm, FiHeart, FiStar, FiEdit2 } from "react-icons/fi";
import { MdMovie } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import LoadingSpinner from "../components/LoadingSpinner";
import { Helmet } from "react-helmet-async";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    moviesAdded: 0,
    watchlist: 0,
    reviewsGiven: 0,
  });
  const [imageError, setImageError] = useState(false);
  const axiosInstance = useAxios();

  // Default avatar
  const defaultAvatar = "https://i.ibb.co/2FbxWkt/user.png";
  const userAvatar = imageError ? defaultAvatar : user?.photoURL || defaultAvatar;

  // Fetch user statistics
  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const [moviesRes, watchlistRes, reviewsRes] = await Promise.all([
        axiosInstance.get(`/my-movies?email=${user.email}`),
        axiosInstance.get(`/watchlist/${user.email}`),
        axiosInstance.get(`/my-reviews?email=${user.email}`),
      ]);

      setStats({
        moviesAdded: moviesRes.data.length,
        watchlist: watchlistRes.data.length,
        reviewsGiven: reviewsRes.data.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load profile statistics");
    } finally {
      setLoading(false);
    }
  };

  // Get account age
  const getAccountAge = () => {
    if (!user?.metadata?.creationTime) return "Recently";

    const created = new Date(user.metadata.creationTime);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show centered loading spinner
  if (loading) {
    return <LoadingSpinner center={true} />;
  }

  return (
    <>
      <Helmet>
        <title>{user.displayName || "User"}'s Profile</title>
        <meta
          name="description"
          content={`Profile page of ${user.displayName || "a user"} on Movie Matrix.`}
        />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl">
                  <img
                    src={userAvatar}
                    alt={user.displayName || "User"}
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              {/* Online Status */}
              <span className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-base-100 rounded-full animate-pulse"></span>

              {/* Verified Badge */}
              <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-2 shadow-lg">
                <HiSparkles size={20} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                {user.displayName || "Movie Enthusiast"}
                <span className="text-yellow-400 animate-bounce">
                  <HiSparkles size={28} />
                </span>
              </h1>
              <p className="text-gray-400 text-lg mb-4">{user.email}</p>

              {/* Account Age */}
              <div className="flex items-center gap-2 justify-center md:justify-start text-gray-500">
                <FiCalendar />
                <span>Member since {getAccountAge()}</span>
              </div>
            </div>

            {/* Edit Profile Button (Placeholder) */}
            <Link
              to="/edit-profile"
              className="btn btn-ghost text-white border-white/20 hover:border-primary hover:text-primary"
            >
              <FiEdit2 />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Movies Added */}
          <div className="bg-base-200 rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <MdMovie className="text-3xl text-primary" />
              </div>
              <span className="text-4xl font-bold text-white">{stats.moviesAdded}</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">Movies Added</h3>
            <p className="text-gray-400 text-sm">Your contributions</p>
          </div>

          {/* Watchlist */}
          <div className="bg-base-200 rounded-2xl p-6 border border-white/10 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center">
                <FiHeart className="text-3xl text-secondary" />
              </div>
              <span className="text-4xl font-bold text-white">{stats.watchlist}</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">Watchlist</h3>
            <p className="text-gray-400 text-sm">Movies to watch</p>
          </div>

          {/* Reviews Given */}
          <div className="bg-base-200 rounded-2xl p-6 border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <FiStar className="text-3xl text-yellow-400" />
              </div>
              <span className="text-4xl font-bold text-white">{stats.reviewsGiven}</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">Reviews</h3>
            <p className="text-gray-400 text-sm">Your opinions</p>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-base-200 rounded-2xl p-8 border border-white/10 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FiUser className="text-primary" />
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                Display Name
              </label>
              <div className="bg-base-300 rounded-lg px-4 py-3 border border-white/10">
                <p className="text-white font-medium">{user.displayName || "Not set"}</p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <FiMail size={14} />
                Email Address
              </label>
              <div className="bg-base-300 rounded-lg px-4 py-3 border border-white/10">
                <p className="text-white font-medium">{user.email}</p>
              </div>
            </div>

            {/* Email Verified */}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                Email Verification
              </label>
              <div className="bg-base-300 rounded-lg px-4 py-3 border border-white/10">
                {user.emailVerified ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <FiAward />
                    <span className="font-medium">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <FiAward />
                    <span className="font-medium">Not Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Created */}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <FiCalendar size={14} />
                Account Created
              </label>
              <div className="bg-base-300 rounded-lg px-4 py-3 border border-white/10">
                <p className="text-white font-medium">
                  {user.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown"}
                </p>
              </div>
            </div>

            {/* Last Sign In */}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                Last Sign In
              </label>
              <div className="bg-base-300 rounded-lg px-4 py-3 border border-white/10">
                <p className="text-white font-medium">
                  {user.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Unknown"}
                </p>
              </div>
            </div>

            {/* User ID */}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider">User ID</label>
              <div className="bg-base-300 rounded-lg px-4 py-3 border border-white/10">
                <p className="text-white font-mono text-sm truncate">{user.uid}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <FiFilm className="text-blue-400" />
            Your Movie Journey
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            You've been an active member of Movie Matrix! You've added{" "}
            <span className="text-primary font-bold">{stats.moviesAdded}</span> movies, saved{" "}
            <span className="text-secondary font-bold">{stats.watchlist}</span> movies to your watchlist, and
            shared <span className="text-yellow-400 font-bold">{stats.reviewsGiven}</span> reviews with the
            community. Keep discovering and sharing great movies! 🎬✨
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
