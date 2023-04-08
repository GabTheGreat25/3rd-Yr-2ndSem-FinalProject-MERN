import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { RootLayout, NotFound, Welcome } from "@/layouts";
import { Home, Test, UserLogin, UserRegister } from "@/page";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/*Public Routes*/}
      <Route index element={<Welcome />} />
      <Route path="login" element={<UserLogin />} />
      <Route path="register" element={<UserRegister />} />
      <Route path="*" element={<NotFound />} />
      {/*Private Routes*/}
      <Route path="dashboard">
        <Route index element={<Home />} />
        <Route path="test" element={<Test />} />
      </Route>
    </Route>
  )
);

export default function () {
  return <RouterProvider router={router} />;
}
