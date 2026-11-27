import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PreviewCard from "./PreviewCard";

const OPEN_DELAY = 500; // ms of hovering before the card grows, like Netflix
const CLOSE_DELAY = 120; // grace period for moving from the tile onto the card

// Only on devices with a real mouse; touch screens just follow the link
const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Only one preview open at a time
let closeOpenPreview = null;

/**
 * Wraps a film or series tile: hovering it for a moment opens the Netflix-style
 * preview card (muted trailer, Play / My List / More info) over the tile.
 *
 * <HoverPreview item={film} type="film"><PosterCard … /></HoverPreview>
 */
const HoverPreview = ({ item, type, children }) => {
  const ref = useRef(null);
  const timers = useRef({});
  const pinned = useRef(false);
  const [anchor, setAnchor] = useState(null);

  const clearTimers = () => {
    clearTimeout(timers.current.open);
    clearTimeout(timers.current.close);
  };

  const close = useCallback(() => {
    if (pinned.current) return;
    clearTimers();
    setAnchor(null);
    if (closeOpenPreview === close) closeOpenPreview = null;
  }, []);

  const onTileEnter = () => {
    if (!canHover()) return;
    clearTimers();
    if (anchor) return;
    timers.current.open = setTimeout(() => {
      closeOpenPreview?.();
      closeOpenPreview = close;
      setAnchor(ref.current.getBoundingClientRect());
    }, OPEN_DELAY);
  };

  const scheduleClose = () => {
    clearTimeout(timers.current.open);
    timers.current.close = setTimeout(close, CLOSE_DELAY);
  };

  const keepOpen = () => clearTimeout(timers.current.close);
  const setPinned = useCallback((value) => {
    pinned.current = value;
  }, []);

  // Scrolling (the page or a row) moves the tile away, so drop the card
  useEffect(() => {
    if (!anchor) return;
    const onScroll = () => close();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [anchor, close]);

  useEffect(
    () => () => {
      clearTimers();
      if (closeOpenPreview === close) closeOpenPreview = null;
    },
    [close]
  );

  return (
    <div ref={ref} onMouseEnter={onTileEnter} onMouseLeave={scheduleClose}>
      {children}
      {anchor &&
        createPortal(
          <PreviewCard
            item={item}
            type={type}
            anchor={anchor}
            onPointerEnter={keepOpen}
            onPointerLeave={scheduleClose}
            onPin={setPinned}
          />,
          document.body
        )}
    </div>
  );
};

export default HoverPreview;
