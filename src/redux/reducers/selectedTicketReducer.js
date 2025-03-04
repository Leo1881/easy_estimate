// src/redux/reducers/selectedTicketReducer.js
import { SET_SELECTED_TICKET } from "../actions/selectedTicketActions";

const initialState = null;

const selectedTicketReducer = (state = initialState, action) => {
  console.log("Reducer called with action:", action);
  switch (action.type) {
    case SET_SELECTED_TICKET:
      console.log("Setting selected ticket:", action.payload);
      return action.payload;
    default:
      return state;
  }
};

export default selectedTicketReducer;
