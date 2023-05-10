import React from "react";
import { RESOURCE } from "@/constants";

export default function ({ images }) {
  return (
    <>
      {images?.map((image, index) => (
        <span key={index}>
          <img
            height={RESOURCE.NUMBER.SIXTY}
            width={RESOURCE.NUMBER.SEVENTY_FIVE}
            src={URL.createObjectURL(image)}
            alt={image?.originalname}
            key={image?.public_id}
          />
        </span>
      ))}
    </>
  );
}
