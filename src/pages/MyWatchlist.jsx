import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { MdFavorite, MdDelete } from "react-icons/md";
import { FiStar } from "react-icons/fi";

const MyWatchlist = () => {
  const { user } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/watchlist/${user.email}`);
      setWatchlist(response.data);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      toast.error("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await axios.delete(`http://localhost:3000/watchlist/${user.email}/${movieId}`);
      setWatchlist(watchlist.filter((movie) => movie._id !== movieId));
      toast.success("Removed from watchlist");
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error("Failed to remove from watchlist");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <MdFavorite className="text-primary text-6xl mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">My Watchlist</h1>
          <p className="text-gray-400 text-lg mb-6">
            You have {watchlist.length} movie{watchlist.length !== 1 ? "s" : ""} in your watchlist
          </p>
        </div>

        {/* Watchlist Grid */}
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((movie, index) => (
              <div
                key={movie._id}
                className="bg-base-200 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex">
                  {/* Poster */}
                  <Link to={`/movies/${movie._id}`} className="flex-shrink-0">
                    <img src={movie.posterUrl} alt={movie.title} className="w-32 h-48 object-cover" />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <Link to={`/movies/${movie._id}`}>
                        <h3 className="text-lg font-semibold text-white hover:text-primary transition-colors mb-2 line-clamp-2">
                          {movie.title}
                        </h3>
                      </Link>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-400">
                          <span className="font-semibold">Genre:</span> {movie.genre}
                        </p>
                        <p className="text-gray-400">
                          <span className="font-semibold">Year:</span> {movie.releaseYear}
                        </p>
                        <div className="flex items-center space-x-1">
                          <FiStar className="text-secondary" />
                          <span className="text-white font-semibold">{movie.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link to={`/movies/${movie._id}`} className="flex-1">
                        <button className="btn btn-sm btn-primary w-full">View Details</button>
                      </Link>
                      <button
                        onClick={() => removeFromWatchlist(movie._id)}
                        className="btn btn-sm bg-error hover:bg-red-600 text-white border-none"
                        title="Remove from watchlist"
                      >
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20 animate-fadeIn">
            <MdFavorite className="text-gray-600 text-8xl mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-4">Your Watchlist is Empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start adding movies to your watchlist to keep track of films you want to watch!
            </p>
            <Link to="/movies">
              <button className="btn-primary">Browse Movies</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWatchlist;
