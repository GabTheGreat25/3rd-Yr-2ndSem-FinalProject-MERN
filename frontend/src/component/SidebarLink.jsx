import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

export default function (props) {
  const { title, link, icon } = props;
  const navigate = useNavigate();

  return (
    <>
      <ListItemButton
        onClick={() => {
          typeof link === "function" ? link() : navigate(link);
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </>
  );
}
