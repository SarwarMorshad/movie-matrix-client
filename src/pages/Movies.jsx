import * as api from "../api/api";
import CatalogPage from "../components/browse/CatalogPage";
import FilmCard from "../components/film/FilmCard";
import MembersMoviesRow from "../components/film/MembersMoviesRow";

// Movies: films from TMDB in the shared catalog layout (same as TV Shows),
// plus a row of the members' own movies
const MOVIES_CONFIG = {
  title: "Movies",
  noun: "movies",
  description: "Browse trending, popular and top rated movies, what's in cinemas and what's coming soon, or explore by genre.",
  rows: [
    { list: "trending", title: "Trending Now" },
    { list: "popular", title: "Popular" },
    { list: "now_playing", title: "In Cinemas" },
    { list: "upcoming", title: "Coming Soon" },
    { list: "top_rated", title: "Top Rated" },
  ],
  getList: (list) => api.getFilmList(list),
  getGenres: api.getFilmGenres,
  discover: api.discoverFilms,
  renderCard: (film) => <FilmCard film={film} />,
  linkTo: (film) => `/film/${film.id}`,
  heroEyebrow: "#1 trending film this week",
  listType: "film",
  extraRows: <MembersMoviesRow />,
};

const Movies = () => <CatalogPage config={MOVIES_CONFIG} />;

export default Movies;
