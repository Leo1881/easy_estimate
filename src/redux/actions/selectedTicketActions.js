import { SET_SELECTED_TICKET } from "../actionTypes";

export const setSelectedTicket = (ticket) => ({
  type: SET_SELECTED_TICKET,
  payload: ticket,
});
