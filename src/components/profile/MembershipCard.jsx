import { FiCheck } from "react-icons/fi";
import { planFor } from "../../config/plans";
import { Button } from "../ui";

/**
 * The member's current plan with what it includes, and a way to see the
 * other plans. Real payments come with the Stripe phases.
 */
const MembershipCard = ({ planKey }) => {
  const plan = planFor(planKey);
  const isTop = planKey === "premium";

  return (
    <section aria-labelledby="membership-title" className="relative overflow-hidden rounded-card border border-mm-border bg-mm-surface p-6 sm:p-7">
      {/* Soft accent glow in the corner */}
      <div aria-hidden="true" className="absolute -top-20 -right-20 size-56 rounded-full bg-mm-accent/15 blur-3xl" />

      <p className="text-xs font-semibold tracking-[0.2em] text-mm-accent uppercase">Membership</p>
      <h2 id="membership-title" className="mt-1 font-display text-2xl font-extrabold text-mm-ink">
        {plan.name} plan
      </h2>
      <ul className="mt-4 flex flex-col gap-2 text-sm text-mm-muted">
        {plan.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2">
            <FiCheck aria-hidden="true" className="text-mm-accent" /> {perk}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button to="/plans">{isTop ? "View plans" : "Upgrade plan"}</Button>
      </div>
    </section>
  );
};

export default MembershipCard;
