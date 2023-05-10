import * as yup from "yup";
import { RESOURCE } from "@/constants";

export default yup.object({
  newPassword: yup
    .string("Enter your new password")
    .min(RESOURCE.NUMBER.EIGHT, "Password must be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: yup
    .string("Enter your confirm password")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});
