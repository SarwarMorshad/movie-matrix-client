import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as api from "../api/api";
import HeroSlider from "../components/home/HeroSlider";
import FilmCard from "../components/film/FilmCard";
import { MediaRow, PosterCard, Spinner } from "../components/ui";

// Film rows from TMDB, in the order they appear
const FILM_ROWS = [
  { list: "popular", title: "Popular right now" },
  { list: "now_playing", title: "Now in cinemas" },
  { list: "upcoming", title: "Coming soon" },
  { list: "top_rated", title: "All-time top rated" },
];

const SEE_MEMBERS = { label: "See all", to: "/movies/community" };

// Home page for signed-in members: trending films hero, then Netflix-style rows —
// TMDB films first, the community's own movies after them
const BrowseHome = () => {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [rows, setRows] = useState({}); // list -> films
  const [topRated, setTopRated] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // Each row loads on its own, so one failing request doesn't blank the page
    const filmLists = FILM_ROWS.map((r) => api.getFilmList(r.list));
    Promise.allSettled([api.getFilmList("trending"), api.getTopRatedMovies(20), api.getRecentMovies(20), ...filmLists])
      .then(([trend, top, newest, ...lists]) => {
        if (trend.status === "fulfilled") setTrending(trend.value.results);
        if (top.status === "fulfilled") setTopRated(top.value);
        if (newest.status === "fulfilled") setRecent(newest.value);
        const byList = {};
        lists.forEach((r, i) => {
          if (r.status === "fulfilled") byList[FILM_ROWS[i].list] = r.value.results;
        });
        setRows(byList);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullPage label="Loading movies" />;

  const heroFilms = trending.filter((f) => f.backdropUrl).slice(0, 5);
  const memberCard = (movie) => <PosterCard movie={movie} />;

  return (
    <>
      <Helmet>
        <title>Movie Matrix · Discover and track movies</title>
        <meta name="description" content="Trending films, new releases and the community's favourite movies on Movie Matrix." />
      </Helmet>

      {/* Without TMDB there's no hero, so keep the page clear of the fixed navbar */}
      {heroFilms.length ? <HeroSlider films={heroFilms} /> : <div className="pt-24" />}

      {/* Every section is a row right under the hero, Netflix style */}
      <div className="relative z-10 -mt-10 flex flex-col gap-10 pb-16">
        <MediaRow id="trending-films" title="Trending this week" items={trending.slice(5)} renderItem={(f) => <FilmCard film={f} />} />
        {FILM_ROWS.slice(0, 2).map((r) => (
          <MediaRow key={r.list} id={`films-${r.list}`} title={r.title} items={rows[r.list]} renderItem={(f) => <FilmCard film={f} />} />
        ))}
        <MediaRow id="members-top" title="Top rated by our members" items={topRated} renderItem={memberCard} getKey={(m) => m._id} action={SEE_MEMBERS} />
        {FILM_ROWS.slice(2).map((r) => (
          <MediaRow key={r.list} id={`films-${r.list}`} title={r.title} items={rows[r.list]} renderItem={(f) => <FilmCard film={f} />} />
        ))}
        <MediaRow id="members-new" title="Just added by members" items={recent} renderItem={memberCard} getKey={(m) => m._id} action={SEE_MEMBERS} />
      </div>
    </>
  );
};

export default BrowseHome;
