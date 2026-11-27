import { useEffect, useRef, useState } from "react";

// YouTube shows its own ⏮ ⏸ ⏭ buttons and channel name for ~1.5s when playback starts
// and again whenever the sound changes. So the sound goes on as soon as it plays, while
// the video is still hidden, and the video appears once those buttons have gone.
const HIDE_MS = 1600;

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sends a command to the YouTube player (needs enablejsapi=1)
const ytCommand = (iframe, func, args = []) =>
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");

/**
 * A still picture that turns into the title's trailer on its own, with no controls.
 * It starts muted (browsers require that for autoplay) and turns the sound on as it appears.
 * Browsers allow that once the visitor has clicked / tapped / typed on the page (or on sites
 * they often watch with sound); if the browser refuses and pauses it, it carries on muted,
 * and the visitor's next click or key press turns the sound on. Fills its (relative,
 * overflow-hidden) parent; unmounting it stops the video.
 *
 * <TrailerBackdrop picture={item.backdropUrl} youtubeKey={details?.trailerKey} title={item.title} />
 */
const TrailerBackdrop = ({ picture, youtubeKey, title }) => {
  const iframeRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Start loading the player straight away (the still shows until it plays)
  useEffect(() => {
    setVisible(false);
    setStarted(Boolean(youtubeKey) && !reduceMotion());
  }, [youtubeKey]);

  // Sound on when it starts playing (still hidden), then show it once YouTube's buttons are gone
  useEffect(() => {
    if (!started) return;
    let playingSince = 0;
    let timer;
    let triedSoundAt = 0;
    const soundOn = () => {
      triedSoundAt = Date.now();
      ytCommand(iframeRef.current, "unMute");
      ytCommand(iframeRef.current, "setVolume", [100]);
    };

    const onMessage = (e) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      let info;
      try {
        info = JSON.parse(e.data).info;
      } catch {
        return; // not a YouTube message
      }
      const state = info?.playerState;
      if (state === 1 && !playingSince) {
        playingSince = Date.now();
        soundOn();
        timer = setTimeout(() => setVisible(true), HIDE_MS);
      }
      // The browser paused it because sound isn't allowed yet: keep playing, muted
      if (state === 2 && Date.now() - triedSoundAt < 2000) {
        ytCommand(iframeRef.current, "mute");
        ytCommand(iframeRef.current, "playVideo");
      }
    };

    // The visitor's first click or key press makes sound allowed: turn it on now
    const onInteract = () => soundOn();

    window.addEventListener("message", onMessage);
    document.addEventListener("pointerdown", onInteract, true);
    document.addEventListener("keydown", onInteract, true);
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("pointerdown", onInteract, true);
      document.removeEventListener("keydown", onInteract, true);
      clearTimeout(timer);
    };
  }, [started]);

  return (
    <>
      {picture && <img src={picture} alt="" className="absolute inset-0 size-full object-cover" />}
      {started && (
        <iframe
          ref={iframeRef}
          title={`${title} preview`}
          tabIndex={-1}
          src={`https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1`}
          allow="autoplay; encrypted-media"
          // Ask the player to report its state (handled above)
          onLoad={(e) => e.currentTarget.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: youtubeKey }), "*")}
          // Scaled up a little to push YouTube's title bar out of view
          className={`pointer-events-none absolute inset-0 size-full scale-[1.3] border-0 transition-opacity duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
};

export default TrailerBackdrop;
