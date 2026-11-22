import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlay } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiInfo } from "react-icons/fi";
import * as api from "../../api/api";
import { Button, TrailerModal } from "../ui";
import { formatRating } from "../../utils/format";
import { FILM_GENRE_NAMES } from "../../config/movies";

const AUTOPLAY_MS = 8000;

/**
 * Full-width featured slider for the signed-in home page: this week's trending
 * films on their real TMDB backdrops, with "Play trailer" and "More info".
 *
 * <HeroSlider films={trending.slice(0, 5)} />
 */
const HeroSlider = ({ films }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [trailer, setTrailer] = useState(null); // { key, title } while the trailer is open
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const count = films.length;

  const go = useCallback((i) => setIndex((i + count) % count), [count]);

  // Auto-advance, unless paused (hover/focus/trailer) or the user prefers less motion
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || trailer || reduceMotion || count < 2) return;
    const timer = setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, trailer, count, go]);

  if (!count) return null;
  const film = films[index];
  const genres = (film.genreIds || []).map((id) => FILM_GENRE_NAMES[id]).filter(Boolean).slice(0, 3);

  // The trailer key lives on the details endpoint, so fetch it on demand
  const playTrailer = async () => {
    setLoadingTrailer(true);
    try {
      const details = await api.getFilm(film.id);
      if (details.trailerKey) setTrailer({ key: details.trailerKey, title: film.title });
      else toast("No trailer for this one yet");
    } catch {
      toast.error("Couldn't load the trailer");
    } finally {
      setLoadingTrailer(false);
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Trending films"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative isolate overflow-hidden bg-mm-raised"
    >
      {/* Backdrop */}
      {film.backdropUrl && (
        <img
          key={`backdrop-${film.id}`}
          src={film.backdropUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full object-cover object-top motion-safe:animate-[heroFade_0.9s_ease-out]"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-mm-bg via-mm-bg/70 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-black/60 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-linear-to-t from-mm-bg to-transparent" />

      <div
        key={`slide-${film.id}`}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${count}`}
        className="flex min-h-[580px] items-end px-4 pt-32 pb-24 motion-safe:animate-fadeIn sm:px-8 md:min-h-[680px] lg:px-14"
      >
        <div className="flex max-w-2xl flex-col gap-[18px]">
          <p className="font-display text-[13px] font-bold tracking-[0.14em] text-mm-accent uppercase">
            #{index + 1} trending film this week
          </p>
          <h1 className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-balance text-mm-ink md:text-6xl">
            {film.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2.5 text-sm text-mm-ink/85">
            <span className="rounded-[3px] border-[1.5px] border-mm-accent px-2 py-[2px] font-bold text-mm-accent">
              ★ {formatRating(film.rating)}
            </span>
            {film.year && <span>{film.year}</span>}
            {genres.length > 0 && (
              <>
                <span aria-hidden="true" className="text-mm-faint">•</span>
                <span>{genres.join(" · ")}</span>
              </>
            )}
          </div>
          {film.overview && <p className="line-clamp-3 text-base leading-relaxed text-mm-ink/85 md:text-lg">{film.overview}</p>}
          <div className="flex flex-wrap gap-3 pt-1.5">
            <Button size="lg" variant="light" onClick={playTrailer} disabled={loadingTrailer} icon={<FaPlay className="text-xs" />}>
              {loadingTrailer ? "Loading…" : "Play trailer"}
            </Button>
            <Button size="lg" variant="secondary" to={`/film/${film.id}`} icon={<FiInfo />}>
              More info
            </Button>
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous film"
            className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-2xl text-white hover:bg-black/60 md:flex"
          >
            <FiChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next film"
            className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-2xl text-white hover:bg-black/60 md:flex"
          >
            <FiChevronRight aria-hidden="true" />
          </button>
          <div className="absolute inset-x-0 bottom-8 flex justify-center gap-1">
            {films.map((f, i) => (
              <button
                key={f.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${f.title}`}
                aria-current={i === index}
                className="flex size-7 items-center justify-center"
              >
                <span className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-mm-accent" : "w-2 bg-white/45"}`} />
              </button>
            ))}
          </div>
        </>
      )}

      <TrailerModal youtubeKey={trailer?.key} title={trailer?.title ?? ""} open={!!trailer} onClose={() => setTrailer(null)} />
    </section>
  );
};

export default HeroSlider;
