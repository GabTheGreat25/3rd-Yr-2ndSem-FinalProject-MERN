import * as yup from "yup";
import { RESOURCE } from "@/constants";

export default yup.object({
  name: yup.string().required("Name is required"),
  text: yup.string().required("Text is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(RESOURCE.NUMBER.ZERO, "Price must be at least 0")
    .max(RESOURCE.NUMBER.TEN_THOUSAND, "Price must be at most 10000"),
});
