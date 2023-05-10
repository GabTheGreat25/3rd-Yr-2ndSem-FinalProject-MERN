import React from "react";
import { useParams } from "react-router-dom";
import { useGetCameraByIdQuery } from "@api";
import { Card, CardContent, Typography } from "@mui/material";
import { ERROR, TAGS, RESOURCE } from "@/constants";
import { PacmanLoader } from "react-spinners";

export default function () {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetCameraByIdQuery(id, {
    populate: TAGS.USER,
  });

  const { name, text, price, image } = data?.details ?? {};

  return (
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
        <Card
          sx={{
            margin: "auto",
            width: "50%",
            textAlign: "center",
            backgroundColor: "#2c3e50",
            color: "#f1f2f6",
            borderRadius: ".75rem",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Camera Details
            </Typography>
            <Typography sx={{ mb: RESOURCE.NUMBER.ONE_POINT_FIVE }}>
              ID: {id}
            </Typography>
            {image?.map((image) => (
              <img
                style={{ padding: "0 .5rem" }}
                height={RESOURCE.NUMBER.HUNDRED_FIFTY}
                width={RESOURCE.NUMBER.HUNDRED_FIFTY}
                src={image?.url}
                alt={image?.originalname}
                key={image?.public_id}
              />
            ))}
            <Typography variant="body2">
              <strong>Name:</strong> {name}
            </Typography>
            <Typography variant="body2">
              <strong>Text:</strong> {text}
            </Typography>
            <Typography variant="body2">
              <strong>Price:</strong> {price}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}
