import React from "react";
import {
  TextField,
  Typography,
  Grid,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  useUpdateNoteMutation,
  useGetNoteByIdQuery,
  useGetUsersQuery,
} from "@api";
import { useFormik } from "formik";
import { editNoteValidation } from "@/validation";
import { useNavigate, useParams } from "react-router-dom";
import { USER, ERROR, RESOURCE } from "@/constants";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

export default function () {
  const navigate = useNavigate();

  const { id } = useParams();

  const { data, isLoading, isError } = useGetNoteByIdQuery(id);

  const auth = useSelector((state) => state.auth);

  const isAdmin = auth?.user?.roles?.includes(USER.ADMIN);
  const isEmployee =
    auth?.user?.roles?.includes(USER.EMPLOYEE) &&
    auth?.user?.roles?.length === RESOURCE.NUMBER.ONE;
  const taskBelongsToUser = data?.details?.user?._id === auth?.user?._id;

  const { data: getAllNote } = useGetUsersQuery();

  const filteredData = getAllNote?.details?.filter(
    (user) => user?._id !== auth?.user?._id
  );

  const users = filteredData ?? [];

  const employees = users?.filter((user) =>
    user?.roles?.includes(USER.EMPLOYEE)
  );

  const associatedUser = users?.find(
    (user) => user?._id === data?.details?.user?._id
  );

  const [updateNote] = useUpdateNoteMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: data?.details?.title || "",
      text: data?.details?.text || "",
      user: associatedUser?._id || auth?.user?._id,
      completed: Boolean(data?.details?.completed),
    },
    validationSchema: editNoteValidation,
    onSubmit: (values) => {
      updateNote({ id: data?.details?._id, payload: values }).then(
        (response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: RESOURCE.NUMBER.FIVE_THOUSAND,
          };
          if (response?.data?.success === true) {
            navigate("/dashboard/note");
            toast.success(`${response?.data?.message}`, toastProps);
          } else
            toast.error(`${response?.error?.data?.error?.message}`, toastProps);
        }
      );
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
        <div className="errorMessage">{ERROR.GET_NOTES_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Edit Note
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={RESOURCE.NUMBER.THREE}>
              <Grid item xs={RESOURCE.NUMBER.TWELVE}>
                <TextField
                  required
                  id="title"
                  name="title"
                  label="Title"
                  fullWidth
                  autoComplete="title"
                  variant="standard"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
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
              {!taskBelongsToUser && isAdmin && (
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
                      Please select an employee
                    </MenuItem>
                    {Array.isArray(employees) &&
                      employees?.map((user) => {
                        return (
                          <MenuItem key={user?._id} value={user?._id}>
                            {user?.name}
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
              )}

              {(taskBelongsToUser ||
                (!isAdmin && !isEmployee) ||
                (isEmployee && !taskBelongsToUser)) && (
                <Grid item xs={RESOURCE.NUMBER.TWELVE}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.completed}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.completed.toString()}
                        name="completed"
                        id="completed"
                        color="primary"
                      />
                    }
                    label="Check This If You Completed Your Task"
                  />
                </Grid>
              )}
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
