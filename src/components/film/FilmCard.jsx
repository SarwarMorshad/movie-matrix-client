import PosterCard from "../ui/PosterCard";
import HoverPreview from "../preview/HoverPreview";

// A TMDB film shown with the shared PosterCard, linking to its film page, with the hover preview
const FilmCard = ({ film, badge }) => (
  <HoverPreview item={film} type="film">
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
  </HoverPreview>
);

export default FilmCard;
