import { useState } from "react";
import { Link } from "react-router";
import { formatRating, formatRuntime } from "../../utils/format";

/**
 * Poster tile used in every movie grid:
 * poster, then title + year, then an outlined rating box, runtime and language.
 *
 * <PosterCard movie={movie} />
 * <PosterCard movie={movie} badge="NEW" />
 * <PosterCard movie={movie}><Button size="sm">Remove</Button></PosterCard>   // actions under the card
 */
const PosterCard = ({ movie, badge, to, children }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const { _id, title, releaseYear, rating, duration, language, genre, posterUrl } = movie;
  const showImage = posterUrl && !imageFailed;

  return (
    <div className="flex flex-col gap-2.5">
      <Link to={to ?? `/movies/${_id}`} className="group flex flex-col gap-2.5 focus-visible:outline-none">
        <div className="relative aspect-2/3 overflow-hidden rounded-card bg-mm-raised ring-mm-accent group-focus-visible:ring-2">
          {showImage ? (
            <img
              src={posterUrl}
              alt={`${title} poster`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            // Fallback when there's no poster: the title on a plain tile
            <span className="flex size-full items-end p-3 font-display text-xl leading-tight font-extrabold text-mm-ink/90">
              {title}
            </span>
          )}

          {(badge || genre) && (
            <span
              className={`absolute top-2.5 left-2.5 rounded-[3px] px-1.5 py-0.5 text-[11px] font-bold tracking-wider uppercase ${
                badge ? "bg-mm-accent text-mm-on-accent" : "bg-black/55 text-white"
              }`}
            >
              {badge ?? genre}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-2.5">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-mm-ink group-hover:text-mm-accent">
            {title}
          </h3>
          {releaseYear && <span className="text-[13px] font-semibold text-mm-accent">{releaseYear}</span>}
        </div>
      </Link>

      <div className="flex items-center gap-2.5 text-xs font-semibold text-mm-muted">
        <span className="rounded-[3px] border-[1.5px] border-mm-accent px-1.5 py-px text-mm-ink">
          <span className="sr-only">Rating </span>
          {formatRating(rating)}
        </span>
        <span className="flex-1">{formatRuntime(duration)}</span>
        {language && <span className="tracking-wider uppercase">{language}</span>}
      </div>

      {children}
    </div>
  );
};

export default PosterCard;
