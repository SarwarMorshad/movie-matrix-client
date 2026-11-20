import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import auth from "../firebase/firebase.init";
import { API_URL } from "./useAxios";

// API calls that need a logged-in user. Every request carries the current
// Firebase ID token, which the server verifies.
const axiosSecure = axios.create({ baseURL: API_URL });

axiosSecure.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    // getIdToken() returns a cached token and refreshes it when it expires
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // A 401 means the session is missing or expired: sign out and go to login.
    const id = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401) {
          await signOut(auth);
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
    return () => axiosSecure.interceptors.response.eject(id);
  }, [navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
