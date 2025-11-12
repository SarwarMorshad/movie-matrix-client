import { MdMovie, MdPeople, MdFavorite, MdStar } from "react-icons/md";
import { FiCheck } from "react-icons/fi";

const AboutSection = () => {
  const features = [
    "Discover thousands of movies across all genres",
    "Create and manage your personal movie collection",
    "Rate and review your favorite films",
    "Get personalized movie recommendations",
    "Connect with fellow movie enthusiasts",
    "Stay updated with the latest releases",
  ];

  const highlights = [
    {
      icon: <MdMovie className="text-4xl" />,
      title: "Vast Collection",
      description: "Browse through an extensive library of movies from classics to latest releases",
    },
    {
      icon: <MdPeople className="text-4xl" />,
      title: "Community Driven",
      description: "Join a vibrant community of movie lovers sharing their passion",
    },
    {
      icon: <MdFavorite className="text-4xl" />,
      title: "Personal Lists",
      description: "Create custom collections and organize movies your way",
    },
    {
      icon: <MdStar className="text-4xl" />,
      title: "Top Rated",
      description: "Discover highly-rated movies curated by our community",
    },
  ];

  return (
    <section className="py-20 bg-movie-darker">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">About Movie Matrix</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Your ultimate destination for discovering, managing, and sharing your love for cinema
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Description */}
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-3xl font-bold text-white font-heading">
              Welcome to the Ultimate Movie Experience
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Movie Matrix is more than just a movie database – it's a complete platform designed for movie
              enthusiasts. Whether you're looking to discover new films, organize your watchlist, or connect
              with other cinephiles, we've got you covered.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our platform combines powerful features with an intuitive interface, making it easy to explore
              the world of cinema. From blockbusters to indie gems, from Hollywood to world cinema, discover
              it all in one place.
            </p>

            {/* Features List */}
            <div className="space-y-3 pt-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <FiCheck className="text-primary text-sm" />
                  </div>
                  <p className="text-gray-300">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-movie-card rounded-xl p-6 space-y-3 hover:bg-movie-card-hover transition-colors duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-primary">{highlight.icon}</div>
                <h4 className="text-xl font-semibold text-white">{highlight.title}</h4>
                <p className="text-gray-400">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12 border border-white/5">
          <h3 className="text-3xl font-bold text-white mb-4 font-heading">
            Ready to Start Your Movie Journey?
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of movie lovers and start building your personal collection today. It's free and
            takes less than a minute!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
              <button className="btn bg-primary hover:bg-movie-accent-hover text-white border-none px-8 text-lg">
                Get Started Free
              </button>
            </a>
            <a href="/movies">
              <button className="btn btn-outline text-white hover:bg-white hover:text-black border-white px-8 text-lg">
                Browse Movies
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
