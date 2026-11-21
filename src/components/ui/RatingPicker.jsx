/**
 * 1–10 score picker: a row of buttons, everything up to the chosen score lit.
 * <RatingPicker value={score} onChange={setScore} />
 */
const RatingPicker = ({ value, onChange, label = "Your rating" }) => (
  <fieldset className="m-0 border-0 p-0">
    <legend className="mb-2.5 p-0 text-sm font-semibold text-mm-ink">
      {label}: <span className="text-mm-accent">{value ? `${value} / 10` : "pick a score"}</span>
    </legend>
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
        const lit = value >= n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`Rate ${n} out of 10`}
            aria-pressed={value === n}
            className={`size-11 rounded-card border-[1.5px] text-sm font-bold transition-colors ${
              lit
                ? "border-mm-accent bg-mm-accent text-mm-on-accent"
                : "border-mm-field bg-transparent text-mm-ink/85 hover:border-mm-muted"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  </fieldset>
);

export default RatingPicker;
