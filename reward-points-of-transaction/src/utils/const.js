/**
 * Constants for UI labels and table configurations.
 * @module const
 */
export const noDataFound = "No customer data is found";

export const errorFetchingData =
  "Something went wrong, please try after some time";

export const filter = "Filter";
export const filterCustomerByPurchaseDate = "Filter Customers by Purchase Date";

export const userMonthlyTableColumn = [
  { id: "customerId", label: "Customer ID" },
  { id: "customerName", label: "Customer Name" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
  { id: "rewards", label: "Rewards" },
];

export const totalRewardsTableColumn = [
  { id: "customerName", label: "Customer Name" },
  { id: "rewards", label: "Rewards" },
];

export const transactionsTableColumn = [
  { id: "transactionId", label: "Transaction Id" },
  { id: "customerName", label: "Customer Name" },
  { id: "purchaseDate", label: "Purchase Date" },
  { id: "product", label: "Product" },
  { id: "price", label: "Price" },
  { id: "rewardPoints", label: "Reward Points" },
];
