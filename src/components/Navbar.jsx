import React from "react";
import { AppBar, ThemeProvider, Toolbar, Typography } from "@mui/material";
import logo from "../assets/images/logo1.png";
import { Link } from "react-router-dom";
import theme from "../themes/theme";

const Navbar = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="absolute"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          zIndex: 100,
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <Link to="/">
            <img
              src={logo}
              alt="App Logo"
              style={{
                maxWidth: "50px",
                width: "100%",
                height: "auto",
                marginRight: "10px",
                cursor: "pointer",
              }}
            />
          </Link>

          <Typography
            variant="body1"
            color="primary.main"
            sx={{
              fontWeight: "bold",
            }}
          >
            Effortless Team Estimation
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
