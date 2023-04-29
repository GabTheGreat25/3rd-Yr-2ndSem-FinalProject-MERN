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
  UpdatePassword,
  UpdateUserInfo,
  Comments,
} from "@/page";
import { ProtectedRoute, UnprotectedRoute } from "./component";
import { USER } from "./constants";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/*Public Routes*/}
      <Route path="*" element={<NotFound />} />
      <Route
        index
        element={
          <UnprotectedRoute>
            <Welcome />
          </UnprotectedRoute>
        }
      />
      <Route
        path="login"
        element={
          <UnprotectedRoute>
            <UserLogin />
          </UnprotectedRoute>
        }
      />
      <Route
        path="register"
        element={
          <UnprotectedRoute>
            <UserRegister />
          </UnprotectedRoute>
        }
      />
      <Route
        path="Forgotpassword"
        element={
          <UnprotectedRoute>
            <ForgotPassword />
          </UnprotectedRoute>
        }
      />
      <Route
        path="password/reset/:id"
        element={
          <UnprotectedRoute>
            <ResetPassword />
          </UnprotectedRoute>
        }
      />
      {/*Private Routes*/}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route
          index
          element={
            <ProtectedRoute
              userRoles={[USER.ADMIN, USER.EMPLOYEE, USER.CUSTOMER]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="updatePassword/:id"
          element={
            <ProtectedRoute
              userRoles={[USER.ADMIN, USER.EMPLOYEE, USER.CUSTOMER]}
            >
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="userDetails/:id"
          element={
            <ProtectedRoute
              userRoles={[USER.ADMIN, USER.EMPLOYEE, USER.CUSTOMER]}
            >
              <UpdateUserInfo />
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
          path="user/create"
          element={
            <ProtectedRoute userRoles={[USER.ADMIN]}>
              <CreateUser />
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
        <Route
          path="comment"
          element={
            <ProtectedRoute
              userRoles={[USER.ADMIN, USER.EMPLOYEE, USER.CUSTOMER]}
            >
              <Comments />
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
