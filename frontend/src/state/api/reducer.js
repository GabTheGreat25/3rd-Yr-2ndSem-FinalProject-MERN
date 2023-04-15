import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../env/index.js";
import UserAPI from "./routes/users";
import { API } from "../../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: API.TAGS,
  endpoints: (builder) => ({
    getUsers: UserAPI.get(builder),
    getUserById: UserAPI.getById(builder),
    addUser: UserAPI.add(builder),
    updateUser: UserAPI.updateById(builder),
    deleteUser: UserAPI.deleteById(builder),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = api;
