import { useEffect, useState } from "react";
import * as api from "../api/api";

// One trending series backdrop for the auth pages' picture panel. Picked once
// per visit, so moving between Sign in and Sign up keeps the same picture.
let chosen = null;
let pending = null;

const useAuthBackdrop = () => {
  const [backdrop, setBackdrop] = useState(chosen);

  useEffect(() => {
    if (chosen) return;
    pending ??= api
      .getTvList("trending")
      .then(({ results }) => {
        const withImage = results.filter((s) => s.backdropUrl);
        chosen = withImage[Math.floor(Math.random() * Math.min(withImage.length, 8))] || null;
        return chosen;
      })
      .catch(() => {
        pending = null; // try again next time
        return null;
      });
    let alive = true;
    pending.then((series) => alive && setBackdrop(series));
    return () => {
      alive = false;
    };
  }, []);

  return backdrop; // { title, backdropUrl, ... } or null while loading
};

export default useAuthBackdrop;
