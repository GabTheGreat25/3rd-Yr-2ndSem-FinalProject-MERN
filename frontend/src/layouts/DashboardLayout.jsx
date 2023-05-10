import React, { useState } from "react";
import Footer from "@component/Footer";
import Navbar from "@component/Navbar";
import Sidebar from "@component/Sidebar";
import Breadcrumb from "@component/Breadcrumb";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CameraLayout } from "@/component";
import { useGetCamerasQuery } from "@api";
import { ERROR, RESOURCE, USER } from "@/constants";
import { PacmanLoader } from "react-spinners";

export default function () {
  const { data, isLoading, isError } = useGetCamerasQuery();

  const links = [];
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen(!isOpen);

  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(RESOURCE.NUMBER.ZERO);

  const handleOnAddToCart = (item) => {
    if (!cartItems.some((cartItem) => cartItem._id === item._id)) {
      setCartItems([...cartItems, item]);
      setCartCount(cartCount + RESOURCE.NUMBER.ONE);
    }
  };

  const handleOnRemoveFromCart = (itemToRemove) => {
    const newCartItems = cartItems.filter(
      (cartItem) => cartItem._id !== itemToRemove._id
    );
    setCartItems(newCartItems);
    setCartCount(cartCount - RESOURCE.NUMBER.ONE);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setCartCount(RESOURCE.NUMBER.ZERO);
  };

  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const isCustomer = auth.user?.roles?.includes(USER.CUSTOMER);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          zIndex: RESOURCE.NUMBER.ONE,
        }}
      >
        <Navbar
          open={isOpen}
          toggleDrawer={toggleDrawer}
          cartItems={cartItems}
          onRemoveFromCart={handleOnRemoveFromCart}
          onAddToCart={handleOnAddToCart}
          cartCount={cartCount}
          clearCart={handleClearCart}
        />
        <Sidebar open={isOpen} toggleDrawer={toggleDrawer} links={links} />
        <Box
          component="main"
          sx={{
            flexGrow: RESOURCE.NUMBER.ONE,
            height: "90vh",
            overflow: "auto",
            marginBottom: "2rem",
          }}
        >
          <Toolbar />
          <Container
            maxWidth="lg"
            sx={{ mt: RESOURCE.NUMBER.FOUR, mb: RESOURCE.NUMBER.FOUR }}
          >
            <Breadcrumb />
            <Outlet />
            <>
              {isLoading ? (
                <div className="loader">
                  <PacmanLoader
                    color="#2c3e50"
                    loading={true}
                    size={RESOURCE.NUMBER.FIFTY}
                  />
                </div>
              ) : isError ? (
                <div className="errorMessage">{ERROR.GET_CAMERAS_ERROR}</div>
              ) : (
                location.pathname === "/dashboard" &&
                isCustomer && (
                  <CameraLayout
                    data={data?.details}
                    onAddToCart={handleOnAddToCart}
                    cartItems={cartItems}
                    onRemoveFromCart={handleOnRemoveFromCart}
                  />
                )
              )}
            </>
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
