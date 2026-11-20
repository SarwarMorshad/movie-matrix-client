import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as api from "../api/api";
import HeroSlider from "../components/home/HeroSlider";
import GenreGrid from "../components/home/GenreGrid";
import { PosterCard, SectionHeader, Spinner } from "../components/ui";

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

const BrowseHome = () => {
  const [loading, setLoading] = useState(true);
  const [topRated, setTopRated] = useState([]);
  const [recent, setRecent] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Each section loads on its own, so one failing request doesn't blank the page
    Promise.allSettled([api.getTopRatedMovies(10), api.getRecentMovies(5), api.getGenreCounts()])
      .then(([top, newest, genreCounts]) => {
        if (top.status === "fulfilled") setTopRated(top.value);
        if (newest.status === "fulfilled") setRecent(newest.value);
        if (genreCounts.status === "fulfilled") setGenres(genreCounts.value);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullPage label="Loading movies" />;

  return (
    <>
      <Helmet>
        <title>Movie Matrix · Discover and track movies</title>
        <meta
          name="description"
          content="Browse top rated and newly added movies, keep a watchlist and share reviews on Movie Matrix."
        />
      </Helmet>

      <HeroSlider movies={topRated.slice(0, 5)} />

      {topRated.length > 0 && (
        <Section id="top-rated" eyebrow="Top rated" title="Top Rated Movies" action={{ label: "View all", to: "/movies" }}>
          <PosterGrid movies={topRated} />
        </Section>
      )}

      {recent.length > 0 && (
        <Section id="recent" eyebrow="Just added" title="Recently Added" action={{ label: "View all", to: "/movies" }}>
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
