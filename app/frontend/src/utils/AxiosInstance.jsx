// src/utils/AxiosInstance.jsx
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// Request Interceptor - attach token
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - handle token refresh
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = sessionStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${baseURL}api/token/refresh/`, {
            refresh: refreshToken,
          });

          // Save new access token
          sessionStorage.setItem("access_token", response.data.access);

          // Update header and retry original request
          originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;
          return AxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        sessionStorage.clear();
        window.location.href = "/"; // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
