import axios from "axios";

const api = axios.create({
  baseURL: "https://badminton-booking-backend-a0zs.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
