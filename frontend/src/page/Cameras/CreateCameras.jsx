import { useRef } from "react";
import {
  TextField,
  Typography,
  Grid,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAddCameraMutation, useGetUsersQuery } from "@api";
import { useFormik } from "formik";
import { createCameraValidation } from "@/validation";
import { useNavigate } from "react-router-dom";
import { ERROR, RESOURCE, USER } from "@/constants";
import { PacmanLoader } from "react-spinners";
import { ImagePreview } from "@/component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function () {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [addCamera, isLoading, isError] = useAddCameraMutation();
  const { data } = useGetUsersQuery();
  const users = data?.details ?? [];
  const admins = users?.filter((user) => user?.roles?.includes(USER.ADMIN));

  const formik = useFormik({
    initialValues: {
      name: "",
      text: "",
      price: "",
      image: [],
      user: "",
    },
    validationSchema: createCameraValidation,
    onSubmit: (values) => {
      const formData = new FormData();

      formData.append("name", values?.name);
      formData.append("text", values?.text);
      formData.append("price", values?.price);
      formData.append("user", values?.user);
      Array.from(values?.image).forEach((file) => {
        formData.append("image", file);
      });

      addCamera(formData).then((response) => {
        const toastProps = {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: RESOURCE.NUMBER.FIVE_THOUSAND,
        };
        if (response?.data?.success === true) {
          navigate("/dashboard/camera");
          toast.success(`${response?.data?.message}`, toastProps);
        } else
          toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      });
    },
  });

  return (
    <>
      {!isLoading ? (
        <div className="loader">
          <PacmanLoader
            color="#2c3e50"
            loading={true}
            size={RESOURCE.NUMBER.FIFTY}
          />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_CAMERAS_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Create Camera
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={RESOURCE.NUMBER.THREE}>
              <Grid item xs={RESOURCE.NUMBER.TWELVE}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Name"
                  fullWidth
                  autoComplete="name"
                  variant="standard"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={RESOURCE.NUMBER.TWELVE}>
                <TextField
                  required
                  id="text"
                  name="text"
                  label="Text"
                  fullWidth
                  autoComplete="text"
                  variant="standard"
                  value={formik.values.text}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.text && Boolean(formik.errors.text)}
                  helperText={formik.touched.text && formik.errors.text}
                />
              </Grid>
              <Grid item xs={RESOURCE.NUMBER.TWELVE}>
                <TextField
                  required
                  id="price"
                  name="price"
                  label="Price"
                  fullWidth
                  autoComplete="price"
                  variant="standard"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>
              <Grid item xs={RESOURCE.NUMBER.TWELVE}>
                <TextField
                  id="image"
                  name="image"
                  type="file"
                  ref={fileInputRef}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  accept="image/*"
                  onChange={(event) =>
                    formik.setFieldValue("image", event.currentTarget.files)
                  }
                  inputProps={{
                    multiple: true,
                  }}
                />
                {formik.values.image && (
                  <ImagePreview images={Array.from(formik.values.image)} />
                )}
              </Grid>
              <Grid item xs={RESOURCE.NUMBER.TWELVE}>
                <InputLabel id="user-label">Select User</InputLabel>
                <Select
                  labelId="user-label"
                  id="user"
                  name="user"
                  fullWidth
                  value={formik.values.user}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.user && Boolean(formik.errors.user)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Please select an owner
                  </MenuItem>
                  {Array.isArray(admins) &&
                    admins.map((user) => {
                      return (
                        <MenuItem key={user._id} value={user._id}>
                          {user.name}
                        </MenuItem>
                      );
                    })}
                </Select>
                {formik.touched.user && formik.errors.user && (
                  <Typography variant="caption" color="error">
                    {formik.errors.user}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formik.isValid}
              sx={{ mt: "1rem" }}
            >
              Submit
            </Button>
          </form>
        </>
      )}
    </>
  );
}
