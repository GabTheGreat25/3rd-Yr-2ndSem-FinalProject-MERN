import React from "react";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MuiDrawer from "@mui/material/Drawer";
import SidebarLink from "./SidebarLink";
import { generateKey } from "@/services/generateKey";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open, backgroundColor }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: 240,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
    zIndex: 1,
    backgroundColor: "#f1f2f6",
  },
}));

export default function (props) {
  const { open, toggleDrawer, links = [] } = props;
  return (
    <>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {links.map((e) => {
            return (
              <div key={generateKey(5)}>
                <SidebarLink title={e.title} link={e.link} icon={e.icon} />
                <Divider sx={{ my: 1 }} />
              </div>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
