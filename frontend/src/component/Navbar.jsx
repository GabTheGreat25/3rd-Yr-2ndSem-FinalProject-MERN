import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "./Appbar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PasswordIcon from "@mui/icons-material/Password";
import InfoIcon from "@mui/icons-material/Info";
import { useDispatch } from "react-redux";
import { logout } from "@/state/auth/authReducer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "react-redux";

export default function (props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  const { open, toggleDrawer } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedButton] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
      toast.success("Logout successful!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
  };

  const handleUpdateUserDetails = async () => {
    navigate(`userDetails/${auth.user._id}`);
  };

  const handleUpdatePassword = async () => {
    navigate(`updatePassword/${auth.user._id}`);
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
          {auth?.user?.roles?.includes("Admin") ? (
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Admin Dashboard
            </Typography>
          ) : auth?.user?.roles?.includes("Employee") ? (
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Employee Dashboard
            </Typography>
          ) : (
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Customer Dashboard
            </Typography>
          )}
          <Button
            aria-controls="dropdown-menu"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{
              borderRadius: "0.5rem",
              backgroundColor: "#f1f2f6",
              color: "#2c3e50",
              "&:hover": {
                backgroundColor: "#f1f2f6",
                color: "#2c3e50",
              },
            }}
          >
            {selectedButton || `Welcome, ${auth?.user?.name}`}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleUpdateUserDetails}>
              <IconButton
                color="inherit"
                aria-label="updateUserDetails"
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
                  Update Your Details
                </Typography>
                <InfoIcon sx={{ ml: 1 }} />
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleUpdatePassword}>
              <IconButton
                color="inherit"
                aria-label="updatePassword"
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
                  Update Password
                </Typography>
                <PasswordIcon sx={{ ml: 1 }} />
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <IconButton
                color="inherit"
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
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}
