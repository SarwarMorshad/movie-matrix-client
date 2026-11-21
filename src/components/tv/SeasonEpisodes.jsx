import { useEffect, useState } from "react";
import * as api from "../../api/api";
import { Spinner } from "../ui";
import { formatRuntime } from "../../utils/format";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null;

/**
 * "Episodes" section: a season picker and the selected season's episode list.
 * The parent owns the chosen season so it can live in the URL.
 */
const SeasonEpisodes = ({ seriesId, seasons, season, onSeasonChange }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(false);
    api
      .getSeason(seriesId, season)
      .then((s) => !cancelled && setData(s))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [seriesId, season]);

  if (!seasons.length) return null;
  const current = seasons.find((s) => s.number === season);

  return (
    <section aria-labelledby="episodes-title" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="episodes-title" className="font-display text-2xl font-extrabold text-mm-ink">
          Episodes
        </h2>
        {seasons.length > 1 ? (
          <>
            <label htmlFor="season-picker" className="sr-only">
              Season
            </label>
            <select
              id="season-picker"
              value={season}
              onChange={(e) => onSeasonChange(Number(e.target.value))}
              className="h-11 rounded-[4px] border border-mm-field bg-mm-surface px-3 text-base font-semibold text-mm-ink focus:border-mm-ink focus:outline-none"
            >
              {seasons.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.name} ({s.episodeCount} episodes)
                </option>
              ))}
            </select>
          </>
        ) : (
          <p className="text-base font-semibold text-mm-muted">{current?.name}</p>
        )}
      </div>

      {current?.overview && <p className="max-w-3xl text-sm leading-relaxed text-mm-muted">{current.overview}</p>}

      {error ? (
        <p className="rounded-lg border border-mm-border bg-mm-surface p-6 text-mm-muted">Couldn't load this season's episodes.</p>
      ) : !data ? (
        <div className="py-12">
          <Spinner label="Loading episodes" />
        </div>
      ) : (
        <ol className="flex flex-col">
          {data.episodes.map((ep) => (
            <li key={ep.number} className="flex flex-col gap-4 border-b border-mm-border py-5 sm:flex-row sm:items-center sm:gap-6">
              <span aria-hidden="true" className="hidden w-8 shrink-0 text-center font-display text-2xl text-mm-muted sm:block">
                {ep.number}
              </span>
              <div className="aspect-video w-full shrink-0 overflow-hidden rounded-md bg-mm-raised sm:w-44">
                {ep.stillUrl && <img src={ep.stillUrl} alt="" loading="lazy" className="size-full object-cover" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-semibold text-mm-ink">
                    <span className="sm:hidden">{ep.number}. </span>
                    {ep.name}
                  </h3>
                  <p className="text-sm text-mm-muted">
                    {[formatRuntime(ep.runtime), formatDate(ep.airDate)].filter(Boolean).join(" · ")}
                  </p>
                </div>
                {ep.overview && <p className="line-clamp-3 text-sm leading-relaxed text-mm-muted">{ep.overview}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export default SeasonEpisodes;
