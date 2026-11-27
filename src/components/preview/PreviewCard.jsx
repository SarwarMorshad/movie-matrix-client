import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaPlay } from "react-icons/fa";
import { FiChevronDown, FiVolume2, FiVolumeX } from "react-icons/fi";
import * as api from "../../api/api";
import { TrailerModal } from "../ui";
import MyListButton from "../common/MyListButton";
import { formatRating, formatRuntime } from "../../utils/format";

const TRAILER_DELAY = 900; // ms on the still image before the trailer starts
const MARGIN = 16; // keep the card this far from the window edges
const NAVBAR = 72;

// Where each kind of title lives
const KINDS = {
  film: { page: (id) => `/film/${id}`, details: api.getFilm },
  series: { page: (id) => `/tv/${id}`, details: api.getSeries },
};

// Details (trailer, runtime, genres…) are fetched once per title
const detailsCache = new Map();
const loadDetails = (type, id) => {
  const key = `${type}-${id}`;
  if (!detailsCache.has(key)) {
    detailsCache.set(key, KINDS[type].details(id).catch((err) => {
      detailsCache.delete(key);
      throw err;
    }));
  }
  return detailsCache.get(key);
};

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Size and place the card over the tile it grew from: centred, or pushed inward at the window edges
const placement = (anchor) => {
  const vw = document.documentElement.clientWidth;
  const width = Math.round(Math.min(Math.max(anchor.width * 1.7, 300), 440));
  const height = width * 0.5625 + 170; // roughly: 16:9 picture + info panel
  let left = anchor.left + anchor.width / 2 - width / 2;
  let origin = "center";
  if (left < MARGIN) {
    left = Math.max(MARGIN, anchor.left);
    origin = "left";
  } else if (left + width > vw - MARGIN) {
    left = Math.min(vw - MARGIN - width, anchor.right - width);
    origin = "right";
  }
  const top = Math.max(anchor.top + (anchor.height - height) / 2, NAVBAR);
  return { width, left: left + window.scrollX, top: top + window.scrollY, origin, from: anchor.width / width };
};

// Tells the muted YouTube player to mute / unmute (needs enablejsapi=1)
const ytCommand = (iframe, func) =>
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");

/**
 * The Netflix-style card that grows out of a film or series tile on hover:
 * backdrop that turns into a muted trailer, round Play / My List / More info buttons,
 * then rating, age rating, length and genres. Rendered in a portal by HoverPreview.
 */
