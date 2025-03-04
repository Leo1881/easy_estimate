import React from "react";
import landing_logo from "../assets/images/logo_name.png";
import { Box, Button, ThemeProvider, Typography } from "@mui/material";
import backgroundImage from "../assets/images/background1.jpg";
import { Link } from "react-router-dom";
import theme from "../themes/theme";

const LandingPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "95vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 2, sm: 4 },
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Link to="/" style={{ display: "block" }}>
          <img
            src={landing_logo}
            alt="App Logo"
            style={{
              maxWidth: "700px",
              width: "100%",
              height: "auto",
              marginBottom: "20px",
            }}
          />
        </Link>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            marginTop: 4,
            marginBottom: 4,
            fontFamily: "Poppins",
            fontSize: { xs: "1.75rem", sm: "2rem" },
            fontWeight: 600,
            textAlign: "center",
            color: "primary.main",
            maxWidth: "700px",
            width: "100%",
            lineHeight: 1.6,
          }}
        >
          Streamline your team's estimation process with real-time
          collaboration.
        </Typography>

        <Box sx={{ width: { xs: "90%", sm: "40%", md: "10%" }, marginTop: 2 }}>
          {" "}
          <Link
            to="/create-room"
            style={{ textDecoration: "none", width: "100%", display: "block" }}
          >
            {" "}
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              CREATE ROOM
            </Button>
          </Link>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
