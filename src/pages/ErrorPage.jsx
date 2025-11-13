import { Link } from "react-router-dom";
import { MdMovie } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { Helmet } from "react-helmet-async";

const ErrorPage = () => {
  return (
    <>
      <Helmet>
        <title>Error - 404</title>
        <meta name="description" content="An error occurred on Movie Matrix." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-movie-dark max-w-11/12 mx-auto px-4">
        <div className="text-center space-y-6 max-w-lg">
          {/* Icon */}
          <div className="flex justify-center">
            <MdMovie className="text-primary text-9xl animate-pulse" />
          </div>

          {/* 404 Text */}
          <h1 className="text-8xl md:text-9xl font-bold text-white">404</h1>

          {/* Error Message */}
          <h2 className="text-2xl md:text-3xl font-semibold text-white">Page Not Found</h2>
          <p className="text-gray-400 text-lg">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/">
              <button className="btn bg-primary hover:bg-movie-accent-hover text-white border-none px-8">
                <FiHome className="text-xl" />
                Go to Home
              </button>
            </Link>
            <Link to="/movies">
              <button className="btn btn-outline text-white hover:bg-white hover:text-black border-white px-8">
                <MdMovie className="text-xl" />
                Browse Movies
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
