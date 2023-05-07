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

  return <></>;
}
