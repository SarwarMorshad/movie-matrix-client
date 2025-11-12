import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import { FiArrowRight, FiClock } from "react-icons/fi";

const RecentMovies = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-movie-darker">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <FiClock className="text-primary text-3xl" />
              <h2 className="section-title mb-0">Recently Added</h2>
            </div>
            <p className="text-gray-400 text-lg">Check out the latest additions to our movie collection</p>
          </div>
          <Link to="/movies">
            <button className="hidden md:flex btn btn-outline text-white hover:bg-white hover:text-black border-white">
              View All
              <FiArrowRight className="text-xl" />
            </button>
          </Link>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {movies.slice(0, 6).map((movie, index) => (
            <div key={movie._id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/movies">
            <button className="btn bg-primary hover:bg-movie-accent-hover text-white border-none px-8">
              View All Movies
              <FiArrowRight className="text-xl" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentMovies;
