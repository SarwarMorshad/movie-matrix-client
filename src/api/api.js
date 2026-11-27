// Every call to the Movie Matrix API lives in this file.
// Components import the functions below; they never call axios directly.

import axios from "axios";
import { signOut } from "firebase/auth";
import auth from "../config/firebase";

export const API_URL = import.meta.env.VITE_API_URL || "https://movie-matrix-server-tan.vercel.app";

const api = axios.create({ baseURL: API_URL });

// Attach the logged-in user's Firebase ID token to every request.
// getIdToken() returns a cached token and refreshes it when it expires.
api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    config.headers.Authorization = `Bearer ${await currentUser.getIdToken()}`;
  }
  return config;
});

// Sign out only when the server says it rejected the token (TOKEN_INVALID).
// getIdToken() already refreshes expired tokens, so other errors, such as a
// server problem, never log the user out.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.data?.code === "TOKEN_INVALID" && auth.currentUser) {
      await signOut(auth);
      if (window.location.pathname !== "/login") window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

const data = (request) => request.then((res) => res.data);

// ---------- Movies ----------
export const getMovies = () => data(api.get("/movies"));
export const getMovie = (id) => data(api.get(`/movies/${id}`));
// params: { search, genre, language, minRating, sort, page, limit } -> { movies, total, page, totalPages, limit }
export const browseMovies = (params) => data(api.get("/movies-browse", { params }));
export const getTopRatedMovies = (limit) => data(api.get("/movies-top-rated", { params: { limit } }));
export const getRecentMovies = (limit) => data(api.get("/movies-recent", { params: { limit } }));
export const getMyMovies = () => data(api.get("/my-movies"));
export const addMovie = (movie) => data(api.post("/movies", movie));
export const updateMovie = (id, movie) => data(api.put(`/movies/${id}`, movie));
export const deleteMovie = (id) => data(api.delete(`/movies/${id}`));

// ---------- Reviews ----------
export const getMovieReviews = (movieId) => data(api.get(`/reviews/${movieId}`));
export const getMyReviews = () => data(api.get("/my-reviews"));
export const addReview = (review) => data(api.post("/reviews", review));
export const updateReview = (id, review) => data(api.put(`/reviews/${id}`, review));
export const deleteReview = (id) => data(api.delete(`/reviews/${id}`));

// ---------- Watchlist / My List (always the logged-in user's own list) ----------
export const getWatchlist = () => data(api.get("/watchlist/me")); // saved movies only
export const getMyList = () => data(api.get("/watchlist/me/all")); // { items: [{ type: "movie" | "series" | "film", ... }] }
export const addToWatchlist = (movieId) => data(api.post("/watchlist", { movieId }));
export const removeFromWatchlist = (movieId) => data(api.delete(`/watchlist/me/${movieId}`));
export const addSeriesToList = (seriesId) => data(api.post("/watchlist/series", { seriesId }));
export const removeSeriesFromList = (seriesId) => data(api.delete(`/watchlist/me/series/${seriesId}`));
export const addFilmToList = (filmId) => data(api.post("/watchlist/films", { filmId }));
export const removeFilmFromList = (filmId) => data(api.delete(`/watchlist/me/films/${filmId}`));

// ---------- TV series (TMDB data via our server) ----------
// Lists and searches return { results, page, totalPages, total }; each result is a series card
export const getTvList = (list, page) => data(api.get(`/tv/lists/${list}`, { params: { page } })); // trending | popular | top_rated | airing_today | on_the_air
export const getTvGenres = () => data(api.get("/tv/genres")); // [{ id, name }]
export const discoverTv = (params) => data(api.get("/tv/discover", { params })); // { genre, sort, page }
export const searchTv = (q, page) => data(api.get("/tv/search", { params: { q, page } }));
export const getSeries = (id) => data(api.get(`/tv/${id}`));
export const getSeason = (id, number) => data(api.get(`/tv/${id}/season/${number}`));

// ---------- Films (movies from TMDB via our server) ----------
export const getFilmList = (list, page) => data(api.get(`/films/lists/${list}`, { params: { page } })); // trending | popular | top_rated | now_playing | upcoming
export const getFilm = (id) => data(api.get(`/films/${id}`));
export const getFilmGenres = () => data(api.get("/films/genres")); // [{ id, name }]
export const discoverFilms = (params) => data(api.get("/films/discover", { params })); // { genre, sort, page }

// ---------- Search (films + series from TMDB, and members' movies) ----------
// -> { query, results, members, page, totalPages, total }
export const search = (q, { type = "all", page = 1 } = {}, config) =>
  data(api.get("/search", { params: { q, type, page }, ...config })); // type: all | film | series; config e.g. { signal }

// ---------- Users ----------
export const saveUser = (user) => data(api.post("/users", user));
export const getMe = () => data(api.get("/users/me")); // includes role and plan
export const updateMe = (changes) => data(api.patch("/users/me", changes)); // { name?, photoURL? }

// ---------- Stats ----------
export const getMoviesCount = () => data(api.get("/stats/movies-count"));
export const getUsersCount = () => data(api.get("/stats/users-count"));
export const getReviewsCount = () => data(api.get("/stats/reviews-count"));
export const getGenreCounts = () => data(api.get("/stats/genres")); // [{ genre, count }]
export const getLanguageCounts = () => data(api.get("/stats/languages")); // [{ language, count }]
