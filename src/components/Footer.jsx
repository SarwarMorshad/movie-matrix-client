import { Link } from "react-router-dom";
import { MdMovie, MdEmail } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BiCopyright } from "react-icons/bi";
import { HiArrowUp } from "react-icons/hi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-movie-darker to-black border-t border-primary/20 mt-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <MdMovie className="text-primary text-4xl group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </div>
              <span className="text-2xl font-bold font-heading text-white">
                Movie <span className="text-primary">Matrix</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for discovering, managing, and organizing your favorite movies. Join
              our community of movie enthusiasts today!
            </p>
            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-gray-300 text-sm font-semibold mb-2">Stay Updated</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500"
                />
                <button className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-r-lg transition-colors">
                  <MdEmail className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              <span className="w-1 h-6 bg-primary mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/movies", label: "All Movies" },
                { to: "/add-movie", label: "Add Movie" },
                { to: "/my-collection", label: "My Collection" },
                { to: "/favorites", label: "My Favorites" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary transition-all hover:translate-x-1 inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              <span className="w-1 h-6 bg-primary mr-2"></span>
              Categories
            </h3>
            <ul className="space-y-3">
              {["Action", "Drama", "Comedy", "Sci-Fi", "Horror", "Romance"].map((category) => (
                <li key={category}>
                  <Link
                    to="/movies"
                    className="text-gray-400 hover:text-primary transition-all hover:translate-x-1
                  inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              <span className="w-1 h-6 bg-primary mr-2"></span>
              Connect With Us
            </h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Join our community and never miss an update about the latest movies and features.
            </p>

            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { Icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
                { Icon: FaXTwitter, href: "https://twitter.com", label: "Twitter" },
                { Icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
                { Icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { Icon: FaGithub, href: "https://github.com", label: "GitHub" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label={label}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    <Icon className="text-gray-400 group-hover:text-white transition-colors text-lg" />
                  </div>
                  <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </a>
              ))}
            </div>

            {/* Support Links */}
            <div className="space-y-2 text-sm">
              {["Help Center", "Privacy Policy", "Terms of Service"].map((item) => (
                <a key={item} href="#" className="block text-gray-400 hover:text-primary transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <BiCopyright className="text-primary" />
            {currentYear} Movie Matrix. All rights reserved. Made with{" "}
            <span className="text-red-500 animate-pulse">❤️</span> for movie lovers.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-xs">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Sitemap
              </a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary hover:bg-primary/80 text-white rounded-full shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group z-50"
        aria-label="Scroll to top"
      >
        <HiArrowUp className="text-xl group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  );
};

export default Footer;
