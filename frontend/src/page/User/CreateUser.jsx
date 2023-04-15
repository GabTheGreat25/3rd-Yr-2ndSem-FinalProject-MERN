import { useRef } from "react";
import { TextField, Typography, Grid, Button, MenuItem } from "@mui/material";
import { useAddUserMutation } from "@/state/api/reducer";
import { useFormik } from "formik";
import { createUserValidation } from "../../validation";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../constants";

export default function () {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [addUser] = useAddUserMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      roles: [],
      image: [],
    },
    validationSchema: createUserValidation,
    onSubmit: async (values) => {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      values.roles.forEach((role) => formData.append("roles[]", role));
      Array.from(values.image).forEach((file) => {
        formData.append("image", file);
      });

      addUser(formData).then((response) => {
        console.log("Response from API:", response);
        navigate("/dashboard/user");
      });
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
      <Typography variant="h6" gutterBottom>
        Create User
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
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              autoComplete="password"
              variant="standard"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
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
              multiple
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
            />
            {formik.values.image && (
              <div>
                <Typography>{formik.values.image.originalname}</Typography>
              </div>
            )}
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
