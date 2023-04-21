import React from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { RootLayout, NotFound, Welcome, DashboardLayout } from '@/layouts'
import {
  Home,
  User,
  UserLogin,
  UserRegister,
  GetPerUser,
  CreateUser,
  EditUser,
  Dashboard,
  Note,
  GetPerNote,
  CreateNote,
  EditNote,
  Camera,
  GetPerCamera,
  CreateCamera,
  EditCamera,
} from '@/page'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/*Public Routes*/}
      <Route index element={<Welcome />} />
      <Route path="login" element={<UserLogin />} />
      <Route path="register" element={<UserRegister />} />
      <Route path="*" element={<NotFound />} />
      {/*Private Routes*/}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="user" element={<User />} />
        <Route path="user/create" element={<CreateUser />} />
        <Route path="user/:id" element={<GetPerUser />} />
        <Route path="user/edit/:id" element={<EditUser />} />
        <Route path="note" element={<Note />} />
        <Route path="note/create" element={<CreateNote />} />
        <Route path="note/:id" element={<GetPerNote />} />
        <Route path="note/edit/:id" element={<EditNote />} />
        <Route path="camera" element={<Camera />} />
        <Route path="camera/create" element={<CreateCamera />} />
        <Route path="camera/:id" element={<GetPerCamera />} />
        <Route path="camera/edit/:id" element={<EditCamera />} />
      </Route>
    </Route>,
  ),
)

export default function () {
  return <RouterProvider router={router} />
}
