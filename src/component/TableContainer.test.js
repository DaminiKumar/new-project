import { render, screen } from "@testing-library/react";
import TableContainer from "./TableContainer";
import log from "../utils/logger";
import * as tableData from "../utils/table-data";

// Mock logger
jest.mock("../utils/logger", () => ({
  debug: jest.fn(),
}));

// Mock EnhancedTable to avoid rendering the actual table
jest.mock("./EnhancedTable", () => ({ title, columns, rows }) => (
  <div data-testid={`table-${title}`}>
    <span>{title}</span>
    <span>{rows.length} rows</span>
  </div>
));

describe("TableContainer Component", () => {
  const mockFilteredCustomers = [
    {
      customerId: "C001",
      customerName: "Alice",
      transactionId: "T001",
      purchaseDate: "2025-01-15",
      product: "Product A",
      price: 120,
    },
    {
      customerId: "C002",
      customerName: "Bob",
      transactionId: "T002",
      purchaseDate: "2025-02-10",
      product: "Product B",
      price: 70,
    },
  ];

  beforeEach(() => {
    // Optional: Spy on table-data functions if you want to ensure they are called
    jest
      .spyOn(tableData, "totalRewardsByMonthAndYearOfPurchase")
      .mockReturnValue([
        {
          customerId: "C001",
          customerName: "Alice",
          monthYear: "Jan 2025",
          rewards: 90,
        },
        {
          customerId: "C002",
          customerName: "Bob",
          monthYear: "Feb 2025",
          rewards: 20,
        },
      ]);
    jest.spyOn(tableData, "totalRewardsByCustomerName").mockReturnValue([
      { customerName: "Alice", rewards: 90 },
      { customerName: "Bob", rewards: 20 },
    ]);
    jest.spyOn(tableData, "totalRewardsOfEachTransaction").mockReturnValue([
      {
        transactionId: "T001",
        customerName: "Alice",
        purchaseDate: "2025-01-15",
        product: "Product A",
        price: 120,
        rewardPoints: 90,
      },
      {
        transactionId: "T002",
        customerName: "Bob",
        purchaseDate: "2025-02-10",
        product: "Product B",
        price: 70,
        rewardPoints: 20,
      },
    ]);
  });

  it("renders three EnhancedTable components with correct titles", () => {
    render(<TableContainer filteredCustomers={mockFilteredCustomers} />);

    expect(screen.getByTestId("table-Transactions")).toBeInTheDocument();
    expect(
      screen.getByTestId("table-User Monthly Rewards")
    ).toBeInTheDocument();
    expect(screen.getByTestId("table-Total Rewards")).toBeInTheDocument();
  });

  it("calls the logger.debug with filtered customers data", () => {
    render(<TableContainer filteredCustomers={mockFilteredCustomers} />);
    expect(log.debug).toHaveBeenCalledWith(
      "Filtered Customers Data:",
      mockFilteredCustomers
    );
  });

  it("calls table-data functions with filtered customers", () => {
    render(<TableContainer filteredCustomers={mockFilteredCustomers} />);
    expect(tableData.totalRewardsByMonthAndYearOfPurchase).toHaveBeenCalledWith(
      mockFilteredCustomers
    );
    expect(tableData.totalRewardsByCustomerName).toHaveBeenCalledWith(
      mockFilteredCustomers
    );
    expect(tableData.totalRewardsOfEachTransaction).toHaveBeenCalledWith(
      mockFilteredCustomers
    );
  });
});
