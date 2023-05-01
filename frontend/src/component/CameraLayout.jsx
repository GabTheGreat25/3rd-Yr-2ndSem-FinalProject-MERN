import React from "react";
import { Box, Paper } from "@mui/material";
import CameraImages from "./CameraImages";
import CameraDetails from "./CameraDetails";

export default function (props) {
  const { data, onAddToCart } = props;

  return (
    <>
      {data.map((detail) => (
        <Paper key={detail._id} sx={{ mb: 6 }}>
          <Box
            sx={{
              p: 5,
              display: "flex",
              justifyContent: "space-evenly",
              gap: 5,
            }}
          >
            <CameraImages image={detail.image} />
            <CameraDetails
              name={detail.name}
              price={detail.price}
              description={detail.description}
              onAddToCart={onAddToCart}
            />
          </Box>
        </Paper>
      ))}
    </>
  );
}
