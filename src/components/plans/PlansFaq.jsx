import { FiPlus } from "react-icons/fi";

const FAQS = [
  {
    q: "Can I change or cancel my plan later?",
    a: "Yes. You can move between plans or go back to Free whenever you like, from your profile. There are no contracts.",
  },
  {
    q: "What happens to my list if I go back to Free?",
    a: "Nothing is deleted. Your list, reviews and the movies you added all stay. You just can't add more beyond the Free limits until you upgrade again.",
  },
  {
    q: "Is it cheaper to pay yearly?",
    a: "Yes. Paying for a year up front costs about two months less than paying monthly.",
  },
  {
    q: "How do I pay?",
    a: "Paid plans use a secure card checkout. It's being set up now; until it opens, every member is on Free and nothing is charged.",
  },
];

// Plan questions, as an accordion matching the landing page FAQ
const PlansFaq = () => (
  <section aria-labelledby="plans-faq-title" className="flex flex-col gap-5">
    <h2 id="plans-faq-title" className="font-display text-2xl font-extrabold text-mm-ink md:text-[30px]">
      Questions about plans
    </h2>
    <div className="flex flex-col gap-2">
      {FAQS.map(({ q, a }) => (
        <details key={q} className="group rounded-card bg-mm-surface open:bg-mm-raised">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base text-mm-ink hover:bg-mm-raised md:text-lg [&::-webkit-details-marker]:hidden">
            {q}
            <FiPlus aria-hidden="true" className="shrink-0 text-2xl transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className="border-t border-mm-bg px-5 py-5 leading-relaxed text-mm-muted">{a}</p>
        </details>
      ))}
    </div>
  </section>
);

export default PlansFaq;
