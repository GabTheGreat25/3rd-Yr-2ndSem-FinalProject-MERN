import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth/authReducer";
import sideBar from "./sidebar/authSideBar";
import { api } from "./api/reducer";

export const rootReducer = combineReducers({
  auth,
  sideBar,
  [api.reducerPath]: api.reducer,
});
