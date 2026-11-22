/**
 * Decorative, tilted wall of movie posters used behind the landing hero and
 * the auth pages. Place it inside a `relative isolate overflow-hidden` box;
 * it fills that box and sits behind the content (with its darkening layers).
 *
 * <PosterWall posters={["https://...jpg", ...]} />
 */
const PosterWall = ({ posters, dim = "bg-black/60" }) => {
  // Repeat the posters so the wall is always full, whatever the collection size
  const wall = posters.length ? Array.from({ length: 48 }, (_, i) => posters[i % posters.length]) : [];

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden bg-black">
        <div className="absolute top-1/2 left-1/2 grid w-[180%] -translate-x-1/2 -translate-y-1/2 -rotate-12 grid-cols-6 gap-3 opacity-70 sm:w-[150%] md:grid-cols-8">
          {wall.map((url, i) => (
            <img key={i} src={url} alt="" loading="lazy" className="aspect-2/3 w-full rounded-md object-cover" />
          ))}
        </div>
      </div>
      {/* Darken the wall so text on top reads well */}
      <div aria-hidden="true" className={`absolute inset-0 -z-10 ${dim}`} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.85)_75%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-black/90 to-transparent" />
    </>
  );
};

export default PosterWall;
