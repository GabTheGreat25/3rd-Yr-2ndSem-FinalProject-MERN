import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import Icon from "./Icons";
import { RESOURCE } from "@/constants";

export default function (props) {
  const { title, link, icon } = props;
  const navigate = useNavigate();

  return (
    <>
      <ListItemButton
        onClick={() => {
          typeof link === RESOURCE.FUNCTION ? link() : navigate(link);
        }}
      >
        <ListItemIcon>
          <Icon icon={icon} />
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </>
  );
}
