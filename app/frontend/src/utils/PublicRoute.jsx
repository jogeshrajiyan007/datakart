import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem('access_token');

  if (isAuthenticated) {
    return <Navigate to="/marketplace/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;