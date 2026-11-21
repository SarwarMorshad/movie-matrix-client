import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

/**
 * Full-screen YouTube trailer in a native <dialog> (Escape and the ✕ close it,
 * focus is trapped while open). The video only loads while the dialog is open.
 *
 * <TrailerModal youtubeKey={series.trailerKey} title={series.title} open={open} onClose={() => setOpen(false)} />
 */
const TrailerModal = ({ youtubeKey, title, open, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()} // click on the backdrop
      aria-label={`${title} trailer`}
      className="m-auto w-[min(92vw,1100px)] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/85"
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close trailer"
          className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
        >
          <FiX aria-hidden="true" />
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
          {open && youtubeKey && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=1&rel=0`}
              title={`${title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="size-full"
            />
          )}
        </div>
      </div>
    </dialog>
  );
};

export default TrailerModal;
