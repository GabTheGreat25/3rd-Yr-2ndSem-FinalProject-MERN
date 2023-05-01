import React from "react";
import { useGetCamerasQuery } from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { CameraLayout } from "@/component";

export default function () {
  const { data, isLoading, isError } = useGetCamerasQuery();

  const handleOnAddToCart = () => {};

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_CAMERAS_ERROR}</div>
      ) : (
        <CameraLayout data={data?.details} onAddToCart={handleOnAddToCart} />
      )}
    </>
  );
}
