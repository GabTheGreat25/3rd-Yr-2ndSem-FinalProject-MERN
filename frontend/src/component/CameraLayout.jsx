import { Box, Paper } from "@mui/material";
import CameraImages from "./CameraImages";
import CameraDetails from "./CameraDetails";
import { RESOURCE } from "@/constants";

export default function (props) {
  const { data, onAddToCart, cartItems } = props;

  return (
    <>
      {data?.map((detail) => {
        const isInCart = cartItems?.some(
          (cartItem) => cartItem?._id === detail?._id
        );

        return (
          <Paper key={detail?._id} sx={{ mb: RESOURCE.NUMBER.SIX }}>
            <Box
              sx={{
                p: RESOURCE.NUMBER.FIVE,
                display: "flex",
                justifyContent: "space-evenly",
                gap: RESOURCE.NUMBER.FIVE,
                backgroundColor: "#f1f2f6",
              }}
            >
              <CameraImages image={detail?.image} />
              <CameraDetails
                item={detail}
                onAddToCart={() => onAddToCart(detail)}
                isInCart={isInCart}
              />
            </Box>
          </Paper>
        );
      })}
    </>
  );
}
