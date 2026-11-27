import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FiCheck, FiPlus } from "react-icons/fi";
import * as api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Button from "../ui/Button";

// How to add / remove each kind of title
const ACTIONS = {
  movie: { add: api.addToWatchlist, remove: api.removeFromWatchlist }, // a member's movie (MongoDB id)
  series: { add: api.addSeriesToList, remove: api.removeSeriesFromList }, // TMDB series id
  film: { add: api.addFilmToList, remove: api.removeFilmFromList }, // TMDB movie id
};

/**
 * "+ My List" / "✓ In My List" toggle for a movie (MongoDB id), a series or a film (TMDB ids).
 * Logged-out users are sent to log in and brought back afterwards.
 *
 * <MyListButton type="movie" id={movie._id} />
 * <MyListButton type="series" id={series.id} />
 * <MyListButton type="film" id={film.id} />
 */
const MyListButton = ({ type, id, size = "lg", variant }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [inList, setInList] = useState(false);
  const [busy, setBusy] = useState(false);

  // Is it already on the list?
  useEffect(() => {
    if (!user) return setInList(false);
    let cancelled = false;
    api
      .getMyList()
      .then(({ items }) => {
        if (!cancelled) setInList(items.some((item) => item.type === type && String(item.type === "movie" ? item._id : item.id) === String(id)));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user, type, id]);

  const toggle = async () => {
    if (!user) return navigate("/login", { state: { from: location } });
    setBusy(true);
    try {
      if (inList) {
        await ACTIONS[type].remove(id);
        setInList(false);
        toast.success("Removed from My List");
      } else {
        await ACTIONS[type].add(id);
        setInList(true);
        toast.success("Added to My List");
      }
    } catch (error) {
      if (error.response?.status === 409) setInList(true);
      else toast.error("Couldn't update My List");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      size={size}
      uppercase
      variant={inList ? "secondary" : (variant ?? "primary")}
      onClick={toggle}
      disabled={busy}
      aria-pressed={inList}
      icon={inList ? <FiCheck /> : <FiPlus />}
    >
      {inList ? "In My List" : "My List"}
    </Button>
  );
};

export default MyListButton;
