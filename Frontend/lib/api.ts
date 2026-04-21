import axios from "axios";

const LOCAL_API_URL = "http://localhost:5000/api";
const PROD_FALLBACK_API_URL = "https://goaltrackr-server.vercel.app/api";

function resolveApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
    return isLocalhost ? LOCAL_API_URL : PROD_FALLBACK_API_URL;
  }

  return process.env.NODE_ENV === "production"
    ? PROD_FALLBACK_API_URL
    : LOCAL_API_URL;
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("goaltrackr_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      (error?.request
        ? "Network error or CORS blocked request"
        : "Request failed");
    return Promise.reject(new Error(message));
  },
);

export default api;
