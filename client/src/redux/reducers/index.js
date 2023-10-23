import { combineReducers } from "redux";
import booksReducer from "./bookReducer";

const rootReducer = combineReducers({
  books: booksReducer,
});

export default rootReducer;
