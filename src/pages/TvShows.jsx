import * as api from "../api/api";
import CatalogPage from "../components/browse/CatalogPage";
import SeriesCard from "../components/tv/SeriesCard";

// TV Shows: series from TMDB, in the shared catalog layout (same as Movies)
const TV_CONFIG = {
  title: "TV Shows",
  noun: "TV shows",
  description: "Browse trending, popular and top rated TV series, or explore by genre.",
  rows: [
    { list: "trending", title: "Trending Now" },
    { list: "popular", title: "Popular" },
    { list: "top_rated", title: "Top Rated" },
    { list: "on_the_air", title: "New Episodes This Week" },
    { list: "airing_today", title: "Airing Today" },
  ],
  getList: (list) => api.getTvList(list),
  getGenres: api.getTvGenres,
  discover: api.discoverTv,
  renderCard: (series) => <SeriesCard series={series} />,
  linkTo: (series) => `/tv/${series.id}`,
  heroEyebrow: "#1 trending series this week",
  listType: "series",
};

const TvShows = () => <CatalogPage config={TV_CONFIG} />;

export default TvShows;
