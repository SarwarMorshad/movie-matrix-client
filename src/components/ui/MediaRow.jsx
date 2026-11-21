import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Netflix-style horizontal row: a title, then cards that scroll sideways with arrow buttons.
 *
 * <MediaRow id="trending" title="Trending Now" items={series} renderItem={(s) => <SeriesCard series={s} />} />
 */
const MediaRow = ({ id, title, items, renderItem, getKey = (item) => item.id ?? item._id }) => {
  const rowRef = useRef(null);
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * rowRef.current.clientWidth * 0.85, behavior: "smooth" });
  const arrow =
    "absolute top-[38%] z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-2xl text-mm-ink opacity-0 transition-opacity group-hover/row:opacity-100 hover:bg-black/90 focus-visible:opacity-100 md:flex";

  if (!items?.length) return null;

  return (
    <section aria-labelledby={id} className="group/row">
      <h2 id={id} className="mb-3 px-4 font-display text-lg font-bold text-mm-ink sm:px-8 md:text-xl lg:px-14">
        {title}
      </h2>
      <div className="relative">
        <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`} className={`${arrow} left-2`}>
          <FiChevronLeft aria-hidden="true" />
        </button>
        <ul
          ref={rowRef}
          className="flex snap-x gap-3 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-8 lg:px-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <li key={getKey(item)} className="w-[140px] shrink-0 snap-start sm:w-[160px] lg:w-[180px]">
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
