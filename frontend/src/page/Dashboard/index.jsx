import React from "react";
import { Box } from "@mui/material";
import GetAllUser from "./getAllUser";
import GetAllAdmin from "./GetAllAdmin";
import GetAllEmployee from "./GetAllEmployee";
import GetAllCustomer from "./GetAllCustomer";
import ShowActiveUser from "./ShowActiveUser";
import AllUserCamera from "./AllUserCamera";

export default function () {
  return (
    <>
      <Box sx={{ mb: "1rem", mt: ".5rem" }}>
        <GetAllUser />
      </Box>
      <Box sx={{ mb: "1rem", mt: ".5rem" }}>
        <GetAllAdmin />
      </Box>
      <Box sx={{ mb: "1rem", mt: ".5rem" }}>
        <GetAllEmployee />
      </Box>
      <Box sx={{ mb: "1rem", mt: ".5rem" }}>
        <GetAllCustomer />
      </Box>
      <Box sx={{ mb: "1rem", mt: ".5rem" }}>
        <ShowActiveUser />
      </Box>
      <Box sx={{ mb: "1rem", mt: ".5rem" }}>
        <AllUserCamera />
      </Box>
    </>
  );
}
