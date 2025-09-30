import { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../utils/AxiosInstance';

const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const refreshToken = sessionStorage.getItem('refresh_token');

        if (refreshToken) {
          await AxiosInstance.post('/api/logout/', { refresh: refreshToken });
        }
      } catch (err) {
        console.error(err);
      } finally {
        sessionStorage.clear();
        setLoading(false);
      }
    };

    logoutUser();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center' }}>
      {loading ? <CircularProgress /> : (
        <>
          <Typography variant="h4" sx={{ mb: 2 }}>You have logged out successfully!</Typography>
          <Button variant="contained" onClick={() => navigate('/')}>Go to Login</Button>
        </>
      )}
    </Box>
  );
};

export default Logout;
