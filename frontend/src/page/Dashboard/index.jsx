import React from "react";
import { Box, Grid } from "@mui/material";
import GetAllUser from "./getAllUser";
import GetAllAdmin from "./GetAllAdmin";
import GetAllEmployee from "./GetAllEmployee";
import GetAllCustomer from "./GetAllCustomer";
import ShowActiveUser from "./ShowActiveUser";
import AllUserCamera from "./AllUserCamera";
import MonthlySales from "./MonthlySales";
import TotalProfitPerYear from "./TotalProfitPerYear";
import { useSelector } from "react-redux";
import CreateTransaction from "../Transactions/createTransaction";

export default function () {
  const auth = useSelector((state) => state.auth);

  return (
    <>
      {(auth?.user?.roles?.includes("Admin") ||
        auth?.user?.roles?.includes("Employee")) && (
        <Grid container spacing={2}>
          <Grid item sx={{ width: "100%" }}>
            <Box sx={{ mb: "1rem", mt: ".5rem" }}>
              <GetAllUser />
            </Box>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: "1rem", mt: ".5rem" }}>
                <ShowActiveUser />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: "1rem", mt: ".5rem" }}>
                <GetAllAdmin />
              </Box>
              <Box sx={{ mb: "1rem", mt: ".5rem" }}>
                <GetAllEmployee />
              </Box>
              <Box sx={{ mb: "1rem", mt: ".5rem" }}>
                <GetAllCustomer />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ mb: "1rem", mt: ".5rem" }}>
                <AllUserCamera />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: "1rem", mt: ".5rem" }}>
                <TotalProfitPerYear />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mb: "1rem", mt: ".5rem" }}>
            <MonthlySales />
          </Box>
        </Grid>
      )}
      {auth?.user?.roles?.includes("Customer") && (
        <>
          <CreateTransaction />
        </>
      )}
    </>
  );
}
