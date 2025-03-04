import React from "react";
import {
  List,
  ListItem,
  Card,
  CardContent,
  Typography,
  Box,
  Badge,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const UserList = ({ users }) => {
  return (
    <Box sx={{ padding: 2, height: "100%", overflowY: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Team Members
      </Typography>
      <List sx={{ height: "100%" }}>
        {users.map((user, index) => (
          <ListItem key={index} disablePadding>
            <Card
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: 1,
                marginBottom: 2,
              }}
            >
              <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                <CardContent
                  sx={{
                    padding: "8px",
                    "&:last-child": { paddingBottom: "8px" },
                  }}
                >
                  <Typography variant="body1">{user.name}</Typography>
                </CardContent>
              </Box>

              {user.name.includes("Admin") ? (
                <Avatar
                  sx={{
                    bgcolor: user.estimate ? "primary.main" : "grey.300",
                    width: "40px",
                    height: "40px",
                    marginRight: 2,
                    color: user.estimate ? "white" : "text.primary",
                  }}
                >
                  <PersonIcon />
                </Avatar>
              ) : (
                <Badge
                  badgeContent={user.estimation || "?"}
                  sx={{
                    "& .MuiBadge-badge": {
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      fontSize: "1.2rem",
                      backgroundColor: user.estimation
                        ? "primary.main"
                        : "grey.300",
                      color: user.estimation ? "white" : "text.primary",
                      fontWeight: "bold",
                      right: 37,
                      top: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  }}
                >
                  <Box sx={{ width: "45px" }} />
                </Badge>
              )}
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserList;
