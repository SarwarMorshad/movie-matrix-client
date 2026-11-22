/**
 * Page frame for adding or editing a movie: small heading block, then the form.
 *
 * <MovieFormPage eyebrow="My Collection" title="Add a movie" subtitle="...">...</MovieFormPage>
 */
const MovieFormPage = ({ eyebrow, title, subtitle, children }) => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-10 pb-20 sm:px-8">
    <header className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-[0.2em] text-mm-accent uppercase">{eyebrow}</p>
      <h1 className="font-display text-4xl font-extrabold text-mm-ink">{title}</h1>
      {subtitle && <p className="max-w-2xl text-mm-muted">{subtitle}</p>}
    </header>
    {children}
  </div>
);

export default MovieFormPage;
