import { SET_SELECTED_TICKET } from "../actionTypes";

const initialState = null;

const selectedTicketReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_TICKET:
      return action.payload;
    default:
      return state;
  }
};

export default selectedTicketReducer;
