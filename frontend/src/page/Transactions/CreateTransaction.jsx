import React, { useState } from "react";
import {
  useGetCamerasQuery,
  useAddTransactionMutation,
} from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { CameraLayout } from "@/component";
import Navbar from "../../component/Navbar";

export default function () {
  const { data, isLoading, isError } = useGetCamerasQuery();

  const [cartItems, setCartItems] = useState([]);

  const [cartCount, setCartCount] = useState(0);

  const handleOnAddToCart = (item) => {
    if (!cartItems.some((cartItem) => cartItem._id === item._id)) {
      setCartItems([...cartItems, item]);
      setCartCount(cartCount + 1);
    }
  };

  const handleOnRemoveFromCart = (itemToRemove) => {
    const newCartItems = cartItems.filter(
      (cartItem) => cartItem._id !== itemToRemove._id
    );
    setCartItems(newCartItems);
    setCartCount(cartCount - 1);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Navbar
        cartItems={cartItems}
        onRemoveFromCart={handleOnRemoveFromCart}
        onAddToCart={handleOnAddToCart}
        cartCount={cartCount}
        open={isOpen}
        toggleDrawer={toggleDrawer}
      />
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_CAMERAS_ERROR}</div>
      ) : (
        <>
          <CameraLayout
            data={data?.details}
            onAddToCart={handleOnAddToCart}
            cartItems={cartItems}
          />
        </>
      )}
    </>
  );
}
