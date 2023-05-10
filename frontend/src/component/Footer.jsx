import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MuiAppBar from "@mui/material/AppBar";
import { RESOURCE } from "@/constants";

export default function () {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: RESOURCE.NUMBER.ZERO,
        width: "100%",
        zIndex: RESOURCE.NUMBER.TWO,
      }}
    >
      <MuiAppBar position="static" sx={{ backgroundColor: "#2c3e50" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="body2" color="inherit">
            © 2023 Camera Rental. All Rights Reserved.
          </Typography>
          <IconButton color="inherit" aria-label="scroll-to-top"></IconButton>
        </Toolbar>
      </MuiAppBar>
    </footer>
  );
}
