import { useState } from "react";
import { FiCheck, FiX, FiStar, FiZap, FiAward } from "react-icons/fi";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { MdMovie } from "react-icons/md";

const SubscriptionPlans = () => {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or yearly

  const plans = [
    {
      name: "Free",
      icon: <MdMovie className="text-4xl" />,
      price: {
        monthly: 0,
        yearly: 0,
      },
      description: "Perfect for casual movie lovers",
      features: [
        { text: "Browse unlimited movies", included: true },
        { text: "Add up to 10 movies to collection", included: true },
        { text: "Basic watchlist (10 movies)", included: true },
        { text: "Write reviews", included: true },
        { text: "Community access", included: true },
        { text: "Advanced filters", included: false },
        { text: "Unlimited collection", included: false },
        { text: "Priority support", included: false },
        { text: "Ad-free experience", included: false },
      ],
      color: "from-gray-500 to-gray-700",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/20",
      buttonText: "Current Plan",
      buttonStyle: "btn-outline",
      popular: false,
    },
    {
      name: "Pro",
      icon: <FiZap className="text-4xl" />,
      price: {
        monthly: 9.99,
        yearly: 99.99,
      },
      description: "For dedicated movie enthusiasts",
      features: [
        { text: "Everything in Free", included: true },
        { text: "Unlimited movie collection", included: true },
        { text: "Unlimited watchlist", included: true },
        { text: "Advanced filters & search", included: true },
        { text: "Personalized recommendations", included: true },
        { text: "Ad-free experience", included: true },
        { text: "Priority support", included: true },
        { text: "Export your data", included: true },
        { text: "Early access to features", included: false },
      ],
      color: "from-primary to-secondary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      buttonText: "Upgrade to Pro",
      buttonStyle: "bg-gradient-to-r from-primary to-secondary hover:from-red-700 hover:to-yellow-600",
      popular: true,
    },
    {
      name: "Premium",
      icon: <FiAward className="text-4xl" />,
      price: {
        monthly: 19.99,
        yearly: 199.99,
      },
      description: "Ultimate experience for cinephiles",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Exclusive content & articles", included: true },
        { text: "Advanced analytics & insights", included: true },
        { text: "Custom collections & tags", included: true },
        { text: "Collaboration features", included: true },
        { text: "API access", included: true },
        { text: "White-label options", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Early access to features", included: true },
      ],
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      buttonText: "Upgrade to Premium",
      buttonStyle: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      popular: false,
    },
  ];

  const calculateSavings = (monthlyPrice, yearlyPrice) => {
    const yearlyCost = monthlyPrice * 12;
    const savings = yearlyCost - yearlyPrice;
    const percentage = Math.round((savings / yearlyCost) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-movie-darker via-movie-dark to-movie-darker py-20 container mx-auto">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full mb-6 border border-primary/20">
            <HiSparkles className="animate-spin-slow" />
            <span className="font-semibold">Pricing Plans</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">
            Choose Your
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              {" "}
              Perfect Plan
            </span>
          </h1>

          <p className="text-gray-400 text-xl max-w-3xl mx-auto mb-8">
            Unlock the full potential of Movie Matrix with our flexible subscription plans
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-base-200 p-2 rounded-full border border-white/10">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const savings =
              billingCycle === "yearly" ? calculateSavings(plan.price.monthly, plan.price.yearly) : null;

            return (
              <div
                key={index}
                className={`relative bg-base-200 rounded-3xl p-8 border ${
                  plan.borderColor
                } hover:border-opacity-50 transition-all duration-500 animate-fadeIn hover:shadow-2xl ${
                  plan.popular ? "md:scale-105 md:z-10" : ""
                } group`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                      <FiStar className="text-yellow-300" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-20 h-20 rounded-2xl ${plan.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <div className={`bg-gradient-to-br ${plan.color} bg-clip-text text-transparent`}>
                      {plan.icon}
                    </div>
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">
                        ${billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                      </span>
                      <span className="text-gray-400">/{billingCycle === "monthly" ? "month" : "year"}</span>
                    </div>
                    {billingCycle === "yearly" && savings && plan.price.yearly > 0 && (
                      <p className="text-green-400 text-sm mt-2">
                        Save ${savings.amount.toFixed(2)}/year ({savings.percentage}% off)
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`btn ${plan.buttonStyle} text-white border-none w-full mb-8 text-lg hover:scale-105 transition-all duration-300 shadow-lg`}
                  >
                    {plan.buttonText}
                  </button>

                  {/* Features */}
                  <div className="space-y-4">
                    <p className="text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4">
                      What's Included:
                    </p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                            <FiCheck className="text-green-400 text-sm" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-500/20 flex items-center justify-center mt-0.5">
                            <FiX className="text-gray-500 text-sm" />
                          </div>
                        )}
                        <span className={`${feature.included ? "text-gray-300" : "text-gray-500"} text-base`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div className="bg-base-200 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Can I change my plan later?</h3>
              <p className="text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your
                next billing cycle.
              </p>
            </div>

            <div className="bg-base-200 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">
                We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and various
                other payment methods depending on your region.
              </p>
            </div>

            <div className="bg-base-200 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">
                Absolutely! There are no long-term contracts. You can cancel your subscription at any time
                from your account settings.
              </p>
            </div>

            <div className="bg-base-200 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Is there a free trial available?</h3>
              <p className="text-gray-400">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start your
                trial.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl p-12 border border-white/10">
          <HiLightningBolt className="text-6xl text-primary mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-white mb-4">Still have questions?</h3>
          <p className="text-gray-400 text-lg mb-6">Our team is here to help you choose the perfect plan</p>
          <a href="/contact">
            <button className="btn bg-white hover:bg-gray-100 text-black border-none px-8 text-lg">
              Contact Support
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
