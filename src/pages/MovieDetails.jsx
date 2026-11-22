import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import * as api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Button, ConfirmDialog, PosterCard, SectionHeader, Spinner } from "../components/ui";
import MovieReviews from "../components/movie/MovieReviews";
import MyListButton from "../components/common/MyListButton";
import { formatRating, formatRuntime } from "../utils/format";

const Fact = ({ label, children }) =>
  children ? (
    <>
      <dt className="text-mm-muted">{label}</dt>
      <dd className="m-0 font-semibold text-mm-ink">{children}</dd>
    </>
  ) : null;

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notFound | error
  const [similar, setSimilar] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadMovie = useCallback(
    () =>
      api.getMovie(id).then((data) => {
        setMovie(data);
        setStatus("ready");
        return data;
      }),
    [id]
  );

  // The movie, then "You may also like" from the same genre
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setSimilar([]);
    window.scrollTo({ top: 0 });
    loadMovie()
      .then((data) => api.browseMovies({ genre: data.genre, limit: 6 }))
      .then((res) => !cancelled && setSimilar(res.movies.filter((m) => m._id !== id).slice(0, 5)))
      .catch((error) => {
        if (cancelled) return;
        if (error.response?.status === 404 || error.response?.status === 400) setStatus("notFound");
        else setStatus((s) => (s === "ready" ? s : "error"));
      });
    return () => {
      cancelled = true;
    };
  }, [id, loadMovie]);

  const deleteMovie = async () => {
    setDeleting(true);
    try {
      await api.deleteMovie(id);
      toast.success(`${movie.title} deleted`);
      navigate("/movies", { replace: true });
    } catch {
      toast.error("Couldn't delete this movie");
      setDeleting(false);
    }
  };

  if (status === "loading") return <Spinner fullPage label="Loading movie" />;
  if (status !== "ready") {
    return (
      <div className="flex flex-col items-center gap-3 px-6 pt-40 pb-24 text-center">
        <p className="font-display text-2xl font-extrabold text-mm-ink">
          {status === "notFound" ? "We couldn't find that movie" : "Couldn't load this movie"}
        </p>
        <p className="text-mm-muted">
          {status === "notFound" ? "It may have been deleted." : "Please check your connection and try again."}
        </p>
        <Button className="mt-2" to="/movies">
          Browse movies
        </Button>
      </div>
    );
  }

  const isOwner = user && movie.addedBy && user.email?.toLowerCase() === movie.addedBy.toLowerCase();
  const meta = [movie.releaseYear, movie.genre, formatRuntime(movie.duration), movie.country].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{movie.title} · Movie Matrix</title>
        <meta name="description" content={movie.plotSummary?.slice(0, 160) || `${movie.title} on Movie Matrix`} />
      </Helmet>

      {/* Hero: blurred poster as the backdrop until real backdrops arrive */}
      <section aria-labelledby="movie-title" className="relative isolate overflow-hidden bg-mm-raised">
        {movie.posterUrl && (
          <img
            src={movie.posterUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 size-full scale-110 object-cover opacity-50 blur-2xl"
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-mm-bg via-mm-bg/85 to-mm-bg/40" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-mm-bg to-transparent" />

        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-6 pt-28 pb-14 md:flex-row md:items-end md:gap-10">
          <div className="aspect-2/3 w-[200px] shrink-0 overflow-hidden rounded-lg bg-mm-raised shadow-2xl shadow-black/60 md:w-[260px]">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={`${movie.title} poster`} className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-end p-4 font-display text-2xl font-extrabold text-mm-ink">{movie.title}</span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <p className="text-sm text-mm-muted">
              <Link to="/movies" className="hover:text-mm-ink hover:underline">
                Movies
              </Link>
              {movie.genre && (
                <>
                  {" › "}
                  <Link to={`/movies?genre=${encodeURIComponent(movie.genre)}`} className="hover:text-mm-ink hover:underline">
                    {movie.genre}
                  </Link>
                </>
              )}
            </p>
            <h1 id="movie-title" className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-mm-ink md:text-[54px]">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-mm-ink/85">
              {movie.language && (
                <span className="rounded-[3px] bg-mm-ink px-2 py-1 font-bold tracking-wider text-mm-bg uppercase">{movie.language}</span>
              )}
              <span className="rounded-[3px] border-[1.5px] border-mm-accent px-2 py-[3px] font-bold text-mm-accent">
                ★ {formatRating(movie.rating)}
              </span>
              {meta.map((part, i) => (
                <span key={part} className="flex items-center gap-2.5">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-mm-faint">
                      •
                    </span>
                  )}
                  {part}
                </span>
              ))}
            </div>

            {movie.plotSummary && <p className="max-w-2xl text-base leading-relaxed text-mm-ink/85">{movie.plotSummary}</p>}

            <div className="flex flex-wrap gap-3 pt-1">
              <MyListButton type="movie" id={movie._id} />
              {isOwner && (
                <>
                  <Button size="lg" variant="secondary" to={`/update-movie/${movie._id}`} icon={<FiEdit2 />}>
                    Edit
                  </Button>
                  <Button size="lg" variant="danger" onClick={() => setConfirmDelete(true)} icon={<FiTrash2 />}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-14 px-6 pt-6 pb-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <h2 className="font-display text-[22px] font-extrabold text-mm-ink">Storyline</h2>
            <p className="text-base leading-relaxed text-mm-ink/85">{movie.plotSummary || "No summary yet."}</p>
          </div>
          <dl className="m-0 grid w-full shrink-0 grid-cols-[110px_1fr] gap-x-4 gap-y-3 rounded-lg border border-mm-border bg-mm-surface p-6 text-sm lg:w-96">
            <Fact label="Director">{movie.director}</Fact>
            <Fact label="Cast">{movie.cast}</Fact>
            <Fact label="Genre">{movie.genre}</Fact>
            <Fact label="Released">{movie.releaseYear}</Fact>
            <Fact label="Runtime">{formatRuntime(movie.duration)}</Fact>
            <Fact label="Country">{movie.country}</Fact>
            <Fact label="Language">{movie.language}</Fact>
            <Fact label="Added by">{movie.addedBy}</Fact>
          </dl>
        </div>

        <MovieReviews
          movieId={movie._id}
          reviews={movie.reviews || []}
          communityRating={movie.communityRating ?? movie.averageRating}
          onChanged={loadMovie}
        />

        {similar.length > 0 && (
          <section aria-labelledby="similar">
            <SectionHeader
              id="similar"
              eyebrow={`More ${movie.genre}`}
              title="You May Also Like"
              action={{ label: "View all", to: `/movies?genre=${encodeURIComponent(movie.genre)}` }}
            />
            <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {similar.map((m) => (
                <li key={m._id}>
                  <PosterCard movie={m} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${movie.title}?`}
        message="The movie and all its reviews will be removed for everyone. This can't be undone."
        confirmLabel="Delete movie"
        busy={deleting}
        onConfirm={deleteMovie}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
};

export default MovieDetails;
