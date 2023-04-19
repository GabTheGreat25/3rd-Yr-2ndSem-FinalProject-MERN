export const splitKey = (key) => key.split(".");

export const deconstruct = (key, row) => key.reduce((a, b) => a[b], row);

export const manipulate = (value, row, operation) => operation(value, row);
