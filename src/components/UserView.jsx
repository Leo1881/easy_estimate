import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Paper } from "@mui/material";
import JiraTicketList from "./JiraTicketList";
import UserList from "./UserList";
import { useSelector } from "react-redux";

const UserView = ({ tickets, users, estimationType, onUpdateUsers }) => {
  const [selectedEstimation, setSelectedEstimation] = useState(null);
  const [localUserEstimations, setLocalUserEstimations] = useState({});
  const selectedTicket = useSelector((state) => state.selectedTicket);

  // Effect to handle ticket updates
  useEffect(() => {
    if (selectedTicket) {
      if (selectedTicket.userEstimations) {
        setLocalUserEstimations(selectedTicket.userEstimations);
        const currentUserName = localStorage.getItem("userName");
        if (selectedTicket.userEstimations[currentUserName]) {
          setSelectedEstimation(
            selectedTicket.userEstimations[currentUserName]
          );
        }
      }
    }
  }, [selectedTicket]);

  // Add effect to track state changes
  useEffect(() => {
    console.log("📊 UserView - State Update");
    console.log("Selected Estimation:", selectedEstimation);
    console.log("Local User Estimations:", localUserEstimations);
  }, [selectedEstimation, localUserEstimations]);

  const handleEstimationSelect = (value) => {
    console.log("🎯 UserView - Estimation Selected:", value);
    console.log("Current selectedTicket:", selectedTicket);

    if (!selectedTicket?.finalEstimation) {
      const newEstimation = value === selectedEstimation ? null : value;
      console.log("Setting new estimation:", newEstimation);
      setSelectedEstimation(newEstimation);

      const currentUserName = localStorage.getItem("userName");
      console.log("Current user:", currentUserName);

      const updatedUsers = users.map((user) =>
        user.name === currentUserName
          ? { ...user, estimation: newEstimation }
          : user
      );
      console.log("Updated users:", updatedUsers);
      onUpdateUsers(updatedUsers);
    }
  };

  // Get the current user's name and their estimation for this ticket
  const currentUserName = localStorage.getItem("userName");
  const currentUserEstimation = localUserEstimations[currentUserName];

  console.log("Current user name:", currentUserName);
  console.log("Current user estimation:", currentUserEstimation);

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "calc(100vh - 160px)", // Updated to match Admin view
        width: "95%",
        mx: "auto",
        "& *": { transition: "none !important" },
        display: "flex",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          height: "100%",
        }}
      >
        {/* Left panel - Ticket List */}
        <Grid item xs={3} sx={{ height: "100%" }}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
              Tickets
            </Typography>
            <CardContent
              sx={{
                flex: 1,
                pt: 0,
                px: 2,
                pb: 2,
                overflowY: "auto",
                "&:last-child": { pb: 2 },
              }}
            >
              <JiraTicketList tickets={tickets} onSelect={() => {}} />
            </CardContent>
          </Card>
        </Grid>

        {/* Middle panel - Ticket Details */}
        <Grid item xs={6} sx={{ height: "100%" }}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ p: 2, pb: 1, color: "primary.main" }}
            >
              JIRA Ticket Details
            </Typography>
            <CardContent
              sx={{
                flex: 1,
                pt: 0,
                px: 2,
                pb: 2,
                overflowY: "auto",
                "&:last-child": { pb: 2 },
              }}
            >
              {selectedTicket && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          ID
                        </Typography>
                        <Typography variant="body2">
                          {selectedTicket.id}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          Ticket Name
                        </Typography>
                        <Typography variant="h6">
                          {selectedTicket.title}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          Summary
                        </Typography>
                        <Typography variant="body1">
                          {selectedTicket.summary || "No summary provided"}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          Description
                        </Typography>
                        <Typography variant="body1">
                          {selectedTicket.description}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          Details
                        </Typography>
                        <Typography variant="body1">
                          {selectedTicket.details ||
                            "No additional details available"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Show final estimation if it exists */}
                  {selectedTicket.finalEstimation && (
                    <Box
                      sx={{
                        mb: 2,
                        p: 2,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="h6">
                        Final Estimation: {selectedTicket.finalEstimation}
                      </Typography>
                      <Typography variant="body2">
                        Admin's final decision
                      </Typography>
                    </Box>
                  )}

                  {/* Estimation Cards */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      mt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        overflowX: "auto",
                        pb: 2,
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      {estimationType === "Fibonacci"
                        ? [1, 2, 3, 5, 8, 13, 21].map((value) => (
                            <Paper
                              key={value}
                              elevation={selectedEstimation === value ? 8 : 2}
                              sx={{
                                flex: 1,
                                minWidth: 60,
                                height: 120,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: selectedTicket.finalEstimation
                                  ? "not-allowed"
                                  : "pointer",
                                transition: "all 0.2s ease-in-out",
                                bgcolor: selectedTicket.finalEstimation
                                  ? "action.disabledBackground"
                                  : selectedEstimation === value
                                  ? "primary.light"
                                  : "background.default",
                                color: selectedTicket.finalEstimation
                                  ? "action.disabled"
                                  : selectedEstimation === value
                                  ? "primary.contrastText"
                                  : "text.primary",
                                "&:hover": {
                                  transform: selectedTicket.finalEstimation
                                    ? "none"
                                    : "translateY(-5px)",
                                  bgcolor: selectedTicket.finalEstimation
                                    ? "action.disabledBackground"
                                    : selectedEstimation === value
                                    ? "primary.light"
                                    : "action.hover",
                                },
                              }}
                              onClick={() => handleEstimationSelect(value)}
                            >
                              <Typography
                                variant="h5"
                                component="div"
                                sx={{ fontWeight: "bold" }}
                              >
                                {value}
                              </Typography>
                              {selectedTicket.finalEstimation &&
                                currentUserEstimation === value && (
                                  <Typography variant="caption" color="primary">
                                    Your estimate
                                  </Typography>
                                )}
                            </Paper>
                          ))
                        : ["XS", "S", "M", "L", "XL"].map((value) => (
                            <Paper
                              key={value}
                              elevation={selectedEstimation === value ? 8 : 2}
                              sx={{
                                flex: 1,
                                minWidth: 60,
                                height: 120,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: selectedTicket.finalEstimation
                                  ? "not-allowed"
                                  : "pointer",
                                transition: "all 0.2s ease-in-out",
                                bgcolor: selectedTicket.finalEstimation
                                  ? "action.disabledBackground"
                                  : selectedEstimation === value
                                  ? "primary.light"
                                  : "background.default",
                                color: selectedTicket.finalEstimation
                                  ? "action.disabled"
                                  : selectedEstimation === value
                                  ? "primary.contrastText"
                                  : "text.primary",
                                "&:hover": {
                                  transform: selectedTicket.finalEstimation
                                    ? "none"
                                    : "translateY(-5px)",
                                  bgcolor: selectedTicket.finalEstimation
                                    ? "action.disabledBackground"
                                    : selectedEstimation === value
                                    ? "primary.light"
                                    : "action.hover",
                                },
                              }}
                              onClick={() => handleEstimationSelect(value)}
                            >
                              <Typography
                                variant="h5"
                                component="div"
                                sx={{ fontWeight: "bold" }}
                              >
                                {value}
                              </Typography>
                              {selectedTicket.finalEstimation &&
                                currentUserEstimation === value && (
                                  <Typography variant="caption" color="primary">
                                    Your estimate
                                  </Typography>
                                )}
                            </Paper>
                          ))}
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right panel - User List */}
        <Grid item xs={3} sx={{ height: "100%" }}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
              Users
            </Typography>
            <CardContent
              sx={{
                flex: 1,
                pt: 0,
                px: 2,
                pb: 2,
                overflowY: "auto",
                "&:last-child": { pb: 2 },
              }}
            >
              <UserList users={users} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserView;
