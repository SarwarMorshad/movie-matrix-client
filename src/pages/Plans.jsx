import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FiLock } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import * as api from "../api/api";
import { PLAN_ORDER, PLANS, formatPrice, yearlySaving } from "../config/plans";
import PosterWall from "../components/common/PosterWall";
import usePosterUrls from "../hooks/usePosterUrls";
import { Button } from "../components/ui";
import BillingToggle from "../components/plans/BillingToggle";
import PlanCard from "../components/plans/PlanCard";
import PlanComparison from "../components/plans/PlanComparison";
import PlansFaq from "../components/plans/PlansFaq";

// The button under the cards: what happens next depends on who is looking
const NextStep = ({ user, plan, billing, currentPlan }) => {
  const [notice, setNotice] = useState("");
  useEffect(() => setNotice(""), [plan.key, billing]);

  if (!user) {
    return (
      <Button size="lg" to="/register" state={{ from: { pathname: "/plans" } }} className="w-full sm:w-80">
        {plan.price.monthly ? `Sign up to get ${plan.name}` : "Join free"}
      </Button>
    );
  }
  if (plan.key === currentPlan) {
    return (
      <Button size="lg" variant="secondary" disabled className="w-full sm:w-80">
        You're on {plan.name}
      </Button>
    );
  }
  if (!plan.price.monthly) {
    // Going back to Free happens through billing, which arrives with checkout
    return (
      <p className="text-sm text-mm-muted">Moving back to Free will be possible from your profile once paid plans open.</p>
    );
  }
  return (
    <>
      <Button
        size="lg"
        icon={<FiLock />}
        onClick={() => setNotice(`Secure checkout for ${plan.name} opens soon. You're on Free until then and nothing is charged.`)}
        className="w-full sm:w-80"
      >
        Continue with {plan.name} · {formatPrice(plan.price[billing])}
      </Button>
      {notice && (
        <p role="status" className="max-w-md text-center text-sm text-mm-accent">
          {notice}
        </p>
      )}
    </>
  );
};

const Plans = () => {
  const { user } = useContext(AuthContext);
  const posters = usePosterUrls();
  const [billing, setBilling] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState(user ? "free" : null);
  const [selected, setSelected] = useState("pro");

  useEffect(() => {
    if (!user) return;
    let alive = true;
    api
      .getMe()
      .then((me) => alive && setCurrentPlan(me.plan || "free"))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [user]);

  const plan = PLANS[selected];

  return (
    <>
      <Helmet>
        <title>Plans · Movie Matrix</title>
        <meta name="description" content="Compare Movie Matrix plans: Free, Pro and Premium. Change or cancel anytime." />
      </Helmet>

      {/* Hero */}
      <section aria-labelledby="plans-title" className="relative isolate overflow-hidden">
        <PosterWall posters={posters} dim="bg-black/60" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-mm-bg to-transparent" />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 pt-36 pb-16 text-center lg:pt-44">
          <p className="text-xs font-semibold tracking-[0.25em] text-mm-accent uppercase">Plans</p>
          <h1 id="plans-title" className="font-display text-4xl leading-[1.1] font-extrabold text-balance text-mm-ink sm:text-5xl">
            Pick the plan that fits how you watch
          </h1>
          <p className="text-lg text-mm-muted">Start free. Upgrade, switch or cancel anytime.</p>
          <BillingToggle value={billing} onChange={setBilling} saving={yearlySaving(PLANS.pro)} />
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 sm:px-8">
        {/* Plan cards + next step */}
        <div className="flex flex-col items-center gap-8">
          <fieldset className="grid w-full gap-5 md:grid-cols-3 md:items-start">
            <legend className="sr-only">Choose a plan</legend>
            {PLAN_ORDER.map((key) => (
              <PlanCard
                key={key}
                plan={PLANS[key]}
                billing={billing}
                selected={selected === key}
                current={currentPlan === key}
                onSelect={setSelected}
              />
            ))}
          </fieldset>
          <NextStep user={user} plan={plan} billing={billing} currentPlan={currentPlan} />
          <p className="text-center text-xs text-mm-faint">Prices in US dollars. Plan limits start when paid plans open.</p>
        </div>

        <PlanComparison selected={selected} />
        <PlansFaq />
      </div>
    </>
  );
};

export default Plans;
