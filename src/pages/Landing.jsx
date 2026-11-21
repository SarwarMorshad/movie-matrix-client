import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as api from "../api/api";
import usePosterUrls from "../hooks/usePosterUrls";
import LandingHero from "../components/landing/LandingHero";
import PlansBanner from "../components/landing/PlansBanner";
import TrendingRow from "../components/landing/TrendingRow";
import Reasons from "../components/landing/Reasons";
import Faq from "../components/landing/Faq";

// Home page for visitors who aren't signed in
const Landing = () => {
  const posters = usePosterUrls();
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    api.getTopRatedMovies(10).then(setTrending).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Movie Matrix · Discover, track and review movies</title>
        <meta
          name="description"
          content="Discover top rated movies, keep a watchlist and share your reviews. Join Movie Matrix for free."
        />
      </Helmet>

      <LandingHero posters={posters} />
      <div className="flex flex-col gap-16 pb-20">
        <PlansBanner />
        {trending.length > 0 && <TrendingRow movies={trending} />}
        <Reasons />
        <Faq />
      </div>
    </>
  );
};

export default Landing;
