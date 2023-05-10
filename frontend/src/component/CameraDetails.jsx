import { Box, Typography } from "@mui/material";
import Button from "./Button";
import { RESOURCE } from "@/constants";

export default function (props) {
  const { item, onAddToCart, isInCart } = props;

  const handleAddToCart = () => {
    onAddToCart(item);
  };

  return (
    <>
      <Box
        sx={{
          width: "50%",
          borderRadius: RESOURCE.NUMBER.TWO,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h3"
              color="inherit"
              gutterBottom
            >
              {item?.name}
            </Typography>

            <Typography variant="h5" color="inherit" paragraph>
              {`${item?.price || RESOURCE.NUMBER.ZERO} PHP`}
            </Typography>
          </Box>
          <Typography variant="h5" color="inherit" paragraph>
            {item?.description}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: RESOURCE.NUMBER.FOUR,
          }}
        >
          {isInCart ? (
            <Typography color="success.main">In Cart</Typography>
          ) : (
            <Button title="Add to Cart" onClick={handleAddToCart} />
          )}
        </Box>
      </Box>
    </>
  );
}
