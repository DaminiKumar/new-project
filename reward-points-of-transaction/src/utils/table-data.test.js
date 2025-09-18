import {
  calculateRewards,
  totalRewardsByMonthAndYearOfPurchase,
  totalRewardsByCustomerName,
  totalRewardsOfEachTransaction,
} from "./table-data";

describe("Reward Calculation Functions", () => {
  // Sample test data
  const sampleData = [
    {
      customerId: "C001",
      customerName: "Alice",
      transactionId: "T001",
      purchaseDate: "2025-01-15",
      product: "Product A",
      price: 120,
    },
    {
      customerId: "C001",
      customerName: "Alice",
      transactionId: "T002",
      purchaseDate: "2025-01-20",
      product: "Product B",
      price: 70,
    },
    {
      customerId: "C002",
      customerName: "Bob",
      transactionId: "T003",
      purchaseDate: "2025-02-10",
      product: "Product C",
      price: "90",
    },
    {
      customerId: "C003",
      customerName: "Charlie",
      transactionId: "T004",
      purchaseDate: "2025-02-15",
      product: "Product D",
      price: 40,
    },
    {
      customerId: "C004",
      customerName: "David",
      transactionId: "T005",
      purchaseDate: "2025-03-01",
      product: "Product E",
      price: "105.5",
    },
  ];

  describe("calculateRewards", () => {
    it("should calculate rewards correctly for numbers", () => {
      expect(calculateRewards(120)).toBe(90); // 2*(120-100)+50 = 90
      expect(calculateRewards(70)).toBe(20); // 70-50 = 20
      expect(calculateRewards(50)).toBe(0); // <=50 no points
    });

    it("should convert string to number and ignore decimals", () => {
      expect(calculateRewards("105.5")).toBe(60); // 2*(105-100)+50=60
      expect(calculateRewards("90")).toBe(40); // 90-50 = 40
    });

    it("should return 0 for empty, null, undefined, or invalid input", () => {
      expect(calculateRewards("")).toBe(0);
      expect(calculateRewards(null)).toBe(0);
      expect(calculateRewards(undefined)).toBe(0);
      expect(calculateRewards("abc")).toBe(0);
    });
  });

  describe("totalRewardsByMonthAndYearOfPurchase", () => {
    it("should calculate rewards grouped by customer, month, year", () => {
      const result = totalRewardsByMonthAndYearOfPurchase(sampleData);
      expect(result.length).toBeGreaterThan(0);
      // Alice Jan 2025: T001=90 + T002=20 => 110
      const aliceJan = result.find(
        (r) => r.customerId === "C001" && r.month === 1 && r.year === 2025
      );
      expect(aliceJan.rewards).toBe(110);
    });
  });

  describe("totalRewardsByCustomerName", () => {
    it("should calculate total rewards per customer", () => {
      const result = totalRewardsByCustomerName(sampleData);
      expect(result.length).toBe(4); // Alice, Bob, Charlie, David
      const bob = result.find((r) => r.customerName === "Bob");
      expect(bob.rewards).toBe(40); // 90-50 = 40
    });
  });

  describe("totalRewardsOfEachTransaction", () => {
    it("should calculate rewards for each transaction", () => {
      const result = totalRewardsOfEachTransaction(sampleData);
      expect(result.length).toBe(sampleData.length);
      const t004 = result.find((r) => r.transactionId === "T004");
      expect(t004.rewardPoints).toBe(0); // Charlie 40$ => 0 points
    });
  });
});
