import EmailSignup from "./EmailSignup";
import PosterWall from "../common/PosterWall";

// Big landing hero: a tilted wall of real posters behind the headline and sign-up form
const LandingHero = ({ posters }) => {
  return (
    <section aria-labelledby="landing-title" className="relative isolate flex min-h-[700px] items-center overflow-hidden bg-black lg:min-h-[780px]">
      <PosterWall posters={posters} />
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
