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
} from "@/page";

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
        <Route index element={<Home />} />
        <Route path="user" element={<User />} />
        <Route path="user/create" element={<CreateUser />} />
        <Route path="user/:id" element={<GetPerUser />} />
      </Route>
    </Route>
  )
);

export default function () {
  return <RouterProvider router={router} />;
}
