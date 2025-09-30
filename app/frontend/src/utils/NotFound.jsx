import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = ({ redirectAuthenticated = false }) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);
  const isAuthenticated = !!sessionStorage.getItem('access_token');

  useEffect(() => {
    if (redirectAuthenticated && isAuthenticated) {
      if (count === 0) {
        navigate('/marketplace/dashboard', { replace: true });
      } else {
        const timer = setTimeout(() => setCount(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
      }
    } else if (!isAuthenticated && redirectAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [count, navigate, redirectAuthenticated, isAuthenticated]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404</h1>
      <p>Page Not Found</p>
      {isAuthenticated && redirectAuthenticated && (
        <p>Redirecting to Marketplace Dashboard in {count} seconds...</p>
      )}
    </div>
  );
};

export default NotFound;
