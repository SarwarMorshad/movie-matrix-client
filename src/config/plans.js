// Membership plans: shown on the Plans page and the profile. Payments arrive
// with the Stripe phases; until then every member is on "free" and the
// limits below are not enforced yet.

export const PLAN_ORDER = ["free", "pro", "premium"];

export const PLANS = {
  free: {
    key: "free",
    name: "Free",
    tagline: "Everything you need to start",
    price: { monthly: 0, yearly: 0 },
    // Coloured header band on the plan card
    band: "bg-linear-to-br from-[#3a4352] to-[#1f252f] text-mm-ink",
    perks: ["Browse every movie and series", "My List and reviews", "Watch trailers"],
  },
  pro: {
    key: "pro",
    name: "Pro",
    tagline: "For people who watch a lot",
    price: { monthly: 9.99, yearly: 99.99 },
    band: "bg-linear-to-br from-[#ffc04d] to-[#ff7a2f] text-mm-on-accent",
    popular: true,
    perks: ["Everything in Free", "Unlimited My List", "Kids profiles"],
  },
  premium: {
    key: "premium",
    name: "Premium",
    tagline: "The whole household, all in",
    price: { monthly: 19.99, yearly: 199.99 },
    band: "bg-linear-to-br from-[#ff7a2f] to-[#b5307a] text-white",
    perks: ["Everything in Pro", "Up to 5 profiles", "Early access to new features"],
  },
};

// Rows of the comparison table and the plan cards. A value of true / false
// shows a tick / dash; strings are shown as they are.
export const FEATURES = [
  { label: "Browse movies and TV series", free: true, pro: true, premium: true },
  { label: "Trailers", free: true, pro: true, premium: true },
  { label: "Ratings and reviews", free: true, pro: true, premium: true },
  { label: "My List", free: "Up to 50 titles", pro: "Unlimited", premium: "Unlimited", key: true },
  { label: "Movies you can add", free: "Up to 10", pro: "Unlimited", premium: "Unlimited", key: true },
  { label: "Profiles", free: "1", pro: "2", premium: "5", key: true },
  { label: "Kids profiles", free: false, pro: true, premium: true, key: true },
  { label: "Advanced filters", free: false, pro: true, premium: true },
  { label: "Early access to new features", free: false, pro: false, premium: true },
];

export const planFor = (key) => PLANS[key] ?? PLANS.free;

// 9.99 -> "$9.99", 0 -> "$0"
export const formatPrice = (amount) => (amount ? `$${amount.toFixed(2)}` : "$0");

// Percent saved by paying yearly instead of 12 monthly payments
export const yearlySaving = (plan) =>
  plan.price.monthly ? Math.round((1 - plan.price.yearly / (plan.price.monthly * 12)) * 100) : 0;
