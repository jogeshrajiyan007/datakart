import axios from "axios";

const baseURL = "http://127.0.0.1:8000/";
let refreshTimeout = null;

export const scheduleTokenRefresh = (access, refresh) => {
  const tokenParts = JSON.parse(atob(access.split(".")[1]));
  const exp = tokenParts.exp * 1000; // expiry in ms
  const now = Date.now();

  // Refresh 30s before expiry
  const refreshTime = exp - now - 30000;

  if (refreshTimeout) clearTimeout(refreshTimeout);

  refreshTimeout = setTimeout(async () => {
    try {
      const { data } = await axios.post(`${baseURL}api/token/refresh/`, {
        refresh,
      });

      sessionStorage.setItem("access_token", data.access);

      // Reschedule
      scheduleTokenRefresh(data.access, refresh);
    } catch (err) {
      console.error("Auto refresh failed:", err);
      sessionStorage.clear();
      window.location.href = "/";
    }
  }, refreshTime);
};
