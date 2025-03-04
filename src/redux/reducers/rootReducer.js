import { combineReducers } from "redux";
import selectedTicketReducer from "./selectedTicketReducer";

// Placeholder reducer
const initialState = {};
const placeholderReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  placeholder: placeholderReducer,
  selectedTicket: selectedTicketReducer, // Add other reducers here
});

export default rootReducer;
