// Horizontal list of cast members with round photos
const CastRow = ({ cast }) => {
  if (!cast?.length) return null;

  return (
    <section aria-labelledby="cast-title" className="flex flex-col gap-4">
      <h2 id="cast-title" className="font-display text-2xl font-extrabold text-mm-ink">
        Cast
      </h2>
      <ul className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {cast.map((person) => (
          <li key={`${person.name}-${person.character}`} className="flex w-28 shrink-0 flex-col items-center gap-2 text-center">
            <span className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-mm-raised font-display text-2xl font-extrabold text-mm-muted">
              {person.photoUrl ? (
                <img src={person.photoUrl} alt="" loading="lazy" className="size-full object-cover" />
              ) : (
                person.name.charAt(0)
              )}
            </span>
            <span className="text-sm font-semibold text-mm-ink">{person.name}</span>
            {person.character && <span className="line-clamp-2 text-xs text-mm-muted">{person.character}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CastRow;
