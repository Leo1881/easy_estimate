import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#004b92", // Primary color
    },
    secondary: {
      main: "#5097ccff", // Secondary color
    },
    success: {
      main: "#522581", // Success color
    },
    error: {
      main: "#D32F2F", // Error color
    },
    warning: {
      main: "#FF9800", // Warning color
    },
    info: {
      main: "#00BCD4", // Info color
    },
    background: {
      default: "#F5F5F5", // Default background color
    },
    text: {
      primary: "#004b92", // Main text color
      secondary: "#757575", // Secondary text color
    },
  },
  typography: {
    fontFamily: '"Poppins", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
        },
      },
    },
  },
});

export default theme;
