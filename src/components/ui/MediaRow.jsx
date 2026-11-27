import { useRef } from "react";
import { Link } from "react-router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Netflix-style horizontal row: a title, then cards that scroll sideways with arrow buttons.
 *
 * <MediaRow id="trending" title="Trending Now" items={series} renderItem={(s) => <SeriesCard series={s} />} />
 * <MediaRow ... action={{ label: "See all", to: "/movies/community" }} />   // optional link beside the title
 */
const MediaRow = ({ id, title, items, renderItem, action, getKey = (item) => item.id ?? item._id }) => {
  const rowRef = useRef(null);
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * rowRef.current.clientWidth * 0.85, behavior: "smooth" });
  const arrow =
    "absolute top-[38%] z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-2xl text-mm-ink opacity-0 transition-opacity group-hover/row:opacity-100 hover:bg-black/90 focus-visible:opacity-100 md:flex";

  if (!items?.length) return null;

  return (
    <section aria-labelledby={id} className="group/row">
      <div className="mb-3 flex items-baseline gap-4 px-4 sm:px-8 lg:px-14">
        <h2 id={id} className="font-display text-lg font-bold text-mm-ink md:text-xl">
          {title}
        </h2>
        {action && (
          <Link to={action.to} className="text-sm font-semibold text-mm-accent hover:underline">
            {action.label} ›
          </Link>
        )}
      </div>
      {/* The row keeps the page margin on both sides; cards scroll inside it */}
      <div className="relative mx-4 sm:mx-8 lg:mx-14">
        <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`} className={`${arrow} left-2`}>
          <FiChevronLeft aria-hidden="true" />
        </button>
        {/* [contain:paint] stops the cards from widening the page on phones */}
        <ul
          ref={rowRef}
          className="flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2 [contain:paint] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <li key={getKey(item)} className="w-[160px] shrink-0 snap-start sm:w-[190px] lg:w-[220px] 2xl:w-[240px]">
              {renderItem(item)}
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`} className={`${arrow} right-2`}>
          <FiChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default MediaRow;
