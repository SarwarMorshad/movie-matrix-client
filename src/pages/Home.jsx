import { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import TopRatedMovies from "../components/home/TopRatedMovies";
import RecentMovies from "../components/home/RecentMovies";
import GenreSection from "../components/home/GenreSection";
import AboutSection from "../components/home/AboutSection";
import LoadingSpinner from "../components/common/LoadingSpinner";
import * as api from "../api/api";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalMovies: 0, totalUsers: 0 });
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [statsMovies, statsUsers, topRated, recent] = await Promise.all([
        api.getMoviesCount(),
        api.getUsersCount(),
        api.getTopRatedMovies(),
        api.getRecentMovies(),
      ]);

      setStats({
        totalMovies: statsMovies.totalMovies,
        totalUsers: statsUsers.totalUsers,
      });
      setTopRatedMovies(topRated);
      setRecentMovies(recent);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Home - Movie Matrix</title>
        <meta
          name="description"
          content="Welcome to Movie Matrix - Your ultimate movie collection and discovery platform."
        />
      </Helmet>
      <div className="min-h-screen bg-movie-dark mx-auto">
        {/* Hero Section */}
        <HeroSection movies={topRatedMovies} />

        {/* Top Rated Movies Section */}
        <TopRatedMovies movies={topRatedMovies} />

        {/* Recently Added Movies Section */}
        <RecentMovies movies={recentMovies} />

        {/* Genre Section */}
        <GenreSection />

        {/* Statistics Section */}
        <StatsSection stats={stats} />

        {/* About Platform Section */}
        <AboutSection />
      </div>
    </>
  );
};

export default Home;
