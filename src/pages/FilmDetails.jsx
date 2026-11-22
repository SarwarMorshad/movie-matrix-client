import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { FaPlay } from "react-icons/fa";
import * as api from "../api/api";
import { Button, MediaRow, Spinner, TrailerModal } from "../components/ui";
import FilmCard from "../components/film/FilmCard";
import CastRow from "../components/tv/CastRow";
import MyListButton from "../components/common/MyListButton";
import { formatRating, formatRuntime } from "../utils/format";

const Fact = ({ label, children }) =>
  children ? (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <dt className="shrink-0 text-mm-muted">{label}:</dt>
      <dd className="text-mm-ink">{children}</dd>
    </div>
  ) : null;

const formatDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;

// A movie from TMDB: backdrop hero, trailer, facts, cast and similar films
const FilmDetails = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notFound | error
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setTrailerOpen(false);
    api
      .getFilm(id)
      .then((data) => {
        if (cancelled) return;
        setFilm(data);
        setStatus("ready");
      })
      .catch((error) => !cancelled && setStatus(error.response?.status === 404 ? "notFound" : "error"));
    window.scrollTo({ top: 0 });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") return <Spinner fullPage label="Loading film" />;

  if (status !== "ready") {
    return (
      <div className="flex flex-col items-center gap-3 px-6 pt-40 pb-24 text-center">
        <p className="font-display text-2xl font-extrabold text-mm-ink">
          {status === "notFound" ? "We couldn't find that film" : "Couldn't load this film"}
        </p>
        <p className="text-mm-muted">{status === "notFound" ? "It may have been removed." : "Please check your connection and try again."}</p>
        <Button className="mt-2" to="/">
          Back to home
        </Button>
      </div>
    );
  }

  const facts = [film.year, formatRuntime(film.runtime)].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{`${film.title} · Movie Matrix`}</title>
        <meta name="description" content={film.overview?.slice(0, 160) || `${film.title} on Movie Matrix`} />
      </Helmet>

      {/* Hero on the backdrop */}
      <section aria-labelledby="film-title" className="relative isolate flex min-h-[560px] items-end overflow-hidden md:min-h-[680px]">
        {film.backdropUrl && <img src={film.backdropUrl} alt="" className="absolute inset-0 -z-20 size-full object-cover object-top" />}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-mm-bg via-mm-bg/75 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-linear-to-t from-mm-bg to-transparent" />

        <div className="flex w-full max-w-3xl flex-col gap-4 px-4 pt-32 pb-12 sm:px-8 lg:px-14">
          <p className="text-sm text-mm-muted">
            <Link to="/" className="hover:text-mm-ink hover:underline">
              Films
            </Link>
            {film.genres[0] && <> › {film.genres[0]}</>}
          </p>
          <h1 id="film-title" className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-mm-ink md:text-6xl">
            {film.title}
          </h1>
          {film.tagline && <p className="text-lg text-mm-ink/80 italic">{film.tagline}</p>}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mm-ink/85">
            <span className="rounded-[3px] border-[1.5px] border-mm-accent px-2 py-[2px] font-bold text-mm-accent">
              ★ {formatRating(film.rating)}
            </span>
            {film.contentRating && (
              <span className="rounded-[3px] border border-mm-muted px-1.5 text-xs font-semibold text-mm-ink">{film.contentRating}</span>
            )}
            {facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
            {film.genres.length > 0 && <span>{film.genres.slice(0, 3).join(" · ")}</span>}
          </div>
          {film.overview && <p className="max-w-2xl text-base leading-relaxed text-mm-ink/90 md:text-lg">{film.overview}</p>}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {film.trailerKey && (
              <Button size="lg" variant="light" onClick={() => setTrailerOpen(true)} icon={<FaPlay className="text-xs" />}>
                Play trailer
              </Button>
            )}
            <MyListButton type="film" id={film.id} />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-14 px-4 pb-20 sm:px-8 lg:px-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <CastRow cast={film.cast} />
          </div>
          <aside aria-labelledby="about-title" className="w-full shrink-0 rounded-lg border border-mm-border bg-mm-surface p-6 lg:w-80">
            <h2 id="about-title" className="mb-4 font-display text-lg font-bold text-mm-ink">
              About {film.title}
            </h2>
            <dl className="flex flex-col gap-3 text-sm">
              <Fact label="Directed by">{film.directors.join(", ")}</Fact>
              <Fact label="Released">{formatDate(film.releaseDate)}</Fact>
              <Fact label="Runtime">{formatRuntime(film.runtime)}</Fact>
              <Fact label="Genres">{film.genres.join(", ")}</Fact>
              <Fact label="Country">{film.countries.join(", ")}</Fact>
              <Fact label="Language">{film.language?.toUpperCase()}</Fact>
              <Fact label="TMDB votes">{film.voteCount ? film.voteCount.toLocaleString("en-US") : null}</Fact>
            </dl>
          </aside>
        </div>
      </div>

      <div className="pb-20">
        <MediaRow id="similar-films" title="More like this" items={film.similar} renderItem={(f) => <FilmCard film={f} />} />
      </div>

      {film.trailerKey && (
        <TrailerModal youtubeKey={film.trailerKey} title={film.title} open={trailerOpen} onClose={() => setTrailerOpen(false)} />
      )}
    </>
  );
};

export default FilmDetails;
