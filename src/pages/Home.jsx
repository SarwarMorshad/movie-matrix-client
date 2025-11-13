import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import TopRatedMovies from "../components/TopRatedMovies";
import RecentMovies from "../components/RecentMovies";
import GenreSection from "../components/GenreSection";
import AboutSection from "../components/AboutSection";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxios from "../hooks/useAxios";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalMovies: 0, totalUsers: 0 });
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const axiosInstance = useAxios();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [statsMovies, statsUsers, topRated, recent] = await Promise.all([
        axiosInstance.get("/stats/movies-count"),
        axiosInstance.get("/stats/users-count"),
        axiosInstance.get("/movies-top-rated"),
        axiosInstance.get("/movies-recent"),
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
    <>
      <Helmet>
        <title>Home - Movie Matrix</title>
        <meta
          name="description"
          content="Welcome to Movie Matrix - Your ultimate movie collection and discovery platform."
        />
      </Helmet>
      <div className="min-h-screen bg-movie-dark max-w-11/12 mx-auto">
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
