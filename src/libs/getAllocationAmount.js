export const getAllocationAmount = (allocationObject) => {
  return Object.values(allocationObject).reduce((prev, curr) => prev + curr);
};
