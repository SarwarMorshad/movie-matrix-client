import { useEffect, useState } from "react";
import * as api from "../api/api";

// Full details of a TMDB film or series (trailer, logo, runtime, genres…),
// fetched once per title and shared by every component that asks.
const LOADERS = { film: api.getFilm, series: api.getSeries };
const cache = new Map(); // key -> promise
const loaded = new Map(); // key -> details, once the promise has resolved

const keyOf = (type, id) => `${type}-${id}`;

const load = (type, id) => {
  const key = keyOf(type, id);
  if (!cache.has(key)) {
    cache.set(
      key,
      LOADERS[type](id)
        .then((details) => {
          loaded.set(key, details);
          return details;
        })
        .catch((err) => {
          cache.delete(key); // let a later hover try again
          throw err;
        })
    );
  }
  return cache.get(key);
};

// Start fetching a title's details early (e.g. as soon as the mouse lands on its tile)
export const prefetchTitleDetails = (type, id) => {
  if (LOADERS[type] && id) load(type, id).catch(() => {});
};

/**
 * const details = useTitleDetails("film", 1003596);   // null until loaded
 */
const useTitleDetails = (type, id) => {
  // Already fetched? Then it's there on the very first render
  const [details, setDetails] = useState(() => loaded.get(keyOf(type, id)) ?? null);

  useEffect(() => {
    if (!LOADERS[type] || !id) return;
    let cancelled = false;
    setDetails(loaded.get(keyOf(type, id)) ?? null);
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
