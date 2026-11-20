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

// A 401 means the session is missing or expired: sign out and go to login.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && auth.currentUser) {
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
export const getTopRatedMovies = () => data(api.get("/movies-top-rated"));
export const getRecentMovies = () => data(api.get("/movies-recent"));
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

// ---------- Watchlist ----------
export const getWatchlist = (email) => data(api.get(`/watchlist/${encodeURIComponent(email)}`));
export const addToWatchlist = (movieId) => data(api.post("/watchlist", { movieId }));
export const removeFromWatchlist = (email, movieId) =>
  data(api.delete(`/watchlist/${encodeURIComponent(email)}/${movieId}`));

// ---------- Users ----------
export const saveUser = (user) => data(api.post("/users", user));
export const getMe = () => data(api.get("/users/me"));

// ---------- Stats ----------
export const getMoviesCount = () => data(api.get("/stats/movies-count"));
export const getUsersCount = () => data(api.get("/stats/users-count"));
export const getReviewsCount = () => data(api.get("/stats/reviews-count"));
