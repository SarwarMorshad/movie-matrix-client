import { FiCheck, FiMinus } from "react-icons/fi";
import { FEATURES, formatPrice } from "../../config/plans";

const FeatureValue = ({ value }) =>
  value === true ? (
    <FiCheck aria-label="Included" className="text-lg text-mm-accent" />
  ) : value === false ? (
    <FiMinus aria-label="Not included" className="text-lg text-mm-faint" />
  ) : (
    <span className="font-semibold text-mm-ink">{value}</span>
  );

/**
 * One selectable plan (a radio in the plans group): coloured header band,
 * price for the chosen billing, and the key features.
 */
const PlanCard = ({ plan, billing, selected, current, onSelect }) => {
  const price = plan.price[billing];
  const perMonthOnYearly = billing === "yearly" && price ? formatPrice(price / 12) : null;

  return (
    <label
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-mm-surface transition-[transform,border-color,box-shadow] duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-mm-accent ${
        selected
          ? "border-mm-accent shadow-[0_0_0_1px_var(--color-mm-accent),0_20px_50px_-20px_rgb(255_176_32/0.45)] md:-translate-y-2"
          : "border-mm-border hover:border-mm-field"
      }`}
    >
      <input type="radio" name="plan" value={plan.key} checked={selected} onChange={() => onSelect(plan.key)}
        aria-label={`${plan.name} plan, ${formatPrice(price)}${price ? (billing === "yearly" ? " a year" : " a month") : ""}`}
        className="sr-only"
      />

      {/* Header band */}
      <div className={`relative flex min-h-32 flex-col justify-end gap-1 p-5 ${plan.band}`}>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {plan.popular && (
            <span className="rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase">Most popular</span>
          )}
          <span
            aria-hidden="true"
            className={`flex size-7 items-center justify-center rounded-full border-2 transition-colors ${
              selected ? "border-white bg-white text-black" : "border-current/50"
            }`}
          >
            {selected && <FiCheck className="text-base" />}
          </span>
        </div>
        <h3 className="font-display text-2xl font-extrabold">{plan.name}</h3>
        <p className="text-sm font-medium opacity-80">{plan.tagline}</p>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1 border-b border-mm-border p-5">
        <p className="flex items-baseline gap-1.5">
          <span className="font-display text-4xl font-extrabold text-mm-ink tabular-nums">{formatPrice(price)}</span>
          <span className="text-sm text-mm-muted">{price ? (billing === "yearly" ? "/ year" : "/ month") : "forever"}</span>
        </p>
        <p className="min-h-5 text-xs text-mm-muted">
          {perMonthOnYearly ? `That's ${perMonthOnYearly} a month, billed yearly` : price ? "Cancel anytime" : "No card needed"}
        </p>
        {current && (
          <span className="mt-2 w-fit rounded-[3px] border border-mm-accent px-2 py-0.5 text-[11px] font-bold tracking-wider text-mm-accent uppercase">
            Your current plan
          </span>
        )}
      </div>

      {/* Key features */}
      <dl className="flex flex-1 flex-col divide-y divide-mm-border px-5">
        {FEATURES.filter((f) => f.key).map((f) => (
          <div key={f.label} className="flex items-center justify-between gap-4 py-3 text-sm">
            <dt className="text-mm-muted">{f.label}</dt>
            <dd className="flex shrink-0 justify-end text-right">
              <FeatureValue value={f[plan.key]} />
            </dd>
          </div>
        ))}
      </dl>
    </label>
  );
};

export { FeatureValue };
export default PlanCard;
