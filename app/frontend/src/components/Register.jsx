import '../App.css';
import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  InfoOutlined,
  Launch,
  CheckCircle,
} from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import countries from '../utils/countries';
import roles from '../utils/roles';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/datakartLogo.svg';
import AxiosInstance from '../utils/AxiosInstance';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: '',
    otherRole: '',
    country: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successing, setSuccessing] = useState(false); // true while showing success panel
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  const togglePasswordVisibility = () => setShowPassword((p) => !p);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((p) => !p);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const getPasswordStrength = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (strongRegex.test(password)) return 'Strong';
    if (password.length >= 6) return 'Medium';
    if (password.length > 0) return 'Weak';
    return '';
  };
  const passwordStrength = getPasswordStrength(form.password);
  const passwordMatch = form.password === form.confirmPassword;

  // Left animated content (kept as-is)
  const didYouKnowList = [
    {
      text: 'Poor data quality can reduce revenue by 15-20% per year.',
      link: 'https://www.dataversity.net/data-quality-and-revenue/',
    },
    {
      text: 'Missed SLAs and lack of data ownership caused massive delays in projects.',
      link: 'https://tdwi.org/articles/2022/01/21/adv-all-data-governance-slaps.aspx',
    },
    {
      text: 'Insufficient data observability can lead to bad decision-making and financial loss.',
      link: 'https://www.gartner.com/en/newsroom/press-releases/2021-05-12',
    },
    {
      text: 'Lack of transparency in data lifecycle affects trust between teams.',
      link: 'https://www.forbes.com/sites/forbestechcouncil/2022/06/20/the-importance-of-data-governance/',
    },
    {
      text: 'Unmanaged consumer requests can overwhelm data producers causing delays.',
      link: 'https://www.dataversity.net/managing-data-consumer-requests/',
    },
  ];

  const solutionPoints = [
    'DataKart provides trusted, reliable data with Data Contracts.',
    'Connect directly with Data Owners in a single platform.',
    'Raise issues or request new data products seamlessly.',
    'Full transparency in data lifecycle with Observability tools.',
    'Real-time Data Quality dashboards with alerts for SLA breaches.',
    'Optimized workflows for producers & consumers to collaborate efficiently.',
  ];

  const messages = [
    { type: 'typewriter', content: 'Did you know?' },
    { type: 'slide', content: didYouKnowList },
    { type: 'typewriter', content: "Don't worry, we've got you covered!" },
    { type: 'slide', content: solutionPoints },
    {
      type: 'typewriter',
      content: 'Start your journey in DataKart by signing up here',
    },
  ];

  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearTimeout(timer);
  }, [msgIndex]);

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
  };
  const slideVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.25 } }),
  };

  const renderMessage = () => {
    const current = messages[msgIndex];
    if (current.type === 'typewriter') {
      return (
        <motion.div
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#FFD700',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {current.content.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
          {msgIndex === messages.length - 1 && (
            <ArrowForwardIcon
              sx={{ ml: 1, fontSize: '2rem', color: '#FFD700' }}
            />
          )}
        </motion.div>
      );
    }
    // slide list
    const listContent = current.content;
    return (
      <Box component="ul" sx={{ pl: 3 }}>
        {listContent.map((item, i) => (
          <motion.li
            key={i}
            custom={i}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: '12px', fontSize: '1.1rem', color: '#fff' }}
          >
            {item.text ? (
              <>
                {item.text}{' '}
                <a href={item.link} target="_blank" rel="noreferrer">
                  <Launch fontSize="small" sx={{ ml: 1, color: '#FFD700' }} />
                </a>
              </>
            ) : (
              item
            )}
          </motion.li>
        ))}
      </Box>
    );
  };

  // Utility to extract a friendly error message from API response
  const parseApiError = (err) => {
    const data = err?.response?.data;
    if (!data) return 'Registration failed. Please try again.';
    // If Django returns dict of field errors
    if (typeof data === 'object') {
      // common: { "email": ["user with this email already exists."] }
      if (data.email) return `${data.email.join(' ')} Please proceed to Login Page.`;
      if (data.password) return data.password.join(' ');
      if (data.detail) return data.detail;
      // fallback: join all messages
      const joined = Object.values(data)
        .flat()
        .filter(Boolean)
        .join(' ');
      if (joined) return joined;
    }
    // fallback string message
    return String(data) || 'Registration failed. Please try again.';
  };

  // Submit handler
  const submitRegistration = async () => {
    // basic client checks
    if (!form.fullName || !form.email || !form.password) {
      setError('Please fill at least Full Name, Email and Password.');
      return;
    }
    if (!passwordMatch) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await AxiosInstance.post('/api/register/', {
        full_name: form.fullName,
        email: form.email,
        password: form.password,
        organization: form.organization,
        role: form.role === 'Other' ? form.otherRole : form.role,
        country: form.country,
      });

      // success: replace form with success panel (no scrolling required)
      setSuccessing(true);
      setLoading(false);

      // start countdown and redirect
      let counter = 5;
      setCountdown(counter);
      const interval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);
        if (counter <= 0) {
          clearInterval(interval);
          navigate('/'); // send to login
        }
      }, 1000);
    } catch (err) {
      console.error('Registration error:', err?.response?.data ?? err);
      const message = parseApiError(err);
      setError(message);
      setLoading(false);
    }
  };

  // Animations for form <-> success swap
  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };
  const successVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <div className="myBackground">
      {/* LEFT SIDE */}
      <Box className="leftBox" sx={{ flex: 1, overflowY: 'hidden' }}>
        <AnimatePresence>{renderMessage()}</AnimatePresence>
      </Box>

      {/* RIGHT SIDE (form area) */}
      <Box
        className="whiteBox"
        sx={{
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box className="logoBox" sx={{ zIndex: 1 }}>
          <img src={Logo} alt="DataKart Logo" className="logoImg" />
        </Box>

        {/* when successing true -> replace the form with success panel (AnimatePresence) */}
        <AnimatePresence mode="wait">
          {!successing ? (
            <motion.div
              key="form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width: '100%' }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Create an Account
              </Typography>

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <TextField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />

              <Box sx={{ position: 'relative', mb: 1 }}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InfoOutlined fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Password Strength:{' '}
                  <strong>{passwordStrength || '—'}</strong> (min 8 chars, 1 uppercase, 1 number, 1 special)
                </Typography>
              </Box>

              <Box sx={{ position: 'relative', mb: 2 }}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  error={form.confirmPassword && !passwordMatch}
                  helperText={
                    form.confirmPassword && !passwordMatch
                      ? 'Passwords do not match'
                      : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TextField
                label="Organization"
                name="organization"
                value={form.organization}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                select
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              >
                {roles.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>

              {form.role === 'Other' && (
                <TextField
                  label="Define Role"
                  name="otherRole"
                  value={form.otherRole}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                select
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 3 }}
              >
                {countries.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#ff9900', color: '#111', mb: 2 }}
                onClick={submitRegistration}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: '#fff' }} />
                ) : (
                  'Sign Up'
                )}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                padding: '30px 10px',
                width: '100%',
              }}
            >
              <CheckCircle sx={{ fontSize: 72, color: 'limegreen' }} />
              <Typography variant="h5" sx={{ fontWeight: '700' }}>
                Registered Successfully!
              </Typography>
              <Typography variant="body1">
                Redirecting to login page in <strong>{countdown}</strong>...
              </Typography>

              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{ mt: 2 }}
              >
                Go to Login now
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <Box className="footer">
        © {new Date().getFullYear()} DataKart. All rights reserved.
      </Box>
    </div>
  );
};

export default Register;
