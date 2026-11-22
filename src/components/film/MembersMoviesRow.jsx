import { useEffect, useState } from "react";
import * as api from "../../api/api";
import { MediaRow, PosterCard } from "../ui";

// Row of the community's own movies (MongoDB), with a link to the full members' catalog
const MembersMoviesRow = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api.getTopRatedMovies(20).then(setMovies).catch(() => {});
  }, []);

  return (
    <MediaRow
      id="row-members"
      title="From our members"
      items={movies}
      renderItem={(movie) => <PosterCard movie={movie} />}
      getKey={(movie) => movie._id}
      action={{ label: "See all", to: "/movies/community" }}
    />
  );
};

export default MembersMoviesRow;
