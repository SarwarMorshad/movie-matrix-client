import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ExpandedTile from "../preview/ExpandedTile";
import { prefetchTitleDetails } from "../../hooks/useTitleDetails";

const OPEN_DELAY = 200; // ms resting on a tile before it grows (skips tiles the mouse just passes over)
const RESIZE_MS = 800; // grow / shrink time; matches duration-800 on the <li> below

// Films and series from TMDB can grow into a trailer card; members' movies can't
const canExpand = (item) => item?.type === "film" || item?.type === "series";
const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Netflix-style horizontal row: a title, then cards that scroll sideways with arrow buttons.
 * Resting the mouse on a film or series grows that tile in place into a wide card with
 * its muted trailer (ExpandedTile), pushing the tiles after it along — like Netflix.
 *
 * <MediaRow id="trending" title="Trending Now" items={series} renderItem={(s) => <SeriesCard series={s} />} />
 * <MediaRow ... action={{ label: "See all", to: "/movies/community" }} />   // optional link beside the title
 */
const MediaRow = ({ id, title, items, renderItem, action, getKey = (item) => item.id ?? item._id }) => {
  const rowRef = useRef(null);
  const timer = useRef(null);
  const closeTimer = useRef(null);
  const activeRef = useRef(null);
  const [active, setActive] = useState(null); // key of the grown tile
  const [closing, setClosing] = useState(null); // key of the tile shrinking back, while it animates
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * rowRef.current.clientWidth * 0.85, behavior: "smooth" });

  // Grow `key` (or none); the tile that was grown keeps its wide card while it shrinks back
  const show = (key) => {
    const previous = activeRef.current;
    if (previous === key) return;
    activeRef.current = key;
    setActive(key);
    if (previous !== null) {
      setClosing(previous);
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => setClosing(null), RESIZE_MS);
    }
  };

  const hoverTile = (key, item) => {
    clearTimeout(timer.current);
    if (key === activeRef.current || !canExpand(item) || !canHover()) return;
    prefetchTitleDetails(item.type, item.id); // trailer id is ready by the time the tile has grown
    timer.current = setTimeout(() => show(key), OPEN_DELAY);
  };

  const leaveRow = () => {
    clearTimeout(timer.current);
    show(null);
  };

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      clearTimeout(closeTimer.current);
    },
    []
  );

  // Once the tile has grown, scroll the row if its right side is cut off
  useEffect(() => {
    if (active === null) return;
    const t = setTimeout(() => {
      const row = rowRef.current;
      const tile = row?.querySelector('[data-active="true"]');
      if (!row || !tile) return;
      const overflow = tile.getBoundingClientRect().right - row.getBoundingClientRect().right;
      if (overflow > 0) row.scrollBy({ left: overflow + 4, behavior: "smooth" });
    }, RESIZE_MS + 20);
    return () => clearTimeout(t);
  }, [active]);

  if (!items?.length) return null;

  // Scroll arrows; hidden while a tile is grown so they don't cover its picture
  const arrow = `absolute top-[38%] z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-2xl text-mm-ink opacity-0 transition-opacity group-hover/row:opacity-100 hover:bg-black/90 focus-visible:opacity-100 ${
    active === null ? "md:flex" : ""
  }`;

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
        {/* [contain:paint] stops the cards from widening the page on phones.
            --tile is a poster's width; a grown tile is 16:9 at the poster's height. */}
        <ul
          ref={rowRef}
          onMouseLeave={leaveRow}
          className={`flex gap-4 overflow-x-auto scroll-smooth pb-2 [--tile:160px] [contain:paint] sm:[--tile:190px] lg:[--tile:220px] 2xl:[--tile:240px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            active === null ? "snap-x" : ""
          }`}
        >
          {items.map((item) => {
            const key = getKey(item);
            const isActive = key === active;
            const isClosing = key === closing && !isActive;
            return (
              // The width eases between poster and wide card, so the tiles after it glide
              // along both ways; the poster and the wide card cross-fade on top of each other.
              <li
                key={key}
                data-active={isActive}
                onMouseEnter={() => hoverTile(key, item)}
                className={`relative shrink-0 snap-start transition-[width] duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
                  isActive ? "w-[calc(var(--tile)*8/3)]" : "w-(--tile)"
                } ${isActive || isClosing ? "overflow-hidden" : ""}`}
              >
                {/* The poster keeps its width the whole time, so it never stretches and the row keeps its height */}
                <div inert={isActive} className={`w-(--tile) transition-opacity duration-500 ${isActive ? "opacity-0" : "opacity-100"}`}>
                  {renderItem(item)}
                </div>
                {(isActive || isClosing) && (
                  <div
                    className={`absolute top-0 left-0 ${
                      isActive ? "motion-safe:animate-[tileFadeIn_500ms_ease-out]" : "opacity-0 transition-opacity duration-500"
                    }`}
                  >
                    <ExpandedTile item={item} leaving={isClosing} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`} className={`${arrow} right-2`}>
          <FiChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default MediaRow;
