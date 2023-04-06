import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Navbar, Sidebar, Footer } from "@/component";
import { RootLayout, NotFound, Welcome } from "@/layouts";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/*Public Routes*/}
      <Route index element={<Welcome />} />
      <Route path="*" element={<NotFound />} />
      <Route path="navbar" element={<Navbar />} />
      <Route path="sidebar" element={<Sidebar />} />
      <Route path="footer" element={<Footer />} />
    </Route>
  )
);

export default function () {
  return <RouterProvider router={router} />;
}
