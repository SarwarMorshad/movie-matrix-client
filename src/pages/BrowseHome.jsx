import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as api from "../api/api";
import HeroSlider from "../components/home/HeroSlider";
import FilmCard from "../components/film/FilmCard";
import SeriesCard from "../components/tv/SeriesCard";
import { MediaRow, PosterCard, Spinner } from "../components/ui";

const filmCard = (film) => <FilmCard film={film} />;
const seriesCard = (series) => <SeriesCard series={series} />;
const memberCard = (movie) => <PosterCard movie={movie} />;
const memberKey = (movie) => movie._id;
const SEE_MEMBERS = { label: "See all", to: "/movies/community" };

// Every row on the home page, in order: movies and TV shows take turns,
// with the members' own movies in between. `load` returns the row's items.
const ROWS = [
  { id: "films-trending", title: "Trending movies this week", load: () => api.getFilmList("trending"), renderItem: filmCard, skipHero: true },
  { id: "tv-trending", title: "Trending TV shows", load: () => api.getTvList("trending"), renderItem: seriesCard, action: { label: "See all", to: "/tv" } },
  { id: "films-popular", title: "Popular movies", load: () => api.getFilmList("popular"), renderItem: filmCard, action: { label: "See all", to: "/movies" } },
  { id: "tv-popular", title: "Popular TV shows", load: () => api.getTvList("popular"), renderItem: seriesCard },
  { id: "members-top", title: "Top rated by our members", load: () => api.getTopRatedMovies(20), renderItem: memberCard, getKey: memberKey, action: SEE_MEMBERS },
  { id: "films-now", title: "Now in cinemas", load: () => api.getFilmList("now_playing"), renderItem: filmCard },
  { id: "tv-on-air", title: "New episodes this week", load: () => api.getTvList("on_the_air"), renderItem: seriesCard },
  { id: "films-upcoming", title: "Coming soon", load: () => api.getFilmList("upcoming"), renderItem: filmCard },
  { id: "tv-top", title: "Top rated TV shows", load: () => api.getTvList("top_rated"), renderItem: seriesCard },
  { id: "films-top", title: "All-time top rated movies", load: () => api.getFilmList("top_rated"), renderItem: filmCard },
  { id: "members-new", title: "Just added by members", load: () => api.getRecentMovies(20), renderItem: memberCard, getKey: memberKey, action: SEE_MEMBERS },
];

// TMDB lists come as { results }, the members' lists as plain arrays
const itemsOf = (value) => (Array.isArray(value) ? value : value?.results || []);

// Home page for signed-in members: trending films hero, then Netflix-style rows
// of movies, TV shows and the community's own movies
const BrowseHome = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState({}); // row id -> items

  useEffect(() => {
    // Each row loads on its own, so one failing request doesn't blank the page
    Promise.allSettled(ROWS.map((row) => row.load()))
      .then((results) => {
        const byRow = {};
        results.forEach((r, i) => {
          if (r.status === "fulfilled") byRow[ROWS[i].id] = itemsOf(r.value);
        });
        setItems(byRow);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullPage label="Loading movies and TV shows" />;

  const heroFilms = (items["films-trending"] || []).filter((f) => f.backdropUrl).slice(0, 5);
  const heroIds = new Set(heroFilms.map((f) => f.id));

  return (
    <>
      <Helmet>
        <title>Movie Matrix · Discover and track movies and TV shows</title>
        <meta name="description" content="Trending movies and TV shows, new releases and the community's favourite movies on Movie Matrix." />
      </Helmet>

      {/* Without TMDB there's no hero, so keep the page clear of the fixed navbar */}
      {heroFilms.length ? <HeroSlider films={heroFilms} /> : <div className="pt-24" />}

      {/* Every section is a row right under the hero, Netflix style */}
      <div className="relative z-10 -mt-10 flex flex-col gap-10 pb-16">
        {ROWS.map((row) => (
          <MediaRow
            key={row.id}
            id={row.id}
            title={row.title}
            items={row.skipHero ? (items[row.id] || []).filter((f) => !heroIds.has(f.id)) : items[row.id]}
            renderItem={row.renderItem}
            getKey={row.getKey}
            action={row.action}
          />
        ))}
      </div>
    </>
  );
};

export default BrowseHome;
