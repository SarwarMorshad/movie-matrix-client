import { Link } from "react-router-dom";
import { MdLocalMovies, MdArrowBack } from "react-icons/md";

const MovieNotFound = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fadeIn">
        {/* Movie Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <MdLocalMovies className="text-9xl text-primary opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-white">404</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">Movie Not Found</h1>
        <p className="text-gray-400 text-lg mb-8">
          The movie you're looking for doesn't exist or has been removed from our collection.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/movies" className="btn-primary flex items-center justify-center gap-2">
            <MdArrowBack className="text-xl" />
            Browse All Movies
          </Link>
          <Link to="/" className="btn-secondary">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieNotFound;
