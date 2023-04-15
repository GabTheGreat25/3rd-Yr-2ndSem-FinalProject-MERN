import * as yup from "yup";

export default yup.object({
  name: yup.string("Enter your Name").required("Name is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  // image: yup
  //   .array()
  //   .min(1, "Please select at least one image")
  //   .of(
  //     yup.mixed().test(
  //       "fileSize",
  //       "File size is too large",
  //       (value) => value && value.size <= 5000000 //5mb
  //     )
  //   ),
});
