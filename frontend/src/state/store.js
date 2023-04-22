import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/reducer";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./api/slice/authSlice";
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
