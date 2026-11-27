import PosterCard from "../ui/PosterCard";
import HoverPreview from "../preview/HoverPreview";

// A TV series shown with the shared PosterCard, linking to its series page, with the hover preview
const SeriesCard = ({ series, badge }) => (
  <HoverPreview item={series} type="series">
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
  </HoverPreview>
);

export default SeriesCard;
