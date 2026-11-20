import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "https://movie-matrix-server-tan.vercel.app";

// Public API calls that don't need a logged-in user.
const axiosInstance = axios.create({ baseURL: API_URL });

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
