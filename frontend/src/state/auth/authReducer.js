import { createSlice } from "@reduxjs/toolkit";
import { api } from "../api/reducer";
import { initialState } from "./state";

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = "";
      state.user = {};
      state.authenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        if (payload?.success === true) {
          state.token = payload?.details?.accessToken;
          state.user = payload?.details?.user;
          state.authenticated = true;
        }
      }
    );
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
