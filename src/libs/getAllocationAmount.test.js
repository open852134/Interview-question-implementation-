import { getAllocationAmount } from "./getAllocationAmount";

describe("getAllocationAmount", () => {
  test("should return right amount 0", () => {
    const result = getAllocationAmount({});
    expect(result).toEqual(0);
  });

  test("should return right amount 1", () => {
    const result = getAllocationAmount({ adult: 1, child: 0 });
    expect(result).toEqual(1);
  });

  test("should return right amount 11", () => {
    const result = getAllocationAmount({ adult: 5, child: 6 });
    expect(result).toEqual(11);
  });
});
