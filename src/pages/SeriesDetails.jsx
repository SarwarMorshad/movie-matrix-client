import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { FaPlay } from "react-icons/fa";
import * as api from "../api/api";
import { Button, MediaRow, Spinner, TrailerModal } from "../components/ui";
import SeriesCard from "../components/tv/SeriesCard";
import SeasonEpisodes from "../components/tv/SeasonEpisodes";
import CastRow from "../components/tv/CastRow";
import MyListButton from "../components/common/MyListButton";
import { formatRating, formatRuntime } from "../utils/format";

const Fact = ({ label, children }) =>
  children ? (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <dt className="shrink-0 text-mm-muted">{label}:</dt>
      <dd className="text-mm-ink">{children}</dd>
    </div>
  ) : null;

const SeriesDetails = () => {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [series, setSeries] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notFound | error
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    api
      .getSeries(id)
      .then((data) => {
        if (cancelled) return;
        setSeries(data);
        setStatus("ready");
      })
      .catch((error) => !cancelled && setStatus(error.response?.status === 404 ? "notFound" : "error"));
    window.scrollTo({ top: 0 });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") return <Spinner fullPage label="Loading series" />;
  if (status !== "ready") {
    return (
      <div className="flex flex-col items-center gap-3 px-6 pt-40 pb-24 text-center">
        <p className="font-display text-2xl font-extrabold text-mm-ink">
          {status === "notFound" ? "We couldn't find that series" : "Couldn't load this series"}
        </p>
        <p className="text-mm-muted">
          {status === "notFound" ? "It may have been removed." : "Please check your connection and try again."}
        </p>
        <Button className="mt-2" to="/tv">
          Browse TV shows
        </Button>
      </div>
    );
  }

  const seasonNumbers = series.seasons.map((s) => s.number);
  const requested = Number(params.get("season"));
  const season = seasonNumbers.includes(requested) ? requested : seasonNumbers[0];
  const changeSeason = (n) => setParams(n === seasonNumbers[0] ? {} : { season: String(n) }, { replace: true });

  const facts = [
    series.numberOfSeasons && `${series.numberOfSeasons} Season${series.numberOfSeasons > 1 ? "s" : ""}`,
    series.episodeRuntime && `${formatRuntime(series.episodeRuntime)} episodes`,
  ].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{series.title} · TV series · Movie Matrix</title>
        <meta name="description" content={series.overview?.slice(0, 160) || `${series.title} on Movie Matrix`} />
      </Helmet>

      {/* Hero on the backdrop */}
      <section aria-labelledby="series-title" className="relative isolate flex min-h-[560px] items-end overflow-hidden md:min-h-[680px]">
        {series.backdropUrl && (
          <img src={series.backdropUrl} alt="" className="absolute inset-0 -z-20 size-full object-cover object-top" />
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-mm-bg via-mm-bg/75 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-linear-to-t from-mm-bg to-transparent" />

        <div className="flex w-full max-w-3xl flex-col gap-4 px-4 pt-32 pb-12 sm:px-8 lg:px-14">
          <p className="text-sm text-mm-muted">
            <Link to="/tv" className="hover:text-mm-ink hover:underline">
              TV Shows
            </Link>
            {series.genres[0] && <> › {series.genres[0]}</>}
          </p>
          <h1 id="series-title" className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-mm-ink md:text-6xl">
            {series.title}
          </h1>
          {series.tagline && <p className="text-lg text-mm-ink/80 italic">{series.tagline}</p>}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mm-ink/85">
            <span className="rounded-[3px] border-[1.5px] border-mm-accent px-2 py-[2px] font-bold text-mm-accent">
              ★ {formatRating(series.rating)}
            </span>
            {series.year && <span>{series.year}</span>}
            {series.contentRating && (
              <span className="rounded-[3px] border border-mm-muted px-1.5 text-xs font-semibold text-mm-ink">
                {series.contentRating}
              </span>
            )}
            {facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>

          {series.overview && <p className="max-w-2xl text-base leading-relaxed text-mm-ink/90 md:text-lg">{series.overview}</p>}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {series.trailerKey && (
              <Button size="lg" variant="light" onClick={() => setTrailerOpen(true)} icon={<FaPlay className="text-xs" />}>
                Play trailer
              </Button>
            )}
            <MyListButton type="series" id={series.id} />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-14 px-4 pb-20 sm:px-8 lg:px-14">
        {/* Episodes + facts side by side on large screens */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <SeasonEpisodes seriesId={series.id} seasons={series.seasons} season={season} onSeasonChange={changeSeason} />
          </div>
          <aside aria-labelledby="about-title" className="w-full shrink-0 rounded-lg border border-mm-border bg-mm-surface p-6 lg:sticky lg:top-24 lg:w-80">
            <h2 id="about-title" className="mb-4 font-display text-lg font-extrabold text-mm-ink">
              About {series.title}
            </h2>
            <dl className="flex flex-col gap-2.5 text-sm">
              <Fact label="Created by">{series.createdBy.join(", ")}</Fact>
              <Fact label="Starring">{series.cast.slice(0, 4).map((c) => c.name).join(", ")}</Fact>
              <Fact label="Genres">{series.genres.join(", ")}</Fact>
              <Fact label="Network">{series.networks.join(", ")}</Fact>
              <Fact label="Status">{series.status}</Fact>
              <Fact label="Episodes">
                {series.numberOfEpisodes && `${series.numberOfEpisodes} in ${series.numberOfSeasons} season${series.numberOfSeasons > 1 ? "s" : ""}`}
              </Fact>
              <Fact label="Rated">{series.contentRating}</Fact>
              <Fact label="Votes">{series.voteCount?.toLocaleString()}</Fact>
            </dl>
          </aside>
        </div>

        <CastRow cast={series.cast} />
      </div>

      <div className="pb-20">
        <MediaRow id="more-like-this" title="More Like This" items={series.similar} renderItem={(s) => <SeriesCard series={s} />} />
      </div>

      <p className="px-4 pb-10 text-xs text-mm-faint sm:px-8 lg:px-14">TV data and images from TMDB.</p>

      {series.trailerKey && (
        <TrailerModal youtubeKey={series.trailerKey} title={series.title} open={trailerOpen} onClose={() => setTrailerOpen(false)} />
      )}
    </>
  );
};

export default SeriesDetails;
