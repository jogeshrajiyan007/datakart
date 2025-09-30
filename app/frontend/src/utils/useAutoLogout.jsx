// utils/useAutoLogout.js
import { useEffect } from "react";

const useAutoLogout = () => {
  useEffect(() => {
    const handleUnload = () => {
      // Mark a reload attempt
      sessionStorage.setItem("pendingReload", "true");

      // After 1 second, check if page reopened
      setTimeout(() => {
        const pending = sessionStorage.getItem("pendingReload");
        if (pending === "true") {
          // Page did not reopen => tab was closed
          const refreshToken = sessionStorage.getItem("refresh_token");
          if (refreshToken) {
            const url = "http://127.0.0.1:8000/api/token/logout/";
            const formData = new FormData();
            formData.append("refresh", refreshToken);
            navigator.sendBeacon(url, formData);
          }
          sessionStorage.clear();
        }
      }, 1000);
    };

    // If page reloads, clear the pending flag immediately
    sessionStorage.removeItem("pendingReload");

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);
};

export default useAutoLogout;
