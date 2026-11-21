import PosterWall from "../common/PosterWall";
import usePosterUrls from "../../hooks/usePosterUrls";

/**
 * Full-screen frame for the log in / sign up / password pages: the tilted
 * poster wall behind a dark, centred card.
 *
 * <AuthShell title="Sign In">...form...</AuthShell>
 */
const AuthShell = ({ title, subtitle, children }) => {
  const posters = usePosterUrls();

  return (
    <section className="relative isolate flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 pt-24 pb-16 sm:px-6">
      <PosterWall posters={posters} dim="bg-black/70" />
      <div className="w-full max-w-[450px] rounded-md bg-black/75 px-6 py-10 shadow-2xl shadow-black/60 backdrop-blur-sm sm:px-14 sm:py-12">
        {title && <h1 className="font-display text-3xl font-extrabold text-mm-ink">{title}</h1>}
        {subtitle && <p className="mt-2 text-sm leading-relaxed text-mm-muted">{subtitle}</p>}
        <div className={title || subtitle ? "mt-7" : ""}>{children}</div>
      </div>
    </section>
  );
};

export default AuthShell;
