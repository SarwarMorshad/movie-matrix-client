import { Link } from "react-router";
import TrailerBackdrop from "./TrailerBackdrop";
import useTitleDetails from "../../hooks/useTitleDetails";
import { formatRating, formatRuntime } from "../../utils/format";

const PAGES = { film: (id) => `/film/${id}`, series: (id) => `/tv/${id}` };

// "Drama • 2024 • 2 Seasons • TV-MA"
const metaLine = (item, details) =>
  [
    details?.genres?.[0],
    item.year,
    item.type === "series"
      ? details?.numberOfSeasons && `${details.numberOfSeasons} ${details.numberOfSeasons === 1 ? "Season" : "Seasons"}`
      : formatRuntime(details?.runtime),
    details?.contentRating,
  ].filter(Boolean);

const Pill = ({ children }) => (
  <span className="rounded-[4px] bg-black/70 px-2 py-1 text-[11px] font-semibold text-mm-ink backdrop-blur-sm">{children}</span>
);

/**
 * The tile in a row that is being hovered, grown in place into a wide card
 * (Netflix's current design): backdrop that turns into a muted trailer by itself, white outline,
 * the title's logo and rating, then genre • year • length • age rating and the synopsis.
 * No buttons: the trailer plays while hovered and stops when the tile shrinks back.
 * Clicking it opens the title page. MediaRow sizes it; `leaving` is set while it fades out
 * as the tile shrinks back, which stops the trailer straight away.
 */
const ExpandedTile = ({ item, leaving = false }) => {
  const details = useTitleDetails(item.type, item.id);
  const page = PAGES[item.type](item.id);
  const meta = metaLine(item, details);

  return (
    // Full size from the first frame (MediaRow's <li> reveals it as it widens), and the
    // text below kept within ~58px (a normal tile's title + rating is 61px or more),
    // so the row never changes height
    <div className="flex w-[calc(var(--tile)*8/3)] flex-col gap-2">
      <div className="relative h-[calc(var(--tile)*1.5)] overflow-hidden rounded-lg bg-mm-raised">
        <TrailerBackdrop picture={item.backdropUrl || item.posterUrl} youtubeKey={leaving ? null : details?.trailerKey} title={item.title} />

        {/* The whole card opens the title page */}
        <Link to={page} aria-label={`${item.title}, more info`} className="absolute inset-0" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />

        <div className="pointer-events-none absolute right-3 bottom-3 left-4 flex items-end justify-between gap-3">
          {details?.logoUrl ? (
            <img src={details.logoUrl} alt={item.title} className="max-h-18 max-w-[55%] object-contain object-left-bottom drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" />
          ) : (
            <span className="line-clamp-2 max-w-[60%] font-display text-2xl leading-tight font-extrabold text-mm-ink drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              {item.title}
            </span>
          )}
          <Pill>★ {formatRating(item.rating)}</Pill>
        </div>
        {/* White outline, drawn over the picture so the row's edges can't clip it */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg border-2 border-mm-ink" />
      </div>

      <div className="flex flex-col gap-0.5">
        {meta.length > 0 && (
          <p className="truncate text-[13px] leading-[18px] font-semibold text-mm-ink">
            {meta.map((part, i) => (
              <span key={part}>
                {i > 0 && <span aria-hidden="true" className="px-1.5 text-mm-muted">•</span>}
                {part}
              </span>
            ))}
          </p>
        )}
        {item.overview && <p className="line-clamp-2 text-xs leading-[15px] text-mm-ink/80">{item.overview}</p>}
      </div>
    </div>
  );
};

export default ExpandedTile;
