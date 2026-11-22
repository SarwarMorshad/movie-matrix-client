import { FEATURES, PLAN_ORDER, PLANS } from "../../config/plans";
import { FeatureValue } from "./PlanCard";

// Full feature-by-plan table; the selected plan's column is highlighted
const PlanComparison = ({ selected }) => (
  <section aria-labelledby="compare-title" className="flex flex-col gap-5">
    <h2 id="compare-title" className="font-display text-2xl font-extrabold text-mm-ink md:text-[30px]">
      Compare plans
    </h2>
    <div className="overflow-x-auto rounded-xl border border-mm-border bg-mm-surface">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-mm-border">
            <th scope="col" className="p-4 text-left font-medium text-mm-muted">
              Feature
            </th>
            {PLAN_ORDER.map((key) => (
              <th
                key={key}
                scope="col"
                className={`w-32 p-4 text-center font-display text-base font-extrabold ${
                  selected === key ? "bg-mm-accent/10 text-mm-accent" : "text-mm-ink"
                }`}
              >
                {PLANS[key].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-mm-border">
          {FEATURES.map((f) => (
            <tr key={f.label}>
              <th scope="row" className="p-4 text-left font-normal text-mm-ink">
                {f.label}
              </th>
              {PLAN_ORDER.map((key) => (
                <td key={key} className={`p-4 text-center ${selected === key ? "bg-mm-accent/10" : ""}`}>
                  <span className="inline-flex justify-center">
                    <FeatureValue value={f[key]} />
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default PlanComparison;
