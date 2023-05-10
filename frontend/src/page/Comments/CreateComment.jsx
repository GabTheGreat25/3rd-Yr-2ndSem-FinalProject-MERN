import React from "react";
import { TextField, Typography, Grid, Button, Rating } from "@mui/material";
import { useAddCommentMutation, useGetTransactionsQuery } from "@api";
import { useFormik } from "formik";
import { createCommentValidation } from "@/validation";
import { useNavigate } from "react-router-dom";
import { ERROR, RESOURCE } from "@/constants";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function () {
  const navigate = useNavigate();
  const [addComment, isLoading, isError] = useAddCommentMutation();

  const { data: transactions, isLoading: transactionsLoading } =
    useGetTransactionsQuery();

  const lastTransactionId =
    transactions?.details?.[transactions.details.length - RESOURCE.NUMBER.ONE]
      ?._id;

  const formik = useFormik({
    initialValues: {
      transService: "",
      text: "",
      ratings: RESOURCE.NUMBER.ZERO,
    },
    validationSchema: createCommentValidation,
    onSubmit: (values) => {
      const newComment = {
        ...values,
        transaction: lastTransactionId,
      };
      addComment(newComment).then((response) => {
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
      {!isLoading || transactionsLoading ? (
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
            Create Comment
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
                  value={Number(formik.values.ratings) || RESOURCE.NUMBER.ZERO}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("ratings", Number(newValue));
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
