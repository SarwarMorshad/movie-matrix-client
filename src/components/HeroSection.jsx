import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlay, FiInfo } from "react-icons/fi";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const HeroSection = ({ movies }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [movies]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  const currentMovie = movies[currentSlide];

  return (
    <section className="relative h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img src={currentMovie.posterUrl} alt={currentMovie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-movie-dark via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6 animate-fadeIn">
          {/* Genre Badge */}
          <div className="flex items-center space-x-3">
            <span className="px-4 py-1 bg-primary/80 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
              Featured
            </span>
            <span className="px-4 py-1 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
              {currentMovie.genre}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-heading leading-tight">
            {currentMovie.title}
          </h1>

          {/* Movie Info */}
          <div className="flex items-center space-x-4 text-white/90">
            <span className="flex items-center space-x-1">
              <span className="text-secondary">★</span>
              <span className="font-semibold">{currentMovie.rating}</span>
            </span>
            <span>•</span>
            <span>{currentMovie.releaseYear}</span>
            <span>•</span>
            <span>{currentMovie.duration} min</span>
          </div>

          {/* Plot Summary */}
          <p className="text-gray-300 text-lg leading-relaxed line-clamp-3">{currentMovie.plotSummary}</p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to={`/movies/${currentMovie._id}`}>
              <button className="btn bg-primary hover:bg-movie-accent-hover text-white border-none px-8 text-lg">
                <FiPlay className="text-xl" />
                View Details
              </button>
            </Link>
            <Link to="/movies">
              <button className="btn btn-outline text-white hover:bg-white hover:text-black border-white px-8 text-lg">
                <FiInfo className="text-xl" />
                Browse All
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white"
      >
        <MdChevronLeft className="text-3xl" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white"
      >
        <MdChevronRight className="text-3xl" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button>
            key={index}
            onClick={() => setCurrentSlide(index)}
            className=
            {`h-1 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-8 bg-primary" : "w-4 bg-white/50 hover:bg-white/75"
            }`}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
