import React from "react";
import {
  List,
  ListItem,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const JiraTicketList = ({ tickets, onSelect }) => {
  return (
    <Box sx={{ padding: 2, height: "100%", overflowY: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        JIRA Stories
      </Typography>
      <List sx={{ height: "100%" }}>
        {tickets.map((ticket) => (
          <ListItem key={ticket.id} disablePadding>
            <Card
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: 1,
                marginBottom: 2,
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => onSelect(ticket)}
            >
              <Box sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {ticket.id}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", marginTop: 1, marginBottom: 1 }}
                  >
                    {ticket.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {ticket.description || "No description available"}
                  </Typography>
                </CardContent>
              </Box>
              <Box
                sx={{
                  minWidth: "40px",
                  minHeight: "40px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: ticket.estimate
                    ? "primary.main"
                    : "grey.300",
                  color: ticket.estimate ? "white" : "text.primary",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 2,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  flexShrink: 0,
                  fontFamily: (theme) => theme.typography.fontFamily,
                }}
              >
                {ticket.estimate || "?"}
              </Box>
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default JiraTicketList;
