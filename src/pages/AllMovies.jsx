import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiSearch, FiFilter } from "react-icons/fi";
import toast from "react-hot-toast";
import useAxios from "../hooks/useAxios";
import { Helmet } from "react-helmet-async";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const axiosInstance = useAxios();

  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);

  const genres = [
    "Action",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [movies, searchTerm, selectedGenres, minRating, maxRating]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...movies];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Genre filter (multiple genres using $in logic)
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) => selectedGenres.includes(movie.genre));
    }

    // Rating filter (using $gte and $lte logic)
    filtered = filtered.filter((movie) => movie.rating >= minRating && movie.rating <= maxRating);

    setFilteredMovies(filtered);
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]));
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setMinRating(0);
    setMaxRating(10);
    setSearchTerm("");
    toast.success("Filters cleared");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Movies</title>
        <meta name="description" content="Browse all movies in the Movie Matrix collection." />
      </Helmet>
      <div className="min-h-screen bg-base-100 py-12 max-w=11/12 mx-auto">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">All Movies</h1>
            <p className="text-gray-400 text-lg">
              Browse through our complete collection of {movies.length} movies
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search movies by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>
          </div>

          {/* Filter Toggle Button */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-primary  inline-flex items-center gap-2"
            >
              <FiFilter className="text-xl" />
              {showFilters ? "Hide Filters" : "Advanced Filters"}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="max-w-5xl mx-auto mb-8 bg-base-200 rounded-2xl p-6 animate-slideDown">
              {/* Genre Filter */}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span>Filter by Genre</span>
                  {selectedGenres.length > 0 && (
                    <span className="text-sm bg-primary px-2 py-1 rounded-full">
                      {selectedGenres.length} selected
                    </span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-primary text-white"
                          : "bg-base-300 text-gray-400 hover:bg-base-100 hover:text-white"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Range Filter */}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-3">Filter by Rating Range</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Minimum Rating: {minRating}</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={minRating}
                      onChange={(e) => setMinRating(parseFloat(e.target.value))}
                      className="range range-primary w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Maximum Rating: {maxRating}</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={maxRating}
                      onChange={(e) => setMaxRating(parseFloat(e.target.value))}
                      className="range range-primary w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="text-center">
                <button onClick={clearFilters} className="btn btn-outline text-white border-white">
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Info */}
          <div className="text-center mb-6">
            <p className="text-gray-400">
              Showing {filteredMovies.length} of {movies.length} movies
              {selectedGenres.length > 0 && (
                <span className="text-primary ml-2">(Filtered by: {selectedGenres.join(", ")})</span>
              )}
            </p>
          </div>

          {/* Movies Grid */}
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map((movie, index) => (
                <div
                  key={movie._id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-4">No movies found</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllMovies;
