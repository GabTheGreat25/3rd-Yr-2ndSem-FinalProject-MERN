import {
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForgotPasswordMutation } from "../../state/api/reducer";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import ClearIcon from "@mui/icons-material/Clear";
import { forgotPasswordValidation } from "../../validation";

export default function () {
  const [forgotPassword] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidation,
    onSubmit: (values) => {
      forgotPassword(values.email).then((response) => {
        console.log("Response from API:", response);
        const url = `https://mailtrap.io/inboxes/1656145/messages`;
        window.open(url, "_blank");
      });
    },
  });

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
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
            sx={{ mt: 3 }}
            disabled={!formik.isValid}
          >
            Reset Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
