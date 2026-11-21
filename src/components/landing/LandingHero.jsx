import EmailSignup from "./EmailSignup";

// Big landing hero: a tilted wall of real posters behind the headline and sign-up form
const LandingHero = ({ posters }) => {
  // Repeat the posters so the wall is always full, whatever the collection size
  const wall = posters.length ? Array.from({ length: 48 }, (_, i) => posters[i % posters.length]) : [];

  return (
    <section aria-labelledby="landing-title" className="relative isolate flex min-h-[700px] items-center overflow-hidden bg-black lg:min-h-[780px]">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 grid w-[180%] -translate-x-1/2 -translate-y-1/2 -rotate-12 grid-cols-6 gap-3 opacity-70 sm:w-[150%] md:grid-cols-8">
          {wall.map((url, i) => (
            <img key={i} src={url} alt="" loading="lazy" className="aspect-2/3 w-full rounded-md object-cover" />
          ))}
        </div>
      </div>
      {/* Darken the wall so the text reads well */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/60" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.85)_75%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-black/90 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-mm-bg to-transparent" />

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 pt-24 pb-20 text-center">
        <h1
          id="landing-title"
          className="font-display text-4xl leading-[1.1] font-extrabold tracking-tight text-balance text-mm-ink sm:text-5xl lg:text-6xl"
        >
          Every film worth watching, in one place
        </h1>
        <p className="text-lg font-semibold text-mm-ink md:text-xl">
          Discover top rated movies, keep a watchlist and share your reviews.
        </p>
        <EmailSignup />
      </div>
    </section>
  );
};

export default LandingHero;
