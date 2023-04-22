import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useLoginMutation } from "../../state/api/reducer";
import { Box } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import loginImg from "@/assets/camera-login.jpg";
import { useFormik } from "formik";
import { setToken } from "../../state/api/slice/authSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginUser] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      const response = await loginUser(values).unwrap();
      dispatch(setToken(response?.details));
      console.log(dispatch(setToken(response?.details)));
      console.log("Response from API:", response);
      // navigate("/dashboard");
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    navigate(`/register`);
  };

  return (
    <Container
      sx={{
        mt: 5,
        mb: 5,
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
      disableGutters
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "60%" }}>
          <img
            src={loginImg}
            alt="loginImg"
            style={{ width: "100%", borderRadius: ".5rem" }}
          />
        </Box>
        <Box sx={{ width: "50%" }} align="center">
          <Typography variant="h4" gutterBottom>
            Sign in to your account
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              id="password"
              name="password"
              label="Password"
              fullWidth
              type={showPassword ? "text" : "password"}
              autoComplete="secret password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
                width: "100%",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember me"
                labelPlacement="end"
                sx={{ alignSelf: "flex-start" }}
              />
              <Button
                type="button"
                // onClick={handleForgotPassword}
                variant="text"
                color="error"
                sx={{ alignSelf: "flex-start" }}
              >
                {
                  <span
                    style={{
                      textTransform: "capitalize",
                      fontSize: "1.15rem",
                      marginBottom: ".25rem",
                    }}
                  >
                    Forgot Password
                  </span>
                }
              </Button>
            </Box>
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
                  Log In
                </span>
              }
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 3,
                width: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Not a member
              </Typography>

              <Button
                type="button"
                onClick={handleRegister}
                variant="text"
                color="success"
              >
                {
                  <span
                    style={{
                      textTransform: "capitalize",
                      fontSize: "1.15rem",
                      marginBottom: ".25rem",
                    }}
                  >
                    Register Here
                  </span>
                }
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
