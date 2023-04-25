import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useDispatch } from "react-redux";
import { logout } from "@/state/auth/authReducer";
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 240,
    width: `calc(100% - 240px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function (props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { open, toggleDrawer } = props;

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AppBar
        position="absolute"
        open={open}
        sx={{ backgroundColor: "#2c3e50" }}
      >
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
              "&:hover": {
                backgroundColor: "#f1f2f6",
                color: "#2c3e50",
                transition: "transform 0.2s ease-in-out",
                transform: "scale(1.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Admin Dashboard
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            aria-label="logout"
            sx={{
              borderRadius: "0.5rem",
              "&:hover": {
                backgroundColor: "#f1f2f6",
                color: "#2c3e50",
                transition: "transform 0.2s ease-in-out",
                transform: "scale(1.1)",
              },
            }}
          >
            <Typography variant="button" sx={{ marginLeft: 1 }}>
              Logout
            </Typography>
            <ExitToAppIcon sx={{ ml: 1 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}
