import { FiBookmark, FiCompass, FiFilm, FiMessageSquare } from "react-icons/fi";

const REASONS = [
  { icon: FiCompass, title: "Discover great films", text: "Browse top rated and newly added movies, or dig into any genre." },
  { icon: FiBookmark, title: "Keep a watchlist", text: "Save movies for later and find them again from any device." },
  { icon: FiMessageSquare, title: "Rate and review", text: "Score movies from 1 to 10 and share what you thought." },
  { icon: FiFilm, title: "Add your favourites", text: "Missing a film? Add it to the collection for everyone." },
];

const Reasons = () => (
  <section aria-labelledby="reasons-title" className="mx-auto w-full max-w-[1180px] px-6">
    <h2 id="reasons-title" className="mb-4 font-display text-2xl font-extrabold text-mm-ink md:text-[30px]">
      More reasons to join
    </h2>
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {REASONS.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex min-h-56 flex-col justify-between gap-6 rounded-xl border border-mm-border bg-mm-surface p-6">
          <div>
            <h3 className="mb-2 font-display text-xl font-extrabold text-mm-ink">{title}</h3>
            <p className="text-sm leading-relaxed text-mm-muted">{text}</p>
          </div>
          <Icon aria-hidden="true" className="self-end text-5xl text-mm-accent" />
        </li>
      ))}
    </ul>
  </section>
);

export default Reasons;
