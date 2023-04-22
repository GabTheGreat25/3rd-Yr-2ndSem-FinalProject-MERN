import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
  },
  reducers: {
    setToken(state, action) {
      console.log("test token", action.payload);
      state.token = action.payload;
      console.log("New token:", state.token);
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
