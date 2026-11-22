import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import * as api from "../api/api";
import MovieForm from "../components/movie/MovieForm";
import MovieFormPage from "../components/movie/MovieFormPage";

const AddMovie = () => {
  const navigate = useNavigate();

  const add = async (movie) => {
    const { insertedId } = await api.addMovie(movie);
    toast.success(`"${movie.title}" added to the catalog`);
    navigate(insertedId ? `/movies/${insertedId}` : "/my-collection");
  };

  return (
    <>
      <Helmet>
        <title>Add a movie · Movie Matrix</title>
        <meta name="description" content="Share a movie with the Movie Matrix community." />
      </Helmet>
      <MovieFormPage
        eyebrow="My Collection"
        title="Add a movie"
        subtitle="Share a film you love. It joins the catalog for everyone, and you can edit it any time."
      >
        <MovieForm submitLabel="Add movie" onSubmit={add} onCancel={() => navigate(-1)} />
      </MovieFormPage>
    </>
  );
};

export default AddMovie;
