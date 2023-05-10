import { RESOURCE } from "@/constants";

export const splitKey = (key) => {
  if (typeof key !== RESOURCE.STRING) {
    return [];
  }
  return key.split(".");
};

export const deconstruct = (key, row) =>
  splitKey(key).reduce((a, b) => a[b], row);

export const manipulate = (value, row, operation) => operation(value, row);
