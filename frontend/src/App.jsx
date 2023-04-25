import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { RootLayout, NotFound, Welcome, DashboardLayout } from "@/layouts";
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
  ForgotPassword,
  ResetPassword,
} from "@/page";
import { ProtectedRoute } from "./component";
import { USER } from "./constants";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/*Public Routes*/}
      <Route index element={<Welcome />} />
      <Route path="login" element={<UserLogin />} />
      <Route path="register" element={<UserRegister />} />
      <Route path="user/create" element={<CreateUser />} />
      <Route path="*" element={<NotFound />} />
      <Route path="Forgotpassword" element={<ForgotPassword />} />
      <Route path="password/reset/:id" element={<ResetPassword />} />
      {/*Private Routes*/}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route
          index
          element={
            <ProtectedRoute userRoles={[USER.ADMIN, USER.EMPLOYEE]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="user"
          element={
            <ProtectedRoute userRoles={[USER.ADMIN]}>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/:id"
          element={
            <ProtectedRoute userRoles={[USER.ADMIN]}>
              <GetPerUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/edit/:id"
          element={
            <ProtectedRoute
              userRoles={[USER.ADMIN, USER.EMPLOYEE, USER.CUSTOMER]}
            >
              <EditUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="note"
          element={
            <ProtectedRoute userRoles={[USER.ADMIN, USER.EMPLOYEE]}>
              <Note />
            </ProtectedRoute>
          }
        />
        <Route
          path="note/create"
          element={
            <ProtectedRoute userRoles={[USER.ADMIN]}>
              <CreateNote />
            </ProtectedRoute>
          }
        />
        <Route
          path="note/:id"
          element={
            <ProtectedRoute userRoles={[USER.ADMIN, USER.EMPLOYEE]}>
              <GetPerNote />
            </ProtectedRoute>
          }
        />
        <Route
          path="note/edit/:id"
          element={
            <ProtectedRoute userRoles={[USER.ADMIN]}>
              <EditNote />
            </ProtectedRoute>
          }
        />
        <Route
          path="camera"
          element={
            <ProtectedRoute
              userRoles={[USER.ADMIN, USER.EMPLOYEE, USER.CUSTOMER]}
            >
              <Camera />
            </ProtectedRoute>
          }
        />
        <Route
          path="camera/create"
          element={
            <ProtectedRoute userRoles={[USER.ADMIN, USER.EMPLOYEE]}>
              <CreateCamera />
            </ProtectedRoute>
          }
        />
        <Route
          path="camera/:id"
          element={
            <ProtectedRoute
              userRoles={[USER.ADMIN, USER.EMPLOYEE, USER.CUSTOMER]}
            >
              <GetPerCamera />
            </ProtectedRoute>
          }
        />
        <Route
          path="camera/edit/:id"
          element={
            <ProtectedRoute userRoles={[USER.ADMIN, USER.EMPLOYEE]}>
              <EditCamera />
            </ProtectedRoute>
          }
        />
      </Route>
    </Route>
  )
);

export default function () {
  return <RouterProvider router={router} />;
}
