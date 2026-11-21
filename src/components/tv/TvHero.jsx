import { FiInfo } from "react-icons/fi";
import { Button } from "../ui";
import { formatRating } from "../../utils/format";

// Big featured series at the top of the TV Shows page, on its backdrop image
const TvHero = ({ series, genreNames = [] }) => {
  if (!series) return null;

  return (
    <section aria-labelledby="tv-hero-title" className="relative isolate flex min-h-[520px] items-end overflow-hidden md:min-h-[640px]">
      {series.backdropUrl && (
        <img src={series.backdropUrl} alt="" className="absolute inset-0 -z-20 size-full object-cover object-top" />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-mm-bg via-mm-bg/70 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-linear-to-t from-mm-bg to-transparent" />

      <div className="flex max-w-2xl flex-col gap-4 px-4 pt-32 pb-16 sm:px-8 md:pb-24 lg:px-14">
        <p className="font-display text-[13px] font-bold tracking-[0.14em] text-mm-accent uppercase">
          #1 trending series this week
        </p>
        <h1 id="tv-hero-title" className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-mm-ink md:text-6xl">
          {series.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2.5 text-sm text-mm-ink/85">
          <span className="rounded-[3px] border-[1.5px] border-mm-accent px-2 py-[2px] font-bold text-mm-accent">
            ★ {formatRating(series.rating)}
          </span>
          {series.year && <span>{series.year}</span>}
          {genreNames.length > 0 && (
            <>
              <span aria-hidden="true" className="text-mm-faint">•</span>
              <span>{genreNames.join(" · ")}</span>
            </>
          )}
        </div>
        {series.overview && <p className="line-clamp-3 text-base leading-relaxed text-mm-ink/85 md:text-lg">{series.overview}</p>}
        <div className="pt-1">
          <Button size="lg" variant="secondary" to={`/tv/${series.id}`} icon={<FiInfo />}>
            More info
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TvHero;
