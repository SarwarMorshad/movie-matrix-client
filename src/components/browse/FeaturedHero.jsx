import { FiInfo } from "react-icons/fi";
import { Button } from "../ui";
import MyListButton from "../common/MyListButton";
import { formatRating } from "../../utils/format";

/**
 * Big featured title at the top of a catalog page (TV Shows, Movies), on its backdrop.
 *
 * <FeaturedHero item={series} eyebrow="#1 trending series this week" to={`/tv/${series.id}`} listType="series" genreNames={["Drama"]} />
 */
const FeaturedHero = ({ item, eyebrow, to, listType, genreNames = [] }) => {
  if (!item) return null;

  return (
    <section aria-labelledby="featured-title" className="relative isolate flex min-h-[520px] items-end overflow-hidden md:min-h-[640px]">
      {item.backdropUrl && <img src={item.backdropUrl} alt="" className="absolute inset-0 -z-20 size-full object-cover object-top" />}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-mm-bg via-mm-bg/70 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-linear-to-t from-mm-bg to-transparent" />

      <div className="flex max-w-2xl flex-col gap-4 px-4 pt-32 pb-16 sm:px-8 md:pb-24 lg:px-14">
        <p className="font-display text-[13px] font-bold tracking-[0.14em] text-mm-accent uppercase">{eyebrow}</p>
        <h2 id="featured-title" className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-mm-ink md:text-6xl">
          {item.title}
        </h2>
        <div className="flex flex-wrap items-center gap-2.5 text-sm text-mm-ink/85">
          <span className="rounded-[3px] border-[1.5px] border-mm-accent px-2 py-[2px] font-bold text-mm-accent">
            ★ {formatRating(item.rating)}
          </span>
          {item.year && <span>{item.year}</span>}
          {genreNames.length > 0 && (
            <>
              <span aria-hidden="true" className="text-mm-faint">•</span>
              <span>{genreNames.join(" · ")}</span>
            </>
          )}
        </div>
        {item.overview && <p className="line-clamp-3 text-base leading-relaxed text-mm-ink/85 md:text-lg">{item.overview}</p>}
        <div className="flex flex-wrap gap-3 pt-1">
          <Button size="lg" variant="secondary" to={to} icon={<FiInfo />}>
            More info
          </Button>
          {listType && <MyListButton type={listType} id={item.id} variant="secondary" />}
        </div>
      </div>
    </section>
  );
};

export default FeaturedHero;
