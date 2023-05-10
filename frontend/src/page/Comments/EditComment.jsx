import React from "react";
import { TextField, Typography, Grid, Button, Rating } from "@mui/material";
import { useUpdateCommentMutation, useGetCommentByIdQuery } from "@api";
import { useFormik } from "formik";
import { editCommentValidation } from "@/validation";
import { useNavigate, useParams } from "react-router-dom";
import { ERROR, RESOURCE } from "@/constants";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function () {
  const navigate = useNavigate();

  const { id } = useParams();

  const { data, isLoading, isError } = useGetCommentByIdQuery(id);

  const [updateComment] = useUpdateCommentMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      transService: data?.details?.transService || "",
      text: data?.details?.text || "",
      ratings: data?.details?.ratings || RESOURCE.NUMBER.ONE,
    },
    validationSchema: editCommentValidation,
    onSubmit: (values) => {
      updateComment({
        id: data?.details?._id,
        payload: values,
      }).then((response) => {
        const toastProps = {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: RESOURCE.NUMBER.FIVE_THOUSAND,
        };
        if (response?.data?.success === true) {
          navigate("/dashboard/comment");
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
        <div className="errorMessage">{ERROR.GET_COMMENTS_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Edit Comment
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={RESOURCE.NUMBER.THREE}>
              <Grid item xs={RESOURCE.NUMBER.TWELVE}>
                <TextField
                  required
                  id="transService"
                  name="transService"
                  label="TransService"
                  fullWidth
                  autoComplete="transService"
                  variant="standard"
                  value={formik.values.transService}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.transService &&
                    Boolean(formik.errors.transService)
                  }
                  helperText={
                    formik.touched.transService && formik.errors.transService
                  }
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
                <Typography component="label" htmlFor="ratings" gutterBottom>
                  Ratings
                </Typography>
                <br />
                <Rating
                  name="ratings"
                  value={formik.values.ratings}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("ratings", newValue);
                  }}
                  onBlur={formik.handleBlur}
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