const PreviewCard = ({ item, type, anchor, onPointerEnter, onPointerLeave, onPin }) => {
  const navigate = useNavigate();
  const kind = KINDS[type];
  const [pos] = useState(() => placement(anchor));
  const [details, setDetails] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadDetails(type, item.id)
      .then((d) => !cancelled && setDetails(d))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [type, item.id]);

  // Start the muted preview after a moment on the still
  useEffect(() => {
    if (!details?.trailerKey || reduceMotion()) return;
    const timer = setTimeout(() => setShowTrailer(true), TRAILER_DELAY);
    return () => clearTimeout(timer);
  }, [details]);

  // Fade the video in only once YouTube says it's playing, and a little after,
  // so its own start-up buttons have gone by then
  useEffect(() => {
    if (!showTrailer) return;
    let timer;
    const onMessage = (e) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        const { info } = JSON.parse(e.data);
        if (info?.playerState === 1 && !timer) timer = setTimeout(() => setVideoReady(true), 1800);
      } catch {
        // not a YouTube message
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
    };
  }, [showTrailer]);

  // While the full trailer is open, the card must stay put
  useEffect(() => {
    onPin(trailerOpen);
  }, [trailerOpen, onPin]);

  const toggleMute = () => {
    ytCommand(iframeRef.current, muted ? "unMute" : "mute");
    setMuted(!muted);
  };

  const play = () => {
    if (details?.trailerKey) {
      ytCommand(iframeRef.current, "pauseVideo");
      setTrailerOpen(true);
    } else navigate(kind.page(item.id));
  };

  const key = details?.trailerKey;
  const length =
    type === "series"
      ? details?.numberOfSeasons && `${details.numberOfSeasons} ${details.numberOfSeasons === 1 ? "Season" : "Seasons"}`
      : formatRuntime(details?.runtime);
  const genres = (details?.genres || []).slice(0, 3);
  const picture = item.backdropUrl || item.posterUrl;

  return (
    <div
      onMouseEnter={onPointerEnter}
      onMouseLeave={() => !trailerOpen && onPointerLeave()}
      style={{ top: pos.top, left: pos.left, width: pos.width, transformOrigin: `${pos.origin} center`, "--preview-from": pos.from }}
      className="absolute z-[60] overflow-hidden rounded-md bg-mm-surface shadow-[0_12px_40px_rgba(0,0,0,0.75)] ring-1 ring-white/10 motion-safe:animate-[previewIn_220ms_ease-out]"
    >
      {/* Picture, then the muted trailer on top of it */}
      <div className="relative aspect-video overflow-hidden bg-mm-raised">
        <Link to={kind.page(item.id)} tabIndex={-1} className="absolute inset-0 block">
          {picture && <img src={picture} alt="" className="absolute inset-0 size-full object-cover" />}
          {showTrailer && key && (
            <iframe
              ref={iframeRef}
              title={`${item.title} preview`}
              src={`https://www.youtube-nocookie.com/embed/${key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${key}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1`}
              allow="autoplay; encrypted-media"
              // Ask the player to report its state (see the effect above)
              onLoad={(e) => e.currentTarget.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: item.id }), "*")}
              // Scaled up a little to push YouTube's own title bar out of view
              className={`pointer-events-none absolute inset-0 size-full scale-[1.35] border-0 transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
            />
          )}
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-mm-surface to-transparent" />
          <span className="absolute right-14 bottom-2.5 left-3 line-clamp-2 font-display text-lg leading-tight font-extrabold text-mm-ink drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            {item.title}
          </span>
        </Link>
        {videoReady && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full border border-white/50 bg-black/40 text-sm text-mm-ink hover:border-mm-ink"
          >
            {muted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 pt-2 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={play}
            aria-label={key ? `Play ${item.title} trailer` : `Open ${item.title}`}
            title={key ? "Play trailer" : "Open"}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mm-ink text-sm text-mm-bg transition-colors hover:bg-mm-ink/80"
          >
            <FaPlay aria-hidden="true" className="translate-x-px" />
          </button>
          <MyListButton type={type} id={item.id} round />
          <Link
            to={kind.page(item.id)}
            aria-label={`More info about ${item.title}`}
            title="More info"
            className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-white/50 bg-black/40 text-lg text-mm-ink transition-colors hover:border-mm-ink"
          >
            <FiChevronDown aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-mm-ink/90">
          <span className="font-bold text-mm-accent">★ {formatRating(item.rating)}</span>
          {details?.contentRating && (
            <span className="border border-white/40 px-1.5 text-[11px] leading-[18px] text-mm-ink/85">{details.contentRating}</span>
          )}
          {item.year && <span>{item.year}</span>}
          {length && <span>{length}</span>}
          <span className="rounded-[3px] border border-white/40 px-1 text-[10px] leading-[16px] font-semibold text-mm-ink/85">HD</span>
        </div>

        {genres.length > 0 && (
          <p className="text-[13px] text-mm-ink">
            {genres.map((g, i) => (
              <span key={g}>
                {i > 0 && <span aria-hidden="true" className="px-1.5 text-mm-faint">•</span>}
                {g}
              </span>
            ))}
          </p>
        )}
      </div>

      <TrailerModal
        youtubeKey={key}
        title={item.title}
        open={trailerOpen}
        onClose={() => {
          setTrailerOpen(false);
          onPointerLeave();
        }}
      />
    </div>
  );
};

export default PreviewCard;
