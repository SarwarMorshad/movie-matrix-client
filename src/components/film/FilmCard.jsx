import PosterCard from "../ui/PosterCard";

// A TMDB film shown with the shared PosterCard, linking to its film page
const FilmCard = ({ film, badge }) => (
  <PosterCard
    to={`/film/${film.id}`}
    badge={badge}
    movie={{
      _id: film.id,
      title: film.title,
      releaseYear: film.year,
      rating: film.rating,
      language: film.language,
      posterUrl: film.posterUrl,
    }}
  />
);

export default FilmCard;
