import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as api from "../api/api";
import HeroSlider from "../components/home/HeroSlider";
import GenreGrid from "../components/home/GenreGrid";
import FilmCard from "../components/film/FilmCard";
import { MediaRow, PosterCard, SectionHeader, Spinner } from "../components/ui";

// Film rows from TMDB, in the order they appear
const FILM_ROWS = [
  { list: "popular", title: "Popular right now" },
  { list: "now_playing", title: "Now in cinemas" },
  { list: "upcoming", title: "Coming soon" },
  { list: "top_rated", title: "All-time top rated" },
];

const Section = ({ id, eyebrow, title, action, children }) => (
  <section aria-labelledby={id} className="mx-auto w-full max-w-[1180px] px-6 pt-12 pb-4">
    <SectionHeader id={id} eyebrow={eyebrow} title={title} action={action} />
    {children}
  </section>
);

const PosterGrid = ({ movies, badge }) => (
  <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    {movies.map((movie) => (
      <li key={movie._id}>
        <PosterCard movie={movie} badge={badge} />
      </li>
    ))}
  </ul>
);

// Home page for signed-in members: trending films hero, TMDB rows, then the community's own movies
const BrowseHome = () => {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [rows, setRows] = useState({}); // list -> films
  const [topRated, setTopRated] = useState([]);
  const [recent, setRecent] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Each section loads on its own, so one failing request doesn't blank the page
    const filmLists = FILM_ROWS.map((r) => api.getFilmList(r.list));
    Promise.allSettled([
      api.getFilmList("trending"),
      api.getTopRatedMovies(10),
      api.getRecentMovies(5),
      api.getGenreCounts(),
      ...filmLists,
    ])
      .then(([trend, top, newest, genreCounts, ...lists]) => {
        if (trend.status === "fulfilled") setTrending(trend.value.results);
        if (top.status === "fulfilled") setTopRated(top.value);
        if (newest.status === "fulfilled") setRecent(newest.value);
        if (genreCounts.status === "fulfilled") setGenres(genreCounts.value);
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

  return (
    <>
      <Helmet>
        <title>Movie Matrix · Discover and track movies</title>
        <meta name="description" content="Trending films, new releases and the community's favourite movies on Movie Matrix." />
      </Helmet>

      {/* Without TMDB there's no hero, so keep the page clear of the fixed navbar */}
      {heroFilms.length ? <HeroSlider films={heroFilms} /> : <div className="pt-24" />}

      {/* TMDB rows sit right under the hero, Netflix style */}
      <div className="relative z-10 -mt-10 flex flex-col gap-10">
        <MediaRow id="trending-films" title="Trending this week" items={trending.slice(5)} renderItem={(f) => <FilmCard film={f} />} />
        {FILM_ROWS.map((r) => (
          <MediaRow key={r.list} id={`films-${r.list}`} title={r.title} items={rows[r.list]} renderItem={(f) => <FilmCard film={f} />} />
        ))}
      </div>

      {topRated.length > 0 && (
        <Section id="top-rated" eyebrow="From the community" title="Members' Top Rated" action={{ label: "View all", to: "/movies" }}>
          <PosterGrid movies={topRated} />
        </Section>
      )}

      {recent.length > 0 && (
        <Section id="recent" eyebrow="Just added" title="Recently Added by Members" action={{ label: "View all", to: "/movies" }}>
          <PosterGrid movies={recent} badge="New" />
        </Section>
      )}

      {genres.length > 0 && (
        <Section id="genres" eyebrow="Explore" title="Browse by Genre">
          <GenreGrid genres={genres} />
        </Section>
      )}

      <div className="pb-16" />
    </>
  );
};

export default BrowseHome;
