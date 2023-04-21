import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../env/index.js";
import UserAPI from "./routes/users";
import NoteAPI from "./routes/notes";
// import AuthAPI from "./routes/auth";
import CameraAPI from "./routes/cameras";
import { API, TAGS } from "../../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
});

export const api = createApi({
  reducerPath: TAGS.API,
  baseQuery,
  tagTypes: API.TAGS,
  endpoints: (builder) => ({
    getUsers: UserAPI.get(builder),
    getUserById: UserAPI.getById(builder),
    addUser: UserAPI.add(builder),
    updateUser: UserAPI.updateById(builder),
    deleteUser: UserAPI.deleteById(builder),
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
    // login: AuthAPI.login(builder),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
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
} = api;
