import { Box, CardMedia } from "@mui/material";
import { RESOURCE } from "@/constants";

export default function (props) {
  const { image } = props;
  const numImages = image.length;
  let height = "6.25rem";
  let width = "6.25rem";
  let margin = "0";
  let flexBasis = "6.25rem";

  if (numImages > RESOURCE.NUMBER.ONE && numImages <= RESOURCE.NUMBER.FOUR) {
    margin = ".2rem";
    flexBasis = "calc(25% - .5rem)";
  } else if (
    numImages > RESOURCE.NUMBER.FOUR &&
    numImages <= RESOURCE.NUMBER.NINE
  ) {
    margin = ".2rem";
    flexBasis = "calc(11.1% - .5rem)";
  } else if (numImages > RESOURCE.NUMBER.NINE) {
    margin = ".2rem";
    flexBasis = "calc(8.33% - .5rem)";
  }

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: RESOURCE.NUMBER.TWO,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {image?.map((imageItem, index) => (
          <CardMedia
            key={index}
            component="img"
            sx={{
              height: height,
              width: width,
              borderRadius: RESOURCE.NUMBER.TWO,
              margin: margin,
              flexBasis: flexBasis,
            }}
            image={imageItem?.url}
            alt={imageItem?.alt}
          />
        ))}
      </Box>
    </>
  );
}
