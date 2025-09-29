// src/components/NotFoundAuthenticated.jsx
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundAuthenticated = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      textAlign="center"
    >
      <Typography variant="h2" gutterBottom color="error">
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The page you are looking for doesn’t exist.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/marketplace/dashboard")}
        sx={{ backgroundColor: "#FFD700", color: "#111" }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFoundAuthenticated;
