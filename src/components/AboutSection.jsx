import { MdMovie, MdPeople, MdFavorite, MdStar } from "react-icons/md";
import { FiPlay, FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { BsStars } from "react-icons/bs";
import { Link } from "react-router";

const AboutSection = () => {
  const highlights = [
    {
      icon: <MdMovie className="text-5xl" />,
      title: "Vast Collection",
      description: "Browse through an extensive library of movies from classics to latest releases",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      icon: <MdPeople className="text-5xl" />,
      title: "Community Driven",
      description: "Join a vibrant community of movie lovers sharing their passion",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: <MdFavorite className="text-5xl" />,
      title: "Personal Lists",
      description: "Create custom collections and organize movies your way",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: <MdStar className="text-5xl" />,
      title: "Top Rated",
      description: "Discover highly-rated movies curated by our community",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-movie-darker via-movie-dark to-movie-darker relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Animation */}
        <div className="text-center mb-20 animate-fadeIn">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">
            Your Ultimate
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
              {" "}
              Movie Hub
            </span>
          </h2>

          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Discover, collect, and share your passion for cinema with a community of movie enthusiasts
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Side - Description */}
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-6">
              <h3 className="text-4xl font-bold text-white font-heading leading-tight">
                The Ultimate Platform for
                <span className="text-primary"> Movie Enthusiasts</span>
              </h3>

              <p className="text-gray-300 text-lg leading-relaxed">
                Movie Matrix is more than just a movie database – it's a complete ecosystem designed for
                cinephiles. Whether you're discovering new films, organizing your watchlist, or connecting
                with fellow movie lovers, we provide everything you need.
              </p>

              <p className="text-gray-300 text-lg leading-relaxed">
                Our platform combines powerful features with an intuitive interface, making it effortless to
                explore the world of cinema. From Hollywood blockbusters to international masterpieces,
                discover it all in one place.
              </p>
            </div>

            {/* CTA Buttons */}
          </div>

          {/* Right Side - Highlights Grid with 3D Effect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className={`group relative bg-base-200 rounded-2xl p-8 space-y-4 border ${highlight.borderColor} hover:border-opacity-50 transition-all duration-500 animate-fadeIn hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Gradient Background Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with Glow */}
                  <div
                    className={`w-20 h-20 rounded-2xl ${highlight.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-2xl`}
                  >
                    <div className={`bg-gradient-to-br ${highlight.color} bg-clip-text text-transparent`}>
                      {highlight.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                    {highlight.title}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">{highlight.description}</p>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section - Enhanced */}
        <div className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 rounded-3xl p-12 md:p-16 border border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-500">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">
              <BsStars className="text-yellow-400 animate-spin-slow" />
              <span className="text-white font-semibold">Join Our Community</span>
            </div>

            {/* Heading */}
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
              Ready to Start Your
              <span className="block mt-2 bg-gradient-to-r from-primary via-yellow-400 to-secondary bg-clip-text text-transparent">
                Movie Journey?
              </span>
            </h3>

            {/* Description */}
            <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of movie lovers and start building your personal collection today.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/plans">
                <button className="btn bg-gradient-to-r from-primary to-secondary hover:from-red-700 hover:to-yellow-600 text-white border-none px-8 text-lg shadow-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
                  <HiSparkles className="group-hover:animate-spin" />
                  View Our Plans
                  <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </Link>
              <Link to="/movies">
                <button className="btn bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 px-10 py-4 text-lg hover:scale-105 transition-all duration-300">
                  <FiPlay />
                  Browse Movies
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="text-center mt-20 opacity-50">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
            <MdMovie className="text-2xl" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
