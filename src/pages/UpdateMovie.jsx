import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import * as api from "../api/api";
import { Button, Spinner } from "../components/ui";
import MovieForm from "../components/movie/MovieForm";
import MovieFormPage from "../components/movie/MovieFormPage";

// Edit a movie the member added (admins can edit any)
const UpdateMovie = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | forbidden | missing

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const found = await api.getMovie(id);
        let allowed = found.addedBy === user.email;
        if (!allowed) allowed = (await api.getMe().catch(() => ({}))).role === "admin";
        if (!alive) return;
        setMovie(found);
        setState(allowed ? "ready" : "forbidden");
      } catch {
        if (alive) setState("missing");
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [id, user.email]);

  const save = async (changes) => {
    await api.updateMovie(id, changes);
    toast.success("Changes saved");
    navigate(`/movies/${id}`);
  };

  if (state === "loading") return <Spinner fullPage />;

  if (state !== "ready") {
    return (
      <MovieFormPage
        eyebrow="Edit movie"
        title={state === "forbidden" ? "You can't edit this movie" : "Movie not found"}
        subtitle={
          state === "forbidden"
            ? "Only the member who added a movie can change it."
            : "It may have been deleted, or the link is wrong."
        }
      >
        <Button to={state === "forbidden" ? `/movies/${id}` : "/movies"} className="w-fit">
          {state === "forbidden" ? "Back to the movie" : "Browse movies"}
        </Button>
      </MovieFormPage>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Edit ${movie.title} · Movie Matrix`}</title>
      </Helmet>
      <MovieFormPage eyebrow="Edit movie" title={movie.title} subtitle="Update the details below. The preview shows how the card will look.">
        <MovieForm initial={movie} submitLabel="Save changes" onSubmit={save} onCancel={() => navigate(`/movies/${id}`)} />
      </MovieFormPage>
    </>
  );
};

export default UpdateMovie;
