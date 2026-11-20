import { FiPlus } from "react-icons/fi";
import EmailSignup from "./EmailSignup";

const FAQS = [
  {
    q: "What is Movie Matrix?",
    a: "Movie Matrix is a place to discover movies, keep a personal watchlist, rate and review films, and add movies you love to a shared collection.",
  },
  {
    q: "How much does Movie Matrix cost?",
    a: "Joining is free. The Pro plan ($9.99 a month) adds an unlimited collection and watchlist, advanced filters and an ad-free experience.",
  },
  {
    q: "Can I add my own movies?",
    a: "Yes. Once you're signed in, use Add a movie to share a film with the community. Only you can edit or delete the movies you add.",
  },
  {
    q: "Do I need an account to browse?",
    a: "No. Anyone can browse movies and read reviews. A free account lets you keep a watchlist, write reviews and add movies.",
  },
];

// Accordion of common questions, then the sign-up form again
const Faq = () => (
  <section aria-labelledby="faq-title" className="mx-auto flex w-full max-w-[1180px] flex-col items-center gap-10 px-6">
    <div className="w-full">
      <h2 id="faq-title" className="mb-4 font-display text-2xl font-extrabold text-mm-ink md:text-[30px]">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-2">
        {FAQS.map(({ q, a }) => (
          <details key={q} className="group bg-mm-surface open:bg-mm-raised">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-lg text-mm-ink hover:bg-mm-raised md:text-2xl [&::-webkit-details-marker]:hidden">
              {q}
              <FiPlus aria-hidden="true" className="shrink-0 text-3xl transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="border-t border-mm-bg px-6 py-6 text-base leading-relaxed text-mm-ink md:text-lg">{a}</p>
          </details>
        ))}
      </div>
    </div>
    <EmailSignup />
  </section>
);

export default Faq;
