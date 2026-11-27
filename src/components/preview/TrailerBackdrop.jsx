import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

const START_DELAY = 900; // ms on the still picture before the trailer starts
const SETTLE = 1500; // ms of playback hidden, so YouTube's own start-up buttons are gone

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sends a command to the YouTube player (needs enablejsapi=1)
const ytCommand = (iframe, func) =>
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");

/**
 * A still picture that turns into the title's muted trailer, with a sound toggle.
 * Fills its (relative, overflow-hidden) parent. `ref.current.pause()` pauses the video.
 *
 * <TrailerBackdrop picture={item.backdropUrl} youtubeKey={details?.trailerKey} title={item.title} />
 */
const TrailerBackdrop = forwardRef(({ picture, youtubeKey, title }, ref) => {
  const iframeRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);

  useImperativeHandle(ref, () => ({ pause: () => ytCommand(iframeRef.current, "pauseVideo") }), []);

  // Start after a moment on the still
  useEffect(() => {
    setStarted(false);
    setVisible(false);
    if (!youtubeKey || reduceMotion()) return;
    const timer = setTimeout(() => setStarted(true), START_DELAY);
    return () => clearTimeout(timer);
  }, [youtubeKey]);

  // Show the video only once YouTube reports it is playing, plus a little
  useEffect(() => {
    if (!started) return;
    let timer;
    const onMessage = (e) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        if (JSON.parse(e.data).info?.playerState === 1 && !timer) timer = setTimeout(() => setVisible(true), SETTLE);
      } catch {
        // not a YouTube message
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
    };
  }, [started]);

  const toggleMute = (e) => {
    e.preventDefault();
    ytCommand(iframeRef.current, muted ? "unMute" : "mute");
    setMuted(!muted);
  };

  return (
    <>
      {picture && <img src={picture} alt="" className="absolute inset-0 size-full object-cover" />}
      {started && (
        <iframe
          ref={iframeRef}
          title={`${title} preview`}
          tabIndex={-1}
          src={`https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeKey}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1`}
          allow="autoplay; encrypted-media"
          // Ask the player to report its state (handled above)
          onLoad={(e) => e.currentTarget.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: youtubeKey }), "*")}
          // Scaled up a little to push YouTube's title bar out of view
          className={`pointer-events-none absolute inset-0 size-full scale-[1.3] border-0 transition-opacity duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {visible && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full border border-white/50 bg-black/40 text-sm text-mm-ink hover:border-mm-ink"
        >
          {muted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
        </button>
      )}
    </>
  );
});

TrailerBackdrop.displayName = "TrailerBackdrop";

export default TrailerBackdrop;
