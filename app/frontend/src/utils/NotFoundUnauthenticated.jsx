import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundUnauthenticated = () => {
  const navigate = useNavigate();

  return (
    <div className="myBackground">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
        color="#fff"
      >
        <Typography variant="h2" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          The page you are looking for doesn’t exist or you don’t have access.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ backgroundColor: "#FFD700", color: "#111" }}
        >
          Go to Login
        </Button>
      </Box>
    </div>
  );
};

export default NotFoundUnauthenticated;
