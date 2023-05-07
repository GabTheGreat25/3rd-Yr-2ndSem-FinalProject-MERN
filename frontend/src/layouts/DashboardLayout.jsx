import React, { useState } from "react";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import Breadcrumb from "../component/Breadcrumb";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CameraLayout } from "@/component";
import { useGetCamerasQuery } from "@/state/api/reducer";

export default function () {
  const { data, isLoading, isError } = useGetCamerasQuery();

  const links = [];
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const [cartItems, setCartItems] = useState([]);

  const handleOnAddToCart = (item) => {
    if (!cartItems.some((cartItem) => cartItem._id === item._id)) {
      setCartItems([...cartItems, item]);
    }
  };

  const handleOnRemoveFromCart = (itemToRemove) => {
    const newCartItems = cartItems.filter(
      (cartItem) => cartItem._id !== itemToRemove._id
    );
    setCartItems(newCartItems);
  };

  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const isCustomer = auth.user?.roles?.includes("Customer");

  return (
    <>
      <Box sx={{ display: "flex", position: "relative", zIndex: 1 }}>
        <Navbar
          open={isOpen}
          toggleDrawer={toggleDrawer}
          cartItems={cartItems}
          onRemoveFromCart={handleOnRemoveFromCart}
          onAddToCart={handleOnAddToCart}
        />
        <Sidebar open={isOpen} toggleDrawer={toggleDrawer} links={links} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "90vh",
            overflow: "auto",
            marginBottom: "2rem",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Breadcrumb />
            <Outlet />
            {location.pathname === "/dashboard" && isCustomer && (
              <CameraLayout
                data={data?.details}
                onAddToCart={handleOnAddToCart}
                cartItems={cartItems}
                onRemoveFromCart={handleOnRemoveFromCart}
              />
            )}
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
