import { useRef } from "react";
import { TextField, Typography, Grid, Button, MenuItem } from "@mui/material";
import {
  useUpdateUserMutation,
  useGetUserByIdQuery,
} from "@/state/api/reducer";
import { useFormik } from "formik";
import { editUserValidation } from "../../validation";
import { useNavigate, useParams } from "react-router-dom";
import { ROLES, ERROR } from "../../constants";
import { PacmanLoader } from "react-spinners";

export default function () {
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const { id } = useParams();

  const { data, isLoading, isError } = useGetUserByIdQuery(id);

  const [updateUser] = useUpdateUserMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.details?.name || "",
      email: data?.details?.email || "",
      roles: data?.details?.roles || [],
      image: data?.details?.image,
    },
    validationSchema: editUserValidation,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      values.roles.forEach((role) => formData.append("roles[]", role));
      Array.from(values.image).forEach((file) => {
        formData.append("image", file);
      });

      updateUser({ id: data.details._id, payload: formData }).then(
        (response) => {
          console.log(values);
          console.log("Response from API:", response);
          navigate("/dashboard/user");
        }
      );
    },
  });
  const handleRoleChange = (value) => {
    let values = Array.isArray(value) ? value : [value];
    if (
      values.includes("Customer") &&
      (values.includes("Admin") || values.includes("Employee"))
    ) {
      values = values.filter((role) => role !== "Customer");
    }
    formik.setFieldValue("roles", values);
  };

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_USERS_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Edit User
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TextField
                  required
                  id="email"
                  name="email"
                  label="Email"
                  fullWidth
                  autoComplete="email"
                  variant="standard"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  id="roles"
                  name="roles"
                  label="Select roles"
                  fullWidth
                  variant="standard"
                  value={formik.values.roles}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  error={formik.touched.roles && Boolean(formik.errors.roles)}
                  helperText={formik.touched.roles && formik.errors.roles}
                  SelectProps={{
                    multiple: true,
                  }}
                >
                  {ROLES.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="image"
                  name="image"
                  type="file"
                  ref={fileInputRef}
                  onBlur={formik.handleBlur}
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
                  error={formik.touched.image && Boolean(formik.errors.image)}
                  helperText={formik.touched.image && formik.errors.image}
                />
                {data.details.image.map((image) => (
                  <span key={image.public_id}>
                    <img
                      height={60}
                      width={75}
                      src={image.url}
                      alt={image.originalname}
                    />
                  </span>
                ))}
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formik.isValid}
            >
              Submit
            </Button>
          </form>
        </>
      )}
    </>
  );
}