export const getAllocationAmount = (allocationObject) => {
  if (Object.values(allocationObject).length === 0) {
    return 0;
  }

  return Object.values(allocationObject).reduce((prev, curr) => {
    return prev + curr;
  });
};
