import React from "react";
import { Card, CardContent, Typography, ListItemIcon } from "@mui/material";
import { generateKey } from "@generateKey";
import { RESOURCE } from "@/constants";

export default function (props) {
  const { title, icon, data } = props;
  return (
    <div key={generateKey(RESOURCE.NUMBER.FIVE)}>
      <Card sx={{ display: "flex", justifyContent: "space-between" }}>
        <CardContent sx={{ flex: RESOURCE.NUMBER.ONE, alignItems: "end" }}>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="h2" component="div">
            {data}
          </Typography>
        </CardContent>
        <ListItemIcon sx={{ fontSize: "3rem" }}>{icon}</ListItemIcon>
      </Card>
    </div>
  );
}
