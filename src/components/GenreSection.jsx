import {
  MdTheaters,
  MdSentimentVerySatisfied,
  MdDirectionsRun,
  MdScience,
  MdFavorite,
  MdLocalMovies,
} from "react-icons/md";
import { FiFilm } from "react-icons/fi";
import { GiDramaMasks, GiCrossedBones } from "react-icons/gi";

const GenreSection = () => {
  const genres = [
    {
      name: "Action",
      icon: <MdDirectionsRun className="text-5xl" />,
      color: "from-red-500 to-orange-500",
      description: "High-octane thrills",
    },
    {
      name: "Comedy",
      icon: <MdSentimentVerySatisfied className="text-5xl" />,
      color: "from-yellow-500 to-amber-500",
      description: "Laugh out loud",
    },
    {
      name: "Drama",
      icon: <GiDramaMasks className="text-5xl" />,
      color: "from-purple-500 to-pink-500",
      description: "Emotional stories",
    },
    {
      name: "Sci-Fi",
      icon: <MdScience className="text-5xl" />,
      color: "from-blue-500 to-cyan-500",
      description: "Future worlds",
    },
    {
      name: "Romance",
      icon: <MdFavorite className="text-5xl" />,
      color: "from-pink-500 to-rose-500",
      description: "Love stories",
    },
    {
      name: "Thriller",
      icon: <GiCrossedBones className="text-5xl" />,
      color: "from-gray-500 to-slate-600",
      description: "Edge of your seat",
    },
    {
      name: "Animation",
      icon: <MdLocalMovies className="text-5xl" />,
      color: "from-green-500 to-emerald-500",
      description: "For all ages",
    },
    {
      name: "Crime",
      icon: <FiFilm className="text-5xl" />,
      color: "from-indigo-500 to-violet-500",
      description: "Dark mysteries",
    },
  ];

  return (
    <section className="py-16 bg-movie-dark">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">Explore by Genre</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Dive into different worlds through our diverse collection of movie genres
          </p>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6">
          {genres.map((genre, index) => (
            <div
              key={index}
              className="group cursor-pointer animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative overflow-hidden rounded-xl aspect-square bg-movie-card hover:scale-105 transition-transform duration-300">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                ></div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-4 text-center space-y-2">
                  <div className="text-white group-hover:scale-110 transition-transform duration-300">
                    {genre.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg">{genre.name}</h3>
                  <p className="text-gray-400 text-xs hidden md:block">{genre.description}</p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreSection;
