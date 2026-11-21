import { useRef } from "react";
import { Link } from "react-router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Horizontal "Top 10" row: big outlined rank numbers next to each poster
const TrendingRow = ({ movies, title = "Trending Now" }) => {
  const rowRef = useRef(null);
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * rowRef.current.clientWidth * 0.8, behavior: "smooth" });
  const arrow =
    "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-mm-raised/90 text-2xl text-mm-ink shadow-lg hover:bg-mm-field md:flex";

  return (
    <section aria-labelledby="trending-title" className="mx-auto w-full max-w-[1180px] px-6">
      <h2 id="trending-title" className="mb-4 font-display text-2xl font-extrabold text-mm-ink md:text-[30px]">
        {title}
      </h2>
      <div className="relative">
        <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left" className={`${arrow} -left-5`}>
          <FiChevronLeft aria-hidden="true" />
        </button>
        <ol
          ref={rowRef}
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {movies.map((movie, i) => (
            <li key={movie._id} className="flex shrink-0 snap-start items-end">
              <span
                aria-hidden="true"
                className="-mr-5 font-display text-[110px] leading-[0.8] font-extrabold text-mm-bg [-webkit-text-stroke:3px_var(--color-mm-muted)] md:text-[140px]"
              >
                {i + 1}
              </span>
              <Link
                to={`/movies/${movie._id}`}
                aria-label={`${i + 1}. ${movie.title}`}
                className="relative block w-[120px] overflow-hidden rounded-md ring-mm-accent transition-transform hover:scale-105 focus-visible:ring-2 md:w-[150px]"
              >
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt="" loading="lazy" className="aspect-2/3 w-full object-cover" />
                ) : (
                  <span className="flex aspect-2/3 w-full items-end bg-mm-raised p-3 font-display font-extrabold text-mm-ink">
                    {movie.title}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => scroll(1)} aria-label="Scroll right" className={`${arrow} -right-5`}>
          <FiChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default TrendingRow;
