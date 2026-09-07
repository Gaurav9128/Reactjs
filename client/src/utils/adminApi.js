import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

adminApi.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");

  if (adminToken && config.url.startsWith("/api/admin")) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

export default adminApi;
