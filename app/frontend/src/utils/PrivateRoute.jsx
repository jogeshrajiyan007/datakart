import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";   // <-- fixed import

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("access_token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000; // current time in seconds

          if (decoded.exp && decoded.exp > now) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.clear(); // token expired
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          sessionStorage.clear();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Checking authentication...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
