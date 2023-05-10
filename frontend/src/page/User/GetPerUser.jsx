import React from "react";
import { useParams } from "react-router-dom";
import { useGetUserByIdQuery } from "@api";
import { Card, CardContent, Typography } from "@mui/material";
import { ERROR, RESOURCE } from "@/constants";
import { PacmanLoader } from "react-spinners";

export default function () {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetUserByIdQuery(id);

  const { name, email, roles, image } = data?.details ?? {};

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
        <div className="errorMessage">{ERROR.GET_USERS_ERROR}</div>
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
              User Details
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
              <strong>Email:</strong> {email}
            </Typography>
            <Typography variant="body2">
              <strong>Roles:</strong> {roles?.join(", ")}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}
