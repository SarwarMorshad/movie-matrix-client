import { useEffect, useState } from "react";
import * as api from "../api/api";

// Full details of a TMDB film or series (trailer, logo, runtime, genres…),
// fetched once per title and shared by every component that asks.
const LOADERS = { film: api.getFilm, series: api.getSeries };
const cache = new Map();

const load = (type, id) => {
  const key = `${type}-${id}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      LOADERS[type](id).catch((err) => {
        cache.delete(key); // let a later hover try again
        throw err;
      })
    );
  }
  return cache.get(key);
};

/**
 * const details = useTitleDetails("film", 1003596);   // null until loaded
 */
const useTitleDetails = (type, id) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!LOADERS[type] || !id) return;
    let cancelled = false;
    setDetails(null);
    load(type, id)
      .then((d) => !cancelled && setDetails(d))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [type, id]);

  return details;
};

export default useTitleDetails;
