import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import backgroundImage from "../assets/images/background1.jpg";

const CreateRoom = () => {
  const [estimation, setEstimation] = useState("");
  const [showRunner, setShowRunner] = useState("");
  const [roomUrl, setRoomUrl] = useState("");
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!showRunner.trim()) {
      newErrors.showRunner = "Please enter who's running the show";
    }
    if (!estimation) {
      newErrors.estimation = "Please select an estimation method";
    }
    if (!roomName.trim()) {
      newErrors.roomName = "Please enter a room name";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRoom = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const sanitizedRoomName = roomName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      // Clear ALL previous room data
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("roomUsers_")) {
          localStorage.removeItem(key);
        }
      });

      // Store admin info
      localStorage.setItem("roomAdmin", showRunner);
      localStorage.setItem("estimationType", estimation);
      localStorage.setItem("userName", showRunner);

      // Initialize new room with only the admin
      const initialUsers = [
        {
          name: `${showRunner} - Admin`, // Add the Admin suffix here
          isAdmin: true,
        },
      ];
      localStorage.setItem(
        `roomUsers_${sanitizedRoomName}`,
        JSON.stringify(initialUsers)
      );

      // Generate URLs
      const inviteUrl = `${window.location.origin}/invite/${sanitizedRoomName}/${showRunner}`;
      const adminUrl = `${window.location.origin}/room/${sanitizedRoomName}/${showRunner}`;

      setRoomUrl(inviteUrl);
      localStorage.setItem("adminUrl", adminUrl);
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setShowCopySuccess(true);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleJoinRoom = () => {
    const isAdmin = localStorage.getItem("roomAdmin") === showRunner;
    const adminUrl = localStorage.getItem("adminUrl");

    if (isAdmin && adminUrl) {
      window.location.href = adminUrl;
    } else {
      window.location.href = roomUrl;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "500px",
          padding: 4,
          backgroundColor: "background.paper",
          borderRadius: "8px",
          boxShadow: 3,
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ marginBottom: 2, color: "primary.main" }}
        >
          Create Your Room
        </Typography>

        <TextField
          label="Who's running the show?"
          variant="outlined"
          value={showRunner}
          onChange={(e) => setShowRunner(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!!errors.showRunner}
          helperText={errors.showRunner}
        />

        <FormControl
          fullWidth
          margin="normal"
          variant="outlined"
          error={!!errors.estimation}
        >
          <InputLabel id="estimation-label">Estimation Method</InputLabel>
          <Select
            labelId="estimation-label"
            value={estimation}
            onChange={(e) => setEstimation(e.target.value)}
            label="Estimation Method"
          >
            <MenuItem value="fibonacci">
              Fibonacci (1, 2, 3, 5, 8, 13, 21)
            </MenuItem>
            <MenuItem value="tshirt">T-shirt (XS, S, M, L, XL)</MenuItem>
          </Select>
          {errors.estimation && (
            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
              {errors.estimation}
            </Typography>
          )}
        </FormControl>

        <TextField
          label="What's your room name?"
          variant="outlined"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!!errors.roomName}
          helperText={errors.roomName}
        />

        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={handleCreateRoom}
          fullWidth
          sx={{
            mt: 2,
            height: "56px",
            position: "relative",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "SAVE AND CREATE"
          )}
        </Button>

        {roomUrl && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 2,
              width: "100%",
            }}
          >
            <TextField
              value={roomUrl}
              InputProps={{ readOnly: true }}
              fullWidth
            />

            <Button
              sx={{
                height: "56px",
                width: "20%",
              }}
              onClick={handleCopyUrl}
              variant="contained"
              color="secondary"
            >
              <ContentCopyIcon />
            </Button>
          </Box>
        )}

        {roomUrl && (
          <>
            <Typography variant="body2" sx={{ mt: 2, color: "primary.main" }}>
              Invite your team using this link.
            </Typography>
            <Button
              variant="contained"
              color="success"
              sx={{
                mt: 2,
                width: "100%",
                height: "56px",
              }}
              onClick={handleJoinRoom}
            >
              JOIN
            </Button>
          </>
        )}
      </Box>

      <Snackbar
        open={showCopySuccess}
        autoHideDuration={3000}
        onClose={() => setShowCopySuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateRoom;
