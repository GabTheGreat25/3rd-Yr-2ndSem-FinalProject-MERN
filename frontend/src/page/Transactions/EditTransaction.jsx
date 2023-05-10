import React from "react";
import { TextField, Typography, Grid, Button, MenuItem } from "@mui/material";
import { useUpdateTransactionMutation, useGetTransactionByIdQuery } from "@api";
import { useFormik } from "formik";
import { editTransactionValidation } from "@/validation";
import { useNavigate, useParams } from "react-router-dom";
import { STATUS, ERROR, RESOURCE } from "@/constants";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function () {
  const navigate = useNavigate();

  const { id } = useParams();

  const { data, isLoading, isError } = useGetTransactionByIdQuery(id);

  const [updateTransaction] = useUpdateTransactionMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: data?.details?.status || "",
      date:
        (data?.details?.date &&
          new Date(data?.details?.date)
            .toISOString()
            .substring(RESOURCE.NUMBER.ZERO, RESOURCE.NUMBER.TEN)) ||
        "",
    },
    validationSchema: editTransactionValidation,
    onSubmit: (values) => {
      updateTransaction({ id: data?.details?._id, payload: values }).then(
        (response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: RESOURCE.NUMBER.FIVE_THOUSAND,
          };
          if (response?.data?.success === true) {
            navigate("/dashboard/allTransaction");
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
        <div className="errorMessage">{ERROR.GET_TRANSACTIONS_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Edit Transaction
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={RESOURCE.NUMBER.THREE}>
              <Grid item xs={RESOURCE.NUMBER.TWELVE}>
                <TextField
                  select
                  required
                  id="status"
                  name="status"
                  label="Select status"
                  fullWidth
                  variant="standard"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  {STATUS?.map((status) => (
                    <MenuItem key={status?.value} value={status?.value}>
                      {status?.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={RESOURCE.NUMBER.TWELVE}>
                <TextField
                  required
                  id="date"
                  name="date"
                  label="Date"
                  fullWidth
                  autoComplete="date"
                  variant="outlined"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
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
