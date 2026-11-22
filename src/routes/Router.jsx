import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import AllMovies from "../pages/AllMovies";
import TvShows from "../pages/TvShows";
import SeriesDetails from "../pages/SeriesDetails";
import MovieDetails from "../pages/MovieDetails";
import AddMovie from "../pages/AddMovie";
import UpdateMovie from "../pages/UpdateMovie";
import Library from "../pages/Library";
import ErrorPage from "../pages/ErrorPage";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Profile";
import Plans from "../pages/Plans";
import FilmDetails from "../pages/FilmDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/movies",
        element: <AllMovies />,
      },
      {
        path: "/tv",
        element: <TvShows />,
      },
      {
        path: "/tv/:id",
        element: <SeriesDetails />,
      },
      {
        path: "/film/:id",
        element: <FilmDetails />, // a movie from TMDB
      },
      {
        path: "/movies/:id",
        element: <MovieDetails />, // public; reviewing and My List ask for a login
      },
      {
        path: "/add-movie",
        element: (
          <PrivateRoute>
            <AddMovie />
          </PrivateRoute>
        ),
      },
      {
        path: "/update-movie/:id",
        element: (
          <PrivateRoute>
            <UpdateMovie />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-collection",
        element: (
          <PrivateRoute>
            <Library />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-watchlist",
        element: (
          <PrivateRoute>
            <Library />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        // Editing now happens on the profile page itself
        path: "/edit-profile",
        element: <Navigate to="/profile?edit=1" replace />,
      },
      {
        path: "/plans",
        element: <Plans />,
      },
    ],
  },
]);

export default router;
