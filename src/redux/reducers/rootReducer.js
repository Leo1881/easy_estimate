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
  selectedTicket: selectedTicketReducer,
});

export default rootReducer;
