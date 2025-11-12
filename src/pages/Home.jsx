import { useEffect, useState } from "react";
import axios from "axios";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import TopRatedMovies from "../components/TopRatedMovies";
import RecentMovies from "../components/RecentMovies";
import GenreSection from "../components/GenreSection";
import AboutSection from "../components/AboutSection";
import LoadingSpinner from "../components/LoadingSpinner";

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
        axios.get("http://localhost:3000/stats/movies-count"),
        axios.get("http://localhost:3000/stats/users-count"),
        axios.get("http://localhost:3000/movies-top-rated"),
        axios.get("http://localhost:3000/movies-recent"),
      ]);

      setStats({
        totalMovies: statsMovies.data.totalMovies,
        totalUsers: statsUsers.data.totalUsers,
      });
      setTopRatedMovies(topRated.data);
      setRecentMovies(recent.data);
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
    <div className="min-h-screen bg-movie-dark max-w-11/12 mx-auto">
      {/* Hero Section */}
      <HeroSection movies={topRatedMovies} />

      {/* Statistics Section */}
      <StatsSection stats={stats} />

      {/* Top Rated Movies Section */}
      <TopRatedMovies movies={topRatedMovies} />

      {/* Recently Added Movies Section */}
      <RecentMovies movies={recentMovies} />

      {/* Genre Section */}
      <GenreSection />

      {/* About Platform Section */}
      <AboutSection />
    </div>
  );
};

export default Home;
