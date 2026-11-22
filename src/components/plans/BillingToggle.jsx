// Monthly / Yearly switch for the Plans page
const BillingToggle = ({ value, onChange, saving }) => {
  const options = [
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ];

  return (
    <div role="radiogroup" aria-label="Billing" className="inline-flex rounded-full border border-white/15 bg-black/50 p-1 backdrop-blur-sm">
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.key)}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              active ? "bg-mm-ink text-mm-bg" : "text-mm-muted hover:text-mm-ink"
            }`}
          >
            {o.label}
            {o.key === "yearly" && saving > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${active ? "bg-mm-accent text-mm-on-accent" : "bg-mm-accent/20 text-mm-accent"}`}>
                Save {saving}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BillingToggle;
