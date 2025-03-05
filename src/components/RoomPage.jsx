import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import JiraTicketList from "./JiraTicketList";
import UserList from "./UserList";
import UserView from "./UserView";
import theme from "../themes/theme";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTicket } from "../redux/actions/selectedTicketActions";

const RoomPage = () => {
  const { roomName: roomNameParam, creatorName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [jiraTickets, setJiraTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const selectedTicket = useSelector((state) => state.selectedTicket);
  const dispatch = useDispatch();
  const [finalEstimation, setFinalEstimation] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [estimationType, setEstimationType] = useState("Fibonacci");
  const [ticketEstimations, setTicketEstimations] = useState({});
  const [displayRoomName, setDisplayRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Wrap loadUsers in useCallback
  const loadUsers = useCallback(() => {
    const normalizedRoomName = roomNameParam.toLowerCase();
    const storedUsers = JSON.parse(
      localStorage.getItem(`roomUsers_${normalizedRoomName}`) || "[]"
    );
    setUsers(storedUsers);
  }, [roomNameParam]);

  // Wrap notifyUserUpdate in useCallback
  const notifyUserUpdate = useCallback(
    (updatedUsers) => {
      const normalizedRoomName = roomNameParam.toLowerCase();
      localStorage.setItem(
        `roomUsers_${normalizedRoomName}`,
        JSON.stringify(updatedUsers)
      );
      setUsers(updatedUsers);
    },
    [roomNameParam]
  );

  // Update the periodic refresh effect
  useEffect(() => {
    loadUsers();

    const interval = setInterval(() => {
      loadUsers();
    }, 1000);

    return () => clearInterval(interval);
  }, [loadUsers]);

  // Update room access check effect
  useEffect(() => {
    const roomAdmin = localStorage.getItem("roomAdmin");
    const currentPath = window.location.pathname;
    const userName =
      searchParams.get("name") || localStorage.getItem("userName");
    const normalizedRoomName = roomNameParam.toLowerCase();

    if (searchParams.get("name")) {
      localStorage.setItem("userName", searchParams.get("name"));
    }

    const existingUsers = JSON.parse(
      localStorage.getItem(`roomUsers_${normalizedRoomName}`) || "[]"
    );

    // Set creator status based on roomAdmin
    const creatorStatus = roomAdmin === userName;
    setIsCreator(creatorStatus);

    let updatedUsers = [...existingUsers];
    let shouldUpdateUsers = false;

    // Always ensure admin is in the users list
    if (roomAdmin === creatorName) {
      const adminExists = existingUsers.some(
        (user) => user.name === `${creatorName} - Admin`
      );

      if (!adminExists) {
        updatedUsers = [
          {
            name: `${creatorName} - Admin`,
            isAdmin: true,
          },
          ...updatedUsers.filter((user) => !user.name.includes(creatorName)),
        ];
        shouldUpdateUsers = true;
      }
    }

    // Add other users if they're not the admin
    if (userName && !creatorStatus) {
      const userExists = existingUsers.some((user) => user.name === userName);

      if (!userExists) {
        updatedUsers = [
          ...updatedUsers,
          {
            name: userName,
            isAdmin: false,
          },
        ];
        shouldUpdateUsers = true;
      }
    }

    if (shouldUpdateUsers) {
      notifyUserUpdate(updatedUsers);
    } else {
      setUsers(existingUsers);
    }

    if (currentPath.includes("/room/") && !roomAdmin && !userName) {
      const invitePath = currentPath.replace("/room/", "/invite/");
      navigate(invitePath);
    }
  }, [navigate, searchParams, roomNameParam, creatorName, notifyUserUpdate]);

  // Set estimation type from localStorage
  useEffect(() => {
    const savedEstimationType = localStorage.getItem("estimationType");
    if (savedEstimationType) {
      setEstimationType(
        savedEstimationType === "fibonacci" ? "Fibonacci" : "tshirt"
      );
    }
  }, []);

  // Handle room name setup
  useEffect(() => {
    if (roomNameParam && roomNameParam.trim() !== "") {
      const formattedRoomName = roomNameParam.replace(/-/g, " ").toLowerCase();
      setDisplayRoomName(formattedRoomName);
    } else {
      setDisplayRoomName("default room");
    }
    setIsLoading(false);
  }, [roomNameParam]);

  // Add this effect for JIRA tickets initialization
  useEffect(() => {
    setJiraTickets([
      {
        id: 1,
        key: "PROJECT-1",
        title: "Implement User Authentication",
        description: "Users should be able to sign up and log in securely.",
        estimate: null,
      },
      {
        id: 2,
        key: "PROJECT-2",
        title: "Design Database Schema",
        description: "Create an optimized relational database schema.",
        estimate: null,
      },
    ]);
  }, []);

  useEffect(() => {
    const storedTicket = localStorage.getItem("selectedTicket");
    if (storedTicket) {
      dispatch(setSelectedTicket(JSON.parse(storedTicket)));
    }
  }, [dispatch]);

  const handleTicketSelect = useCallback(
    (ticket) => {
      if (isCreator) {
        localStorage.setItem("selectedTicket", JSON.stringify(ticket));
        dispatch(setSelectedTicket(ticket));
      }
    },
    [isCreator, dispatch]
  );

  const handleClearEstimation = useCallback(() => {
    if (selectedTicket) {
      const updatedEstimations = { ...ticketEstimations };
      delete updatedEstimations[selectedTicket.id];
      setTicketEstimations(updatedEstimations);

      setJiraTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === selectedTicket.id
            ? { ...ticket, estimate: undefined }
            : ticket
        )
      );

      setFinalEstimation("");
    }
  }, [selectedTicket, ticketEstimations]);

  const handleSaveEstimation = useCallback(() => {
    if (selectedTicket) {
      const updatedTicket = {
        ...selectedTicket,
        finalEstimation: finalEstimation,
        userEstimations: users.reduce(
          (acc, user) => ({
            ...acc,
            [user.name]: user.estimation,
          }),
          {}
        ),
      };

      localStorage.setItem("selectedTicket", JSON.stringify(updatedTicket));
      dispatch(setSelectedTicket(updatedTicket));

      setJiraTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === selectedTicket.id ? updatedTicket : ticket
        )
      );

      setFinalEstimation("");
    }
  }, [selectedTicket, finalEstimation, users, dispatch]);

  useEffect(() => {}, [jiraTickets]);

  useEffect(() => {}, [selectedTicket]);

  const estimationOptions =
    estimationType === "Fibonacci"
      ? [1, 2, 3, 5, 8, 13, 21]
      : ["XS", "S", "M", "L", "XL"];

  const onUpdateUsers = useCallback(
    (updatedUsers) => {
      setUsers(updatedUsers);
      const normalizedRoomName = roomNameParam.toLowerCase();
      localStorage.setItem(
        `roomUsers_${normalizedRoomName}`,
        JSON.stringify(updatedUsers)
      );
    },
    [roomNameParam]
  );

  return (
    <ThemeProvider theme={theme}>
      {isLoading ? (
        <Typography variant="h4" align="center" sx={{ mt: 14, mb: 2 }}>
          Loading...
        </Typography>
      ) : (
        <>
          <Typography
            variant="h5"
            align="center"
            sx={{ mt: 14, mb: 2, color: "primary.main", fontWeight: 500 }}
          >
            Welcome to our team {displayRoomName}
          </Typography>

          {isCreator ? (
            // Admin View - Always show this when isCreator is true
            <Box
              sx={{
                flexGrow: 1,
                height: "calc(100vh - 160px)",
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
                {/* Left panel - Jira Tickets */}
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
                      <JiraTicketList
                        tickets={jiraTickets}
                        onSelect={handleTicketSelect}
                      />
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
                    <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
                      Ticket Details
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
                                  {selectedTicket.summary ||
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

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                              mt: 2,
                            }}
                          >
                            <Select
                              value={finalEstimation}
                              onChange={(e) =>
                                setFinalEstimation(e.target.value)
                              }
                              size="small"
                              sx={{
                                minWidth: 120,
                                bgcolor: "background.paper",
                              }}
                            >
                              {estimationOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleSaveEstimation}
                              sx={{ ml: 1 }}
                              size="medium"
                            >
                              Save
                            </Button>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={handleClearEstimation}
                              sx={{ ml: 1 }}
                              size="medium"
                            >
                              Clear
                            </Button>
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

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
                      <UserList users={users} isCreator={isCreator} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          ) : (
            // User View - Only show this when isCreator is false
            <UserView
              tickets={jiraTickets}
              users={users}
              estimationType={estimationType}
              onUpdateUsers={onUpdateUsers}
            />
          )}
        </>
      )}
    </ThemeProvider>
  );
};

export default RoomPage;
