import { useEffect, useState } from "react";
import * as api from "../api/api";

// Poster URLs for decorative backgrounds, loaded once and shared by every page
let cached = null;
let pending = null;

const usePosterUrls = () => {
  const [posters, setPosters] = useState(cached ?? []);

  useEffect(() => {
    if (cached) return;
    pending ??= api
      .getMovies()
      .then((movies) => (cached = movies.map((m) => m.posterUrl).filter(Boolean)))
      .catch(() => {
        pending = null; // try again next time
        return [];
      });
    let alive = true;
    pending.then((urls) => alive && setPosters(urls));
    return () => {
      alive = false;
    };
  }, []);

  return posters;
};

export default usePosterUrls;
