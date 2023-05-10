import { useState } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useResetPasswordMutation } from "@api";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { resetPasswordValidation } from "@/validation";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TAGS, RESOURCE, ERROR } from "@/constants";

export default function () {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading, isError }] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidation,
    onSubmit: (values) => {
      const { newPassword, confirmPassword } = values;
      const email = new URLSearchParams(window.location.search).get(TAGS.EMAIL);
      resetPassword({
        newPassword,
        confirmPassword,
        email,
      }).then((response) => {
        const toastProps = {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: RESOURCE.NUMBER.FIVE_THOUSAND,
        };
        if (response?.data?.success === true) {
          window.open(`https://mailtrap.io/inboxes`, "_blank");
          toast.success(`${response?.data?.message}`, toastProps);
        } else
          toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      });
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader
            color="#2c3e50"
            loading={true}
            size={RESOURCE.NUMBER.FIFTY}
          />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.RESET_PASSWORD_ERROR}</div>
      ) : (
        <>
          <Container maxWidth="sm">
            <Box
              sx={{
                mt: RESOURCE.NUMBER.FOUR,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" gutterBottom>
                Reset Password
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="newPassword"
                  error={
                    formik.touched.newPassword &&
                    Boolean(formik.errors.newPassword)
                  }
                  helperText={
                    formik.touched.newPassword && formik.errors.newPassword
                  }
                  margin="normal"
                  required
                  fullWidth
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
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="confirmPassword"
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  margin="normal"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowConfirmPassword}>
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: RESOURCE.NUMBER.THREE, mb: RESOURCE.NUMBER.TWO }}
                  disabled={!formik.isValid}
                >
                  Reset Password
                </Button>
              </form>
            </Box>
          </Container>
        </>
      )}
    </>
  );
}
