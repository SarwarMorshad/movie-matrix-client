import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { MdMovie, MdAdd } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import useAxios from "../hooks/useAxios";

const MyCollection = () => {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const axiosInstance = useAxios();

  useEffect(() => {
    if (user) {
      fetchMyMovies();
    }
  }, [user]);

  const fetchMyMovies = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/my-movies?email=${user.email}`);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching my movies:", error);
      toast.error("Failed to load your movies");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (movieId, movieTitle) => {
    setMovieToDelete({ id: movieId, title: movieTitle });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!movieToDelete) return;

    try {
      setDeleting(true);
      await axiosInstance.delete(`/movies/${movieToDelete.id}`);

      // Remove from local state
      setMovies(movies.filter((movie) => movie._id !== movieToDelete.id));

      toast.success("Movie deleted successfully!");
      setShowDeleteModal(false);
      setMovieToDelete(null);
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-base-100 max-w-11/12 mx-auto py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <MdMovie className="text-primary text-6xl mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">My Collection</h1>
          <p className="text-gray-400 text-lg mb-6">
            You have added {movies.length} movie{movies.length !== 1 ? "s" : ""} to the collection
          </p>

          {/* Add Movie Button */}
          <Link to="/add-movie">
            <button className="btn bg-primary hover:bg-primary text-white border-none px-8">
              <MdAdd className="text-2xl" />
              Add New Movie
            </button>
          </Link>
        </div>

        {/* Movies Grid */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie, index) => (
              <div
                key={movie._id}
                className="animate-fadeIn group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Movie Card */}
                <div className="bg-base-200 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                  {/* Poster */}
                  <Link to={`/movies/${movie._id}`}>
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <Link to={`/movies/${movie._id}`}>
                      <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-primary transition-colors mb-2">
                        {movie.title}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{movie.genre}</span>
                      <span className="flex items-center space-x-1">
                        <span className="text-secondary">★</span>
                        <span>{movie.rating}</span>
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link to={`/update-movie/${movie._id}`} className="flex-1">
                        <button className="btn btn-sm btn-outline hover:bg-amber-600 text-white  w-full">
                          <FiEdit />
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => openDeleteModal(movie._id, movie.title)}
                        className="btn btn-sm btn-primary hover:bg-red-600 text-white border-none flex-1"
                      >
                        <FiTrash2 />
                        Delete
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
            <MdMovie className="text-gray-600 text-8xl mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-4">No Movies Yet</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You haven't added any movies to your collection yet. Start building your movie library now!
            </p>
            <Link to="/add-movie">
              <button className="btn bg-primary hover:bg-primary text-white border-none px-8">
                <MdAdd className="text-2xl" />
                Add Your First Movie
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && movieToDelete && (
        <div className="modal-backdrop" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-4">Delete Movie?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{movieToDelete.title}"? This action cannot be undone.
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
    </div>
  );
};

export default MyCollection;
