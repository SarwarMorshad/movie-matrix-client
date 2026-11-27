import PosterCard from "../ui/PosterCard";

// A TV series shown with the shared PosterCard, linking to its series page
const SeriesCard = ({ series, badge }) => (
  <PosterCard
    to={`/tv/${series.id}`}
    badge={badge}
    movie={{
      _id: series.id,
      title: series.title,
      releaseYear: series.year,
      rating: series.rating,
      language: series.language,
      posterUrl: series.posterUrl,
    }}
  />
);

export default SeriesCard;
