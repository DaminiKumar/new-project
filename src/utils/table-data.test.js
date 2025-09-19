import {
  calculateRewards,
  totalRewardsByMonthAndYearOfPurchase,
  totalRewardsByCustomerName,
  totalRewardsOfEachTransaction,
  filterCustomersByPurchaseDate,
  formatTableCellValue,
} from "./table-data";

describe("calculateRewards", () => {
  it("returns 0 for null, undefined, or empty string", () => {
    expect(calculateRewards(null)).toBe(0);
    expect(calculateRewards(undefined)).toBe(0);
    expect(calculateRewards("")).toBe(0);
  });

  it("returns correct points for amount between 50 and 100", () => {
    expect(calculateRewards(60)).toBe(10);
    expect(calculateRewards("75")).toBe(25);
  });

  it("returns correct points for amount over 100", () => {
    expect(calculateRewards(120)).toBe(90); // (120-100)*2 + 50 = 90
    expect(calculateRewards("150")).toBe(150); // (150-100)*2 + 50 = 150
  });

  it("returns 0 for non-numeric or negative values", () => {
    expect(calculateRewards("abc")).toBe(0);
    expect(calculateRewards(-50)).toBe(0);
  });
});

describe("totalRewardsByMonthAndYearOfPurchase", () => {
  const customers = [
    {
      customerId: 1,
      customerName: "Alice",
      transactionId: "T0001",
      purchaseDate: "2025-09-01",
      product: "Wireless Mouse",
      price: 120,
    },
    {
      customerId: 1,
      transactionId: "T0001",
      customerName: "Alice",
      purchaseDate: "2025-09-15",
      product: "Mouse",
      price: 80,
    },
  ];

  it("calculates rewards grouped by customer and month-year", () => {
    const result = totalRewardsByMonthAndYearOfPurchase(customers);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("customerId", 1);
    expect(result[0]).toHaveProperty("customerName", "Alice");
    expect(result[0]).toHaveProperty("rewards", 120); // rewards from both txns
    expect(result[0]).toHaveProperty("monthYear", "Sep 2025");
  });
});

describe("totalRewardsByCustomerName", () => {
  const customers = [
    { customerName: "Bob", price: 60 },
    { customerName: "Bob", price: 120 },
  ];

  it("calculates rewards grouped by customer name", () => {
    const result = totalRewardsByCustomerName(customers);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ customerName: "Bob", rewards: 100 });
  });
});

describe("totalRewardsOfEachTransaction", () => {
  const customers = [
    {
      transactionId: "t1",
      customerName: "Alice",
      purchaseDate: "2025-09-01",
      product: "Book",
      price: 120,
    },
  ];

  it("returns rewards for each transaction", () => {
    const result = totalRewardsOfEachTransaction(customers);
    expect(result[0]).toEqual({
      transactionId: "t1",
      customerName: "Alice",
      purchaseDate: expect.any(String),
      product: "Book",
      price: 120,
      rewardPoints: 90,
    });
  });
});

describe("filterCustomersByPurchaseDate", () => {
  const customers = [
    { purchaseDate: "2025-09-01" },
    { purchaseDate: "2025-06-01" },
    { purchaseDate: null },
  ];

  it("filters customers within date range", () => {
    const from = new Date("2025-08-01");
    const to = new Date("2025-09-30");
    const result = filterCustomersByPurchaseDate(customers, from, to);
    expect(result).toHaveLength(1);
    expect(result[0].purchaseDate).toBe("2025-09-01");
  });
});

describe("formatTableCellValue", () => {
  it("formats price column correctly", () => {
    expect(formatTableCellValue({ price: 50 }, { id: "price" })).toBe("$50");
    expect(formatTableCellValue({ price: null }, { id: "price" })).toBe("$0");
    expect(formatTableCellValue({}, { id: "price" })).toBe("$0");
  });

  it("formats other columns correctly", () => {
    expect(formatTableCellValue({ name: "Alice" }, { id: "name" })).toBe(
      "Alice"
    );
    expect(formatTableCellValue({ name: null }, { id: "name" })).toBe("-");
    expect(formatTableCellValue({}, { id: "name" })).toBe("-");
  });
});
