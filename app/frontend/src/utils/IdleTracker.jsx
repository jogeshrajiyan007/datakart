// utils/IdleTracker.jsx
import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, LinearProgress, Box, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../utils/AxiosInstance";

const IdleTracker = ({ idleTime = 15 * 60 * 1000, warningTime = 3 * 60 }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(warningTime);
  const [progress, setProgress] = useState(100);

  const timer = useRef(null);
  const warningTimer = useRef(null);

  // Reset inactivity timer on user activity
  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), idleTime);
  };

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timer.current) clearTimeout(timer.current);
      if (warningTimer.current) clearInterval(warningTimer.current);
    };
  }, []);

  // Countdown logic with smooth progress
  useEffect(() => {
    if (open) {
      setCountdown(warningTime);
      setProgress(100);
      const interval = 1000; // 1 second
      warningTimer.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(warningTimer.current);
            handleLogout();
            return 0;
          }
          setProgress(((prev - 1) / warningTime) * 100);
          return prev - 1;
        });
      }, interval);
    } else {
      if (warningTimer.current) clearInterval(warningTimer.current);
    }
  }, [open]);

  const handleStaySignedIn = async () => {
    try {
      const refreshToken = sessionStorage.getItem("refresh_token");
      if (refreshToken) {
        const response = await AxiosInstance.post("/api/token/refresh/", { refresh: refreshToken });
        sessionStorage.setItem("access_token", response.data.access);
      }
    } catch (err) {
      console.error("Failed to refresh token", err);
      handleLogout();
      return;
    }

    setOpen(false);
    resetTimer();
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/signout", { replace: true });
  };

  return (
    <Fade in={open}>
      <Dialog
        open={open}
        onClose={handleStaySignedIn}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            minWidth: 400,
            backgroundColor: "#f5f5f5",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
          Are you still there?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, textAlign: "center" }}>
            You've been inactive for a while. You will be logged out in <strong>{countdown}</strong> seconds.
          </Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStaySignedIn}
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2,
              transition: "all 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            Stay Signed In
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2,
              transition: "all 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </Fade>
  );
};

export default IdleTracker;
