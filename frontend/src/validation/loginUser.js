import * as yup from "yup";
import { RESOURCE } from "@/constants";

export default yup.object({
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
