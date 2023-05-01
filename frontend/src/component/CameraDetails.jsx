import { Box, Typography } from "@mui/material";
import Button from "./Button";

export default function (props) {
  const { name, price, text, onAddToCart } = props;
  return (
    <>
      <Box
        sx={{
          width: "50%",
          borderRadius: 2,
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
              {name}
            </Typography>

            <Typography variant="h5" color="inherit" paragraph>
              {`${price || 0} PHP`}
            </Typography>
          </Box>
          <Typography variant="h5" color="inherit" paragraph>
            {text}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 4,
          }}
        >
          <Button title="Add to Cart" onClick={onAddToCart} />
        </Box>
      </Box>
    </>
  );
}
