import React, { useState } from "react";
import { useGetCamerasQuery } from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { CameraLayout } from "@/component";
import CartPreview from "../Transactions/CartPreview";

export default function () {
  const { data, isLoading, isError } = useGetCamerasQuery();
  const [cartItems, setCartItems] = useState([]);

  const handleOnAddToCart = (item) => {
    if (!cartItems.some((cartItem) => cartItem._id === item._id)) {
      setCartItems([...cartItems, item]);
    }
  };

  const handleOnRemoveFromCart = (itemToRemove) => {
    const newCartItems = cartItems.filter((cartItem, index) => {
      return (
        cartItem._id !== itemToRemove._id ||
        (cartItem._id === itemToRemove._id &&
          cartItems.indexOf(cartItem) !== index)
      );
    });
    setCartItems(newCartItems);
  };

  return (
    <>
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
          <CartPreview
            cartItems={cartItems}
            onRemoveFromCart={handleOnRemoveFromCart}
          />
        </>
      )}
    </>
  );
}
