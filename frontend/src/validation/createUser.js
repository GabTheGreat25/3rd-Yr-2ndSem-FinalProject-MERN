import * as yup from "yup";
import { RESOURCE } from "@/constants";

export default yup.object({
  name: yup.string("Enter your Name").required("Name is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(
      RESOURCE.NUMBER.EIGHT,
      "Password should be of minimum 8 characters length"
    )
    .required("Password is required"),
});
