import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import RegisterImg from "@/assets/camera-register.jpg";

export default function () {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    navigate(`/login`);
  };

  return (
    <Container sx={{ mt: 7.5, mb: 5 }} disableGutters>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Box sx={{ width: "60%", height: "100%", paddingRight: "2rem" }}>
          <img
            src={RegisterImg}
            alt="RegisterImg"
            style={{ width: "100%", height: "100%", borderRadius: ".5rem" }}
          />
        </Box>
        <Box sx={{ width: "40%", height: "100%" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>
          <Typography variant="h5" align="center">
            Get us some of your information to get a free access to our website.
          </Typography>
          <form sx={{ height: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              autoComplete="first name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              autoComplete="last name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="type"
              name="type"
              label="Account Type"
              select
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Customer">Customer</MenuItem>
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              fullWidth
              type={showPassword ? "text" : "password"}
              autoComplete="secret password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {
                <span
                  style={{
                    textTransform: "capitalize",
                    fontSize: "1.15rem",
                  }}
                >
                  Sign Up
                </span>
              }
            </Button>
          </form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              sx={{
                mt: 1,
              }}
            >
              Already Have An Account?
            </Typography>
            <Button
              type="button"
              onClick={handleLogin}
              variant="text"
              color="secondary"
              sx={{ ml: 2 }}
            >
              {
                <span
                  style={{
                    textTransform: "capitalize",
                    fontSize: "1.2rem",
                  }}
                >
                  Sign In Here
                </span>
              }
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
