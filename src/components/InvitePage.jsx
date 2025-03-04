import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import backgroundImage from "../assets/images/background1.jpg";

const InvitePage = () => {
  const { roomName, creatorName } = useParams();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    if (!userName.trim()) {
      setError("Please enter your name to join the room.");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store user info
      localStorage.setItem("userName", userName.trim());

      // Navigate to room
      navigate(
        `/room/${roomName}/${creatorName}?name=${encodeURIComponent(
          userName.trim()
        )}`
      );
    } catch (error) {
      setError("Failed to join the room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1,
        },
      }}
    >
      <Card
        sx={{
          padding: 4,
          maxWidth: "500px",
          width: "90%",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: "primary.main",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          Welcome to Planning Poker!
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
          sx={{
            color: "text.secondary",
            textAlign: "center",
            mb: 2,
          }}
        >
          You have been invited to join the "{roomName}" room by {creatorName}.
        </Typography>

        <TextField
          label="Enter your name"
          variant="outlined"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyPress={handleKeyPress}
          margin="normal"
          required
          fullWidth
          error={!!error}
          helperText={error}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleJoinRoom}
          disabled={loading}
          fullWidth
          sx={{
            height: "56px",
            position: "relative",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Join Room"
          )}
        </Button>
      </Card>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvitePage;
