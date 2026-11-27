import { useEffect, useRef, useState } from "react";

const SETTLE = 500; // ms of playback kept hidden, so YouTube's own start-up buttons are gone

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

  // Show the video only once YouTube reports it is playing (plus a little), then try sound
  useEffect(() => {
    if (!started) return;
    let timer;
    let triedSoundAt = 0;
    const soundOn = () => {
      triedSoundAt = Date.now();
      ytCommand(iframeRef.current, "unMute");
      ytCommand(iframeRef.current, "setVolume", [100]);
    };

    const onMessage = (e) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      let state;
      try {
        state = JSON.parse(e.data).info?.playerState;
      } catch {
        return; // not a YouTube message
      }
      if (state === 1 && !timer) {
        timer = setTimeout(() => {
          soundOn();
          setVisible(true);
        }, SETTLE);
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
    </>
  );
};

export default TrailerBackdrop;
