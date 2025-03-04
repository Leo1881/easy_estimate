import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Paper } from "@mui/material";
import JiraTicketList from "./JiraTicketList";
import UserList from "./UserList";
import { useSelector } from "react-redux";

const UserView = ({ tickets, users, estimationType, onUpdateUsers }) => {
  const [selectedEstimation, setSelectedEstimation] = useState(null);
  const [localSelectedTicket, setLocalSelectedTicket] = useState(null);
  const [localUserEstimations, setLocalUserEstimations] = useState({});
  const selectedTicket = useSelector((state) => state.selectedTicket);

  // Add polling effect to check for ticket updates
  useEffect(() => {
    const checkForTicketUpdates = () => {
      // Check both localStorage and Redux store
      const storedTicket = localStorage.getItem("selectedTicket");
      const ticketToUse = storedTicket
        ? JSON.parse(storedTicket)
        : selectedTicket;

      if (
        ticketToUse &&
        JSON.stringify(ticketToUse) !== JSON.stringify(localSelectedTicket)
      ) {
        console.log("Ticket updated:", ticketToUse);
        setLocalSelectedTicket(ticketToUse);

        // If there are saved user estimations for this ticket, load them
        if (ticketToUse.userEstimations) {
          setLocalUserEstimations(ticketToUse.userEstimations);
          // Set the current user's estimation if it exists
          const currentUserName = localStorage.getItem("userName");
          if (ticketToUse.userEstimations[currentUserName]) {
            setSelectedEstimation(ticketToUse.userEstimations[currentUserName]);
          }
        } else {
          setLocalUserEstimations({});
          setSelectedEstimation(null);
        }
      }
    };

    // Initial check
    checkForTicketUpdates();

    // Set up polling interval
    const interval = setInterval(checkForTicketUpdates, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, [localSelectedTicket, selectedTicket]);

  // Add effect to log state changes
  useEffect(() => {
    console.log("UserView State Update:", {
      localSelectedTicket,
      selectedTicket,
      finalEstimation: localSelectedTicket?.finalEstimation,
      userEstimations: localUserEstimations,
    });
  }, [localSelectedTicket, selectedTicket, localUserEstimations]);

  const handleEstimationSelect = (value) => {
    // Only allow estimation if the ticket doesn't have a final estimation
    if (!localSelectedTicket?.finalEstimation) {
      setSelectedEstimation(value === selectedEstimation ? null : value);
      const currentUserName = localStorage.getItem("userName");
      const updatedUsers = users.map((user) =>
        user.name === currentUserName ? { ...user, estimation: value } : user
      );
      onUpdateUsers(updatedUsers);
    }
  };

  // Get the current user's name and their estimation for this ticket
  const currentUserName = localStorage.getItem("userName");
  const currentUserEstimation = localUserEstimations[currentUserName];

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "calc(100vh - 100px)",
        width: "95%",
        mx: "auto",
        "& *": { transition: "none !important" },
      }}
    >
      <Box sx={{ height: "100%" }}>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          {/* Left panel - Ticket List */}
          <Grid item xs={3}>
            <Card
              sx={{
                height: "100%",
                overflowY: "auto",
                bgcolor: "background.paper",
                boxShadow: 3,
              }}
            >
              <CardContent>
                <JiraTicketList
                  tickets={tickets}
                  onSelect={() => {}} // Empty function since users can't select tickets
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Middle panel - Ticket Details */}
          <Grid item xs={6}>
            <Card
              sx={{
                height: "95.8%",
                padding: 2,
                bgcolor: "background.paper",
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: 2,
                    color: "primary.main",
                    fontWeight: 500,
                  }}
                >
                  JIRA Ticket Details
                </Typography>
                {localSelectedTicket && (
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
                            {localSelectedTicket.id}
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
                            {localSelectedTicket.title}
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
                            {localSelectedTicket.summary ||
                              "No summary provided"}
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
                            {localSelectedTicket.description}
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
                            {localSelectedTicket.details ||
                              "No additional details available"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Show final estimation if it exists */}
                    {localSelectedTicket.finalEstimation && (
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
                          Final Estimation:{" "}
                          {localSelectedTicket.finalEstimation}
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
                                  height: 90,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: localSelectedTicket.finalEstimation
                                    ? "not-allowed"
                                    : "pointer",
                                  transition: "all 0.2s ease-in-out",
                                  bgcolor: localSelectedTicket.finalEstimation
                                    ? "action.disabledBackground"
                                    : selectedEstimation === value
                                    ? "primary.light"
                                    : "background.default",
                                  color: localSelectedTicket.finalEstimation
                                    ? "action.disabled"
                                    : selectedEstimation === value
                                    ? "primary.contrastText"
                                    : "text.primary",
                                  "&:hover": {
                                    transform:
                                      localSelectedTicket.finalEstimation
                                        ? "none"
                                        : "translateY(-5px)",
                                    bgcolor: localSelectedTicket.finalEstimation
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
                                {localSelectedTicket.finalEstimation &&
                                  currentUserEstimation === value && (
                                    <Typography
                                      variant="caption"
                                      color="primary"
                                    >
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
                                  height: 90,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: localSelectedTicket.finalEstimation
                                    ? "not-allowed"
                                    : "pointer",
                                  transition: "all 0.2s ease-in-out",
                                  bgcolor: localSelectedTicket.finalEstimation
                                    ? "action.disabledBackground"
                                    : selectedEstimation === value
                                    ? "primary.light"
                                    : "background.default",
                                  color: localSelectedTicket.finalEstimation
                                    ? "action.disabled"
                                    : selectedEstimation === value
                                    ? "primary.contrastText"
                                    : "text.primary",
                                  "&:hover": {
                                    transform:
                                      localSelectedTicket.finalEstimation
                                        ? "none"
                                        : "translateY(-5px)",
                                    bgcolor: localSelectedTicket.finalEstimation
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
                                {localSelectedTicket.finalEstimation &&
                                  currentUserEstimation === value && (
                                    <Typography
                                      variant="caption"
                                      color="primary"
                                    >
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
          <Grid item xs={3}>
            <Card
              sx={{
                height: "100%",
                overflowY: "auto",
                bgcolor: "background.paper",
                boxShadow: 3,
              }}
            >
              <CardContent>
                <UserList users={users} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserView;
