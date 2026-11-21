import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FaPlay } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import * as api from "../../api/api";
import Button from "../ui/Button";
import { formatRating, formatRuntime } from "../../utils/format";

const AUTOPLAY_MS = 7000;

/**
 * Full-width featured slider. Until real backdrops arrive (TMDB phase), each
 * slide uses the poster twice: blurred and darkened as the background, and
 * sharp on the right.
 */
const HeroSlider = ({ movies }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = movies.length;

  const go = useCallback((i) => setIndex((i + count) % count), [count]);

  // Auto-advance, unless paused (hover/focus) or the user prefers less motion
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduceMotion || count < 2) return;
    const timer = setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, count, go]);

  if (!count) return null;
  const movie = movies[index];

  const addToWatchlist = async () => {
    if (!user) return navigate("/login");
    try {
      await api.addToWatchlist(movie._id);
      toast.success(`${movie.title} added to your watchlist`);
    } catch (error) {
      if (error.response?.status === 409) toast("Already in your watchlist");
      else toast.error("Couldn't add to watchlist");
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured movies"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative isolate overflow-hidden bg-mm-raised"
    >
      {/* Background: the poster, blurred */}
      {movie.posterUrl && (
        <img
          key={movie._id}
          src={movie.posterUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full scale-110 object-cover opacity-60 blur-2xl"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-mm-bg via-mm-bg/80 to-mm-bg/30"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-mm-bg to-transparent" />

      <div
        key={movie._id}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${count}`}
        className="mx-auto flex min-h-[560px] max-w-[1180px] items-center gap-12 px-6 pt-28 pb-24 motion-safe:animate-fadeIn md:min-h-[640px]"
      >
        <div className="flex max-w-2xl flex-1 flex-col gap-[18px]">
          <p className="font-display text-[13px] font-bold tracking-[0.14em] text-mm-accent uppercase">
            Featured · #{index + 1} top rated
          </p>
          <h1 className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-balance text-mm-ink md:text-6xl">
            {movie.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-mm-ink/80">
            {movie.language && (
              <span className="rounded-[3px] bg-mm-ink px-2 py-1 font-bold tracking-wider text-mm-bg uppercase">
                {movie.language}
              </span>
            )}
            <span className="rounded-[3px] border-[1.5px] border-mm-accent px-2 py-[3px] font-bold text-mm-accent">
              ★ {formatRating(movie.rating)}
            </span>
            {[movie.releaseYear, movie.genre, formatRuntime(movie.duration)].filter(Boolean).map((part, i) => (
              <span key={part} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden="true" className="text-mm-faint">•</span>}
                {part}
              </span>
            ))}
          </div>
          {movie.plotSummary && (
            <p className="line-clamp-3 max-w-xl text-base leading-relaxed text-mm-ink/80">{movie.plotSummary}</p>
          )}
          <div className="flex flex-wrap gap-3 pt-1.5">
            <Button size="lg" uppercase to={`/movies/${movie._id}`} icon={<FaPlay className="text-xs" />}>
              View details
            </Button>
            <Button size="lg" uppercase variant="secondary" onClick={addToWatchlist} icon={<FiPlus />}>
              Watchlist
            </Button>
          </div>
        </div>

        {movie.posterUrl && (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className="hidden aspect-2/3 w-[260px] shrink-0 rounded-lg object-cover shadow-2xl shadow-black/60 md:block lg:w-[300px]"
          />
        )}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous featured movie"
            className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-2xl text-white hover:bg-black/60 md:flex"
          >
            <FiChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next featured movie"
            className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-2xl text-white hover:bg-black/60 md:flex"
          >
            <FiChevronRight aria-hidden="true" />
          </button>
          <div className="absolute inset-x-0 bottom-8 flex justify-center gap-1">
            {movies.map((m, i) => (
              <button
                key={m._id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${m.title}`}
                aria-current={i === index}
                className="flex size-7 items-center justify-center"
              >
                <span
                  className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-mm-accent" : "w-2 bg-white/45"}`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;
