import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FiCheck, FiPlus } from "react-icons/fi";
import * as api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../ui";

/**
 * "+ My List" / "✓ In My List" toggle for a movie (MongoDB id) or a series (TMDB id).
 * Logged-out users are sent to log in and brought back afterwards.
 *
 * <MyListButton type="movie" id={movie._id} />
 * <MyListButton type="series" id={series.id} />
 */
const MyListButton = ({ type, id, size = "lg" }) => {
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
        await (type === "movie" ? api.removeFromWatchlist(id) : api.removeSeriesFromList(id));
        setInList(false);
        toast.success("Removed from My List");
      } else {
        await (type === "movie" ? api.addToWatchlist(id) : api.addSeriesToList(id));
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
      variant={inList ? "secondary" : "primary"}
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
