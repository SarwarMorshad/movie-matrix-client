import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
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
import EditProfile from "../pages/EditProfile";
import SubscriptionPlans from "../pages/SubscriptionPlans";

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
        path: "/edit-profile",
        element: (
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/plans",
        element: <SubscriptionPlans></SubscriptionPlans>,
      },
    ],
  },
]);

export default router;
