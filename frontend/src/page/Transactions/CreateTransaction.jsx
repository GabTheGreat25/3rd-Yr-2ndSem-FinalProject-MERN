import React from "react";
import { useGetCamerasQuery } from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { CameraLayout } from "@/component";

export default function () {
  const { data, isLoading, isError } = useGetCamerasQuery();
  console.log(data.details);

  const handleOnAddToCart = () => {};

  return (
    <>
      <CameraLayout data={data?.details} onAddToCart={handleOnAddToCart} />
    </>
  );
}
