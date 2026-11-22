import { useState } from "react";

/**
 * Square member avatar with rounded corners. Falls back to the first letter
 * of the name when there's no photo or it fails to load.
 *
 * <Avatar src={user.photoURL} name={user.displayName} className="size-28 text-5xl" />
 */
const Avatar = ({ src, name, className = "" }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  const showImage = src && failedSrc !== src;

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-card bg-mm-accent font-display font-extrabold text-mm-on-accent ${className}`}
    >
      {showImage ? (
        <img src={src} alt="" referrerPolicy="no-referrer" onError={() => setFailedSrc(src)} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </span>
  );
};

export default Avatar;
