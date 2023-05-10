import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link, useLocation } from "react-router-dom";
import { generateKey } from "@generateKey";
import { RESOURCE } from "@/constants";

export default function () {
  const location = useLocation();
  const breadcrumbs = location.pathname.split("/");
  breadcrumbs.shift();

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: RESOURCE.NUMBER.TWO }}
    >
      {breadcrumbs?.map((e, index) => (
        <Link
          key={generateKey(RESOURCE.NUMBER.FIVE)}
          to={`/${breadcrumbs
            .slice(RESOURCE.NUMBER.ZERO, index + RESOURCE.NUMBER.ONE)
            .join("/")}`}
          style={{ textDecoration: "none" }}
        >
          <Typography
            color="text.primary"
            sx={{
              cursor: "pointer",
              borderRadius: "0.5rem",
              padding: ".25rem .5rem",
              textTransform: "uppercase",
              "&:hover": {
                backgroundColor: "#f1f2f6",
                color: "#2c3e50",
                transition: "transform 0.2s ease-in-out",
                transform: "scale(1.1)",
              },
            }}
          >
            {e}
          </Typography>
        </Link>
      ))}
    </Breadcrumbs>
  );
}
