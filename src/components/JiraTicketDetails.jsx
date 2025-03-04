import React from "react";
import { Typography } from "@mui/material";

const JiraTicketDetails = ({ ticket }) => {
  return (
    <div>
      <Typography variant="h6">{ticket.title}</Typography>
    </div>
  );
};

export default JiraTicketDetails;
