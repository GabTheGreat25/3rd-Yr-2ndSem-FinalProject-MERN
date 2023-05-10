import {
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForgotPasswordMutation } from "@api";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import ClearIcon from "@mui/icons-material/Clear";
import { forgotPasswordValidation } from "@/validation";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RESOURCE, ERROR } from "@/constants";

export default function () {
  const [forgotPassword, { isLoading, isError }] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidation,
    onSubmit: (values) => {
      forgotPassword(values?.email).then((response) => {
        const toastProps = {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: RESOURCE.NUMBER.FIVE_THOUSAND,
        };
        if (response?.data?.success) {
          window.open(`https://mailtrap.io/inboxes`, "_blank");
          toast.success(`${response?.data?.message}`, toastProps);
        } else
          toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      });
    },
  });

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
        <div className="errorMessage">{ERROR.FORGOT_PASSWORD_ERROR}</div>
      ) : (
        <>
          <Container maxWidth="xs">
            <Box
              sx={{
                marginTop: RESOURCE.NUMBER.EIGHT,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Forgot Password
              </Typography>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{ mt: RESOURCE.NUMBER.ONE }}
              >
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  autoComplete="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="clear email"
                          onClick={() => formik.setFieldValue("email", "")}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: RESOURCE.NUMBER.THREE }}
                  disabled={!formik.isValid}
                >
                  Send Email
                </Button>
              </Box>
            </Box>
          </Container>
        </>
      )}
    </>
  );
}
