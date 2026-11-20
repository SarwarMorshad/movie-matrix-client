import { Link } from "react-router";
import { MdLocalMovies } from "react-icons/md";

// Plan teaser under the hero; links to the Plans page
const PlansBanner = () => (
  <section aria-label="Plans" className="mx-auto w-full max-w-[1180px] px-6">
    <div className="flex flex-col items-start gap-5 rounded-xl border border-mm-border bg-mm-surface p-5 sm:flex-row sm:items-center sm:p-6">
      <span
        aria-hidden="true"
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-mm-accent/15 text-3xl text-mm-accent"
      >
        <MdLocalMovies />
      </span>
      <div className="flex-1">
        <p className="font-display text-lg font-extrabold text-mm-ink">Free to join. Go Pro for $9.99 a month.</p>
        <p className="text-sm text-mm-muted">Unlimited collection and watchlist, advanced filters and no ads.</p>
      </div>
      <Link
        to="/plans"
        className="rounded-[4px] bg-mm-raised px-4 py-2.5 text-sm font-semibold text-mm-ink transition-colors hover:bg-mm-field"
      >
        Learn More
      </Link>
    </div>
  </section>
);

export default PlansBanner;
