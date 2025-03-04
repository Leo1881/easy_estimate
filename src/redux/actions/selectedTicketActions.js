// src/redux/actions/selectedTicketActions.js
export const SET_SELECTED_TICKET = "SET_SELECTED_TICKET";

export const setSelectedTicket = (ticket) => ({
  type: SET_SELECTED_TICKET,
  payload: ticket,
});
