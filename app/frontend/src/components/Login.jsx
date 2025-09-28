import '../App.css'
import { useState } from 'react'
import { Box, TextField, IconButton, InputAdornment, Button } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { motion } from 'framer-motion'
import Logo from '../assets/datakartLogo.svg'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const welcome = "Welcome to DataKart!"
  const tagline = "The Marketplace for reliable data exchange."

  // Typewriter animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
  }

  return (
    <div className="myBackground">
      {/* LEFT SIDE - Animated Text */}
      <Box className="leftBox">
        {/* Welcome message - Typewriter effect */}
        <motion.div
          className="welcomeMessageWrapper"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {welcome.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="welcomeMessage"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Tagline - sliding in */}
        <motion.div
          className="tagline"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          {tagline}
        </motion.div>
      </Box>

      {/* RIGHT SIDE - Login Box */}
      <Box className="whiteBox">
        <Box className="logoBox">
          <img src={Logo} alt="DataKart Logo" className="logoImg" />
        </Box>

        <Box className="itemBox">
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
          />
        </Box>

        <Box className="itemBox">
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
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
        </Box>


        <Box className="itemBox">
          <Button
            variant="contained"
            fullWidth
            className="loginButton"
          >
            Sign In
          </Button>
        </Box>

        <Box className="itemBox registerLink">
          New to DataKart?  <a href="/register">Create your account</a>
        </Box>
      </Box>
      {/* Footer - Copyright */}
      <Box className="footer">
        © {new Date().getFullYear()} DataKart. All rights reserved.
      </Box>
    </div>
  )
}

export default Login
