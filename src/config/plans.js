// Membership plans shown on the profile. Payments arrive with the Stripe
// phases; until then every member is on "free".
export const PLANS = {
  free: {
    name: "Free",
    perks: ["Browse every movie and series", "My List and reviews", "Watch trailers"],
  },
  pro: {
    name: "Pro",
    perks: ["Everything in Free", "Unlimited My List", "Early access to new features"],
  },
  premium: {
    name: "Premium",
    perks: ["Everything in Pro", "Up to 5 profiles", "Kids profiles"],
  },
};

export const planFor = (key) => PLANS[key] ?? PLANS.free;
