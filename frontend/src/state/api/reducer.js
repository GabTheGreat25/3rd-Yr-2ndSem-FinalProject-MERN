import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../env/index.js";
import UserAPI from "./routes/users";
import NoteAPI from "./routes/notes";
import AuthAPI from "./routes/auth";
import CameraAPI from "./routes/cameras";
import { API, TAGS } from "../../constants";

const prepareHeaders = (headers, { getState }) => {
  if (getState().auth.authenticated) {
    headers.set("authorization", `Bearer ${getState().auth.token || ""}`);
  }
  headers.set("accept", `application/json`);
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders,
});

export const api = createApi({
  reducerPath: TAGS.API,
  baseQuery,
  tagTypes: API.TAGS,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getUsers: UserAPI.get(builder),
    getUserById: UserAPI.getById(builder),
    addUser: UserAPI.add(builder),
    updateUser: UserAPI.updateById(builder),
    deleteUser: UserAPI.deleteById(builder),
    updatePassword: UserAPI.updatePasswordById(builder),
    forgotPassword: UserAPI.forgotPassword(builder),
    resetPassword: UserAPI.resetPassword(builder),
    getNotes: NoteAPI.get(builder),
    getNoteById: NoteAPI.getById(builder),
    addNote: NoteAPI.add(builder),
    updateNote: NoteAPI.updateById(builder),
    deleteNote: NoteAPI.deleteById(builder),
    getCameras: CameraAPI.get(builder),
    getCameraById: CameraAPI.getById(builder),
    addCamera: CameraAPI.add(builder),
    updateCamera: CameraAPI.updateById(builder),
    deleteCamera: CameraAPI.deleteById(builder),
    login: AuthAPI.login(builder),
    logout: AuthAPI.logout(builder),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdatePasswordMutation,
  useGetNotesQuery,
  useGetNoteByIdQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useGetCamerasQuery,
  useGetCameraByIdQuery,
  useAddCameraMutation,
  useUpdateCameraMutation,
  useDeleteCameraMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = api;
