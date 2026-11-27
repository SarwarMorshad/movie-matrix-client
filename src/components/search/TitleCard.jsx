import FilmCard from "../film/FilmCard";
import SeriesCard from "../tv/SeriesCard";

// A search result from TMDB: a film or a series card, with series marked as such
const TitleCard = ({ item }) =>
  item.type === "series" ? <SeriesCard series={item} badge="Series" /> : <FilmCard film={item} />;

export default TitleCard;
