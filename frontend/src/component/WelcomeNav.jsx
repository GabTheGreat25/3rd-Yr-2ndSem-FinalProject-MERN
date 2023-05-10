import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import logo from "@assets/logo-main-white-transparent.png";
import { useNavigate } from "react-router-dom";
import { RESOURCE } from "@/constants";

const Logo = styled("img")(({ theme }) => ({
  marginRight: theme.spacing(RESOURCE.NUMBER.TWO),
  width: "5rem",
  height: "auto",
}));

const LoginBtn = styled(Button)(({ theme }) => ({
  marginLeft: "auto",
  marginRight: theme.spacing(RESOURCE.NUMBER.TWO),
}));

const TransparentAppBar = styled(AppBar)({
  backgroundColor: "#2c3e50",
});

export default function () {
  const navigate = useNavigate();

  const handleLogin = () => navigate(`/login`);

  const handleRegister = () => navigate(`/register`);

  return (
    <TransparentAppBar position="static">
      <Toolbar>
        <Logo src={logo} alt="Logo" />
        <Typography variant="h6">RedFrame Camera Rentals</Typography>
        <LoginBtn color="inherit" onClick={handleLogin}>
          Login
        </LoginBtn>
        <Button color="inherit" onClick={handleRegister}>
          Register
        </Button>
      </Toolbar>
    </TransparentAppBar>
  );
}
