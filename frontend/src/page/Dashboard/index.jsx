import React from "react";
import { Box, Grid } from "@mui/material";
import GetAllUser from "./GetAllUser";
import GetAllAdmin from "./GetAllAdmin";
import GetAllEmployee from "./GetAllEmployee";
import GetAllCustomer from "./GetAllCustomer";
import ShowActiveUser from "./ShowActiveUser";
import AllUserCamera from "./AllUserCamera";
import MonthlySales from "./MonthlySales";
import TotalProfitPerYear from "./TotalProfitPerYear";
import { useSelector } from "react-redux";
import { RESOURCE, USER } from "@/constants";

export default function () {
  const auth = useSelector((state) => state.auth);

  return (
    <>
      {(auth?.user?.roles?.includes(USER.ADMIN) ||
        auth?.user?.roles?.includes(USER.EMPLOYEE)) && (
        <Grid container spacing={RESOURCE.NUMBER.TWO}>
          <Grid item sx={{ width: "100%" }}>
            <Box sx={{ mb: "1rem", mt: ".5rem" }}>
              <GetAllUser />
            </Box>
          </Grid>
          <Grid container spacing={RESOURCE.NUMBER.TWO}>
            <Grid item xs={RESOURCE.NUMBER.TWELVE} sm={RESOURCE.NUMBER.SIX}>
              <Box sx={{ mb: "1rem", mt: ".5rem" }}>
                <ShowActiveUser />
              </Box>
            </Grid>
            <Grid item xs={RESOURCE.NUMBER.TWELVE} sm={RESOURCE.NUMBER.SIX}>
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

          <Grid container spacing={RESOURCE.NUMBER.TWO}>
            <Grid item xs={RESOURCE.NUMBER.SIX}>
              <Box sx={{ mb: "1rem", mt: ".5rem" }}>
                <AllUserCamera />
              </Box>
            </Grid>
            <Grid item xs={RESOURCE.NUMBER.SIX}>
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
    </>
  );
}
