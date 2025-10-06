import '../App.css';
import { useState, useEffect } from 'react';
import { Box, TextField, IconButton, InputAdornment, Button, CircularProgress, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import AxiosInstance from '../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../assets/datakartLogo.svg';
import { scheduleTokenRefresh } from "../utils/authService";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const { control, handleSubmit } = useForm({
    defaultValues: { email: '', password: '' }
  });

  // Redirect if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) navigate('/marketplace/dashboard', { replace: true });
  }, [navigate]);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const welcome = "Welcome to DataKart!";
  const tagline = "The Marketplace for reliable data exchange.";

  const letterVariants = { hidden: { opacity: 0, y: 20 }, visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.15 } }) };
  const taglineVariants = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 3 } } };

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const response = await AxiosInstance.post('/api/login/', {
        email: data.email,
        password: data.password
      });

      sessionStorage.setItem('access_token', response.data.access);
      sessionStorage.setItem('refresh_token', response.data.refresh);

      scheduleTokenRefresh(response.data.access, response.data.refresh);

      setFailedAttempts(0);
      navigate('/marketplace/dashboard', { replace: true });
    } catch (err) {
      setError('Invalid email or password');
      setFailedAttempts(prev => prev + 1);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="myBackground">
      {/* LEFT SIDE */}
      <Box className="leftBox">
        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', fontSize: '3.5rem', fontWeight: 'bold', color: '#FFD700', marginBottom: '20px' }}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {welcome.split('').map((char, index) => (
            <motion.span key={index} custom={index} variants={letterVariants}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          style={{ fontSize: '1.5rem', color: '#fff' }}
          initial="hidden"
          animate="visible"
          variants={taglineVariants}
        >
          {tagline}
        </motion.div>
      </Box>

      {/* RIGHT SIDE */}
      <Box className="whiteBox">
        <Box className="logoBox">
          <img src={Logo} alt="DataKart Logo" className="logoImg" />
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field }) => <TextField {...field} label="Email" type="email" fullWidth sx={{ mb: 2 }} />}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          />

          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}

          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mb: 2 }}>
            {loading ? <CircularProgress size={24} sx={{ color: '#111' }} /> : 'Sign In'}
          </Button>
        </form>

        <Box className="itemBox registerLink">
          New to DataKart? <a href="/register">Create your account</a>
        </Box>

        {failedAttempts >= 3 && (
          <Box className="itemBox registerLink">
            <a href="/forgot-password">Forgot Password? Contact Administrator</a>
          </Box>
        )}
      </Box>

      <Box className="footer">
        © {new Date().getFullYear()} DataKart. All rights reserved.
      </Box>
    </div>
  );
};

export default Login;
