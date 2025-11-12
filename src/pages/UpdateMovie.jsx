import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { MdMovie } from "react-icons/md";

const UpdateMovie = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/movies/${id}`);
      const movieData = response.data;

      // Check if user is owner
      if (user.email !== movieData.addedBy) {
        toast.error("You can only edit movies that you added");
        navigate("/movies");
        return;
      }

      setMovie(movieData);
    } catch (error) {
      console.error("Error fetching movie:", error);
      toast.error("Failed to load movie details");
      navigate("/movies");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target;

    const updatedData = {
      title: form.title.value,
      genre: form.genre.value,
      releaseYear: parseInt(form.releaseYear.value),
      director: form.director.value,
      cast: form.cast.value,
      rating: parseFloat(form.rating.value),
      duration: parseInt(form.duration.value),
      plotSummary: form.plotSummary.value,
      posterUrl: form.posterUrl.value,
      language: form.language.value,
      country: form.country.value,
    };

    try {
      await axios.put(`http://localhost:3000/movies/${id}`, updatedData);
      toast.success("Movie updated successfully!");
      navigate(`/movies/${id}`);
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Failed to update movie. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!movie) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-100 max-w-11/12 mx-auto py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeIn">
          <MdMovie className="text-secondary text-6xl mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Update Movie</h1>
          <p className="text-gray-400 text-lg">Edit the details of "{movie.title}"</p>
        </div>

        {/* Form */}
        <div className="bg-base-200 rounded-2xl p-8 shadow-2xl animate-scaleIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white font-semibold mb-2">Movie Title *</label>
              <input
                type="text"
                name="title"
                defaultValue={movie.title}
                placeholder="Enter movie title"
                className="input-field"
                required
              />
            </div>

            {/* Genre & Release Year */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Genre *</label>
                <select name="genre" defaultValue={movie.genre} className="input-field" required>
                  <option value="">Select Genre</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Romance">Romance</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Horror">Horror</option>
                  <option value="Animation">Animation</option>
                  <option value="Crime">Crime</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Mystery">Mystery</option>
                  <option value="War">War</option>
                  <option value="Western">Western</option>
                  <option value="Biography">Biography</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Release Year *</label>
                <input
                  type="number"
                  name="releaseYear"
                  defaultValue={movie.releaseYear}
                  placeholder="e.g., 2024"
                  min="1900"
                  max="2030"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Director */}
            <div>
              <label className="block text-white font-semibold mb-2">Director *</label>
              <input
                type="text"
                name="director"
                defaultValue={movie.director}
                placeholder="Enter director name"
                className="input-field"
                required
              />
            </div>

            {/* Cast */}
            <div>
              <label className="block text-white font-semibold mb-2">Cast *</label>
              <input
                type="text"
                name="cast"
                defaultValue={movie.cast}
                placeholder="Enter cast members (comma separated)"
                className="input-field"
                required
              />
            </div>

            {/* Rating & Duration */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Rating (1-10) *</label>
                <input
                  type="number"
                  name="rating"
                  defaultValue={movie.rating}
                  placeholder="e.g., 8.5"
                  min="1"
                  max="10"
                  step="0.1"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Duration (minutes) *</label>
                <input
                  type="number"
                  name="duration"
                  defaultValue={movie.duration}
                  placeholder="e.g., 120"
                  min="1"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Plot Summary */}
            <div>
              <label className="block text-white font-semibold mb-2">Plot Summary *</label>
              <textarea
                name="plotSummary"
                defaultValue={movie.plotSummary}
                placeholder="Enter a brief plot summary"
                className="input-field min-h-32 resize-none"
                required
              ></textarea>
            </div>

            {/* Poster URL */}
            <div>
              <label className="block text-white font-semibold mb-2">Poster URL *</label>
              <input
                type="url"
                name="posterUrl"
                defaultValue={movie.posterUrl}
                placeholder="https://example.com/poster.jpg"
                className="input-field"
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                Upload your image to{" "}
                <a
                  href="https://imgbb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary"
                >
                  imgBB
                </a>{" "}
                and paste the direct link here
              </p>
            </div>

            {/* Language & Country */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Language *</label>
                <input
                  type="text"
                  name="language"
                  defaultValue={movie.language}
                  placeholder="e.g., English"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Country *</label>
                <input
                  type="text"
                  name="country"
                  defaultValue={movie.country}
                  placeholder="e.g., USA"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Added By (Read-only) */}
            <div>
              <label className="block text-white font-semibold mb-2">Added By</label>
              <input
                type="text"
                value={movie.addedBy}
                className="input-field bg-base-300 cursor-not-allowed"
                disabled
              />
              <p className="text-gray-400 text-sm mt-2">This field cannot be changed</p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn bg-secondary hover:bg-amber-600 text-white border-none flex-1"
              >
                {submitting ? <span className="loading loading-spinner loading-sm"></span> : "Update Movie"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/movies/${id}`)}
                className="btn btn-outline text-white hover:bg-white hover:text-black border-white flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMovie;
