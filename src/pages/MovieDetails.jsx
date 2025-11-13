import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { FiStar, FiCalendar, FiFilm, FiGlobe, FiEdit, FiTrash2 } from "react-icons/fi";
import { MdMovie, MdPerson } from "react-icons/md";
import useAxios from "../hooks/useAxios";
import MovieReviews from "../components/MovieReviews";
import ErrorPage from "./ErrorPage";

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const axiosInstance = useAxios();

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      toast.error("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axiosInstance.delete(`/movies/${id}`);
      toast.success("Movie deleted successfully!");
      navigate("/movies");
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!movie) {
    return <ErrorPage></ErrorPage>;
  }

  const isOwner = user && user.email === movie.addedBy;

  return (
    <div className="min-h-screen bg-base-100 max-w-11/12 mx-auto">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/80 to-base-100/40"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1 animate-fadeIn">
            <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-2xl shadow-2xl" />
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6 animate-fadeIn">
            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">{movie.title}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <span className="flex items-center space-x-2 text-secondary">
                  <FiStar className="text-2xl" />
                  <span className="font-bold">{movie.rating}</span>
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{movie.releaseYear}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{movie.duration} min</span>
              </div>
            </div>

            {/* Genre Badge */}
            <div>
              <span className="px-4 py-2 bg-primary/20 text-primary rounded-full font-semibold">
                {movie.genre}
              </span>
            </div>

            {/* Plot Summary */}
            <div className="bg-base-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Plot Summary</h3>
              <p className="text-gray-300 leading-relaxed">{movie.plotSummary}</p>
            </div>

            {/* Movie Info Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoCard icon={<MdPerson />} label="Director" value={movie.director} />
              <InfoCard icon={<FiFilm />} label="Cast" value={movie.cast} />
              <InfoCard icon={<FiGlobe />} label="Language" value={movie.language} />
              <InfoCard icon={<FiCalendar />} label="Country" value={movie.country} />
            </div>

            {/* Added By */}
            <div className="bg-base-200 rounded-xl p-4">
              <p className="text-gray-400 text-sm">
                Added by: <span className="text-white">{movie.addedBy}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isOwner && (
                <>
                  <Link to={`/update-movie/${movie._id}`} className="flex-1">
                    <button className="btn bg-secondary hover:bg-amber-600 text-white border-none w-full">
                      <FiEdit className="text-xl" />
                      Edit Movie
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="btn bg-error hover:bg-red-600 text-white border-none flex-1"
                  >
                    <FiTrash2 className="text-xl" />
                    Delete Movie
                  </button>
                </>
              )}
              <Link to="/movies" className={isOwner ? "flex-1" : "w-full"}>
                <button className="btn btn-outline text-white hover:bg-white hover:text-black border-white w-full">
                  Back to Movies
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16">
        <MovieReviews movieId={id} />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-4">Delete Movie?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{movie.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1">
                {deleting ? <span className="loading loading-spinner loading-sm"></span> : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="bg-base-200 rounded-xl p-4 flex items-start space-x-3">
      <div className="text-primary text-2xl mt-1">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default MovieDetails;
