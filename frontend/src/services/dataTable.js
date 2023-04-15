export const splitKey = (key) => {
  return key.split(".");
};

export const deconstruct = (key, row) => {
  let tempValue = row;
  key.forEach((e) => {
    tempValue = tempValue[e];
  });
  return tempValue;
};

export const manipulate = (value, row, operation) => {
  return operation(value, row);
};
