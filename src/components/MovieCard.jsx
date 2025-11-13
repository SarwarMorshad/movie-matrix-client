import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiStar, FiCalendar, FiHeart } from "react-icons/fi";
import { MdMovie, MdFavorite } from "react-icons/md";

import toast from "react-hot-toast";
import useAxios from "../hooks/useAxios";

const MovieCard = ({ movie }) => {
  const { user } = useContext(AuthContext);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [adding, setAdding] = useState(false);
  const axiosInstance = useAxios();

  const addToWatchlist = async (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add to watchlist");
      return;
    }

    setAdding(true);
    try {
      await axiosInstance.post("/watchlist", {
        email: user.email,
        movieId: movie._id,
      });
      setIsInWatchlist(true);
      toast.success("Added to watchlist!");
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      if (error.response?.status === 409) {
        toast.error("Already in watchlist");
        setIsInWatchlist(true);
      } else {
        toast.error("Failed to add to watchlist");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/movies/${movie._id}`}>
      <div className="card-movie group relative">
        {/* Watchlist Button - Floating */}
        {user && (
          <button
            onClick={addToWatchlist}
            disabled={adding || isInWatchlist}
            className={`absolute top-3 left-3 z-10 btn btn-sm btn-circle ${
              isInWatchlist
                ? "bg-primary text-white"
                : "bg-black/70 backdrop-blur-sm text-white hover:bg-primary"
            } border-none transition-all`}
            title={isInWatchlist ? "In watchlist" : "Add to watchlist"}
          >
            {isInWatchlist ? <MdFavorite className="text-lg" /> : <FiHeart className="text-lg" />}
          </button>
        )}

        {/* Poster Image */}
        <div className="relative overflow-hidden aspect-[2/3]">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover movie-card-img"
          />
          <div className="gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Hover Content */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="btn bg-primary hover:bg-movie-accent-hover text-white border-none w-6/12">
              <MdMovie className="text-xl" />
              View Details
            </button>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
            <FiStar className="text-secondary text-sm" />
            <span className="text-white font-semibold text-sm">{movie.rating}</span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              <MdMovie className="text-primary" />
              <span>{movie.genre}</span>
            </span>
            <span className="flex items-center space-x-1">
              <FiCalendar />
              <span>{movie.releaseYear}</span>
            </span>
          </div>

          <p className="text-gray-400 text-sm line-clamp-2">{movie.plotSummary}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
