import { format } from "date-fns";

/**
 * Calculates reward points based on purchase amount.
 * - Ignores empty, null, undefined, or invalid values.
 * - Converts strings to numbers safely.
 * - Discards decimal points (only integer part is used).
 *
 * @param {number|string} amount - The purchase amount.
 * @returns {number} Reward points earned.
 */
export const calculateRewards = (amount) => {
  if (amount === null || amount === undefined || amount === "") {
    return 0;
  }

  // Convert to number and drop decimals
  const numAmount = parseInt(amount, 10);

  if (isNaN(numAmount) || numAmount <= 0) {
    return 0;
  }

  let points = 0;
  if (numAmount > 100) {
    points += 2 * (numAmount - 100);
    points += 50; // flat 50 for the 50–100 range
  } else if (numAmount > 50) {
    points += numAmount - 50;
  }

  return points;
};

/**
 * Calculate total rewards grouped by customer, month, and year.
 *
 * @function
 * @param {Array<Object>} customers - List of customer transactions.
 * @returns {Array<Object>} Rewards aggregated per customer per month-year.
 */
export const totalRewardsByMonthAndYearOfPurchase = (customers) => {
  const totalRewardsByMonthAndYearOfPurchaseMap = {};
  customers.forEach((customer) => {
    const rewardPoints = calculateRewards(customer.price);
    const key = `${customer.customerId}-${customer.purchaseDate.slice(0, 7)}`;

    if (!totalRewardsByMonthAndYearOfPurchaseMap[key]) {
      totalRewardsByMonthAndYearOfPurchaseMap[key] = {
        customerId: customer.customerId,
        customerName: customer.customerName,
        monthYear: formatDate(customer.purchaseDate),
        rewards: 0,
      };
    }
    totalRewardsByMonthAndYearOfPurchaseMap[key].rewards += rewardPoints;
  });

  return Object.values(totalRewardsByMonthAndYearOfPurchaseMap);
};

/**
 * Calculate total rewards grouped by customer name.
 *
 * @function
 * @param {Array<Object>} customers - List of customer transactions.
 * @returns {Array<Object>} Rewards aggregated per customer.
 */
export const totalRewardsByCustomerName = (customers) => {
  const totalRewardsByCustomerNameMap = {};
  customers.forEach((customer) => {
    const rewardPoints = calculateRewards(customer.price);

    if (!totalRewardsByCustomerNameMap[customer.customerName]) {
      totalRewardsByCustomerNameMap[customer.customerName] = {
        customerName: customer.customerName,
        rewards: 0,
      };
    }
    totalRewardsByCustomerNameMap[customer.customerName].rewards +=
      rewardPoints;
  });

  return Object.values(totalRewardsByCustomerNameMap);
};

/**
 * Calculate rewards for each individual transaction.
 *
 * @function
 * @param {Array<Object>} customers - List of customer transactions.
 * @returns {Array<Object>} Rewards calculated per transaction.
 */
export const totalRewardsOfEachTransaction = (customers) => {
  const totalRewardsOfEachTransaction = [];
  customers.forEach((customer) => {
    const { transactionId, customerName, purchaseDate, product, price } =
      customer;
    const rewardPoints = calculateRewards(price);

    totalRewardsOfEachTransaction.push({
      transactionId: transactionId,
      customerName: customerName,
      purchaseDate: format(new Date(purchaseDate), "dd/MM/yyyy"),
      product: product,
      price: price,
      rewardPoints: rewardPoints,
    });
  });

  return totalRewardsOfEachTransaction;
};

/**
 * Filter customers by purchase date range
 * @param {Array} customers - Array of customer objects
 * @param {Date} from - Start date
 * @param {Date} to - End date
 * @returns {Array} - Filtered customers
 */
export function filterCustomersByPurchaseDate(customers, from, to) {
  return customers.filter((cust) => {
    if (!cust.purchaseDate) return false;
    const txnDate = new Date(cust.purchaseDate);
    return txnDate >= from && txnDate <= to;
  });
}

/**
 * Formats a date string into a "Mon YYYY" format (e.g., "Sep 2025").
 *
 * @param {string|Date} dateString - The date string or Date object to format.
 * @returns {string} Formatted date string in "Mon YYYY" format. Returns "Invalid Date" if input is invalid.
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

/**
 * Formats the value for a table cell.
 * - If the column is "price", prefixes with `$` and defaults to 0 if empty, null, or undefined.
 * - For other columns, returns the value or `"-"` if empty, null, or undefined.
 *
 * @param {Object} row - The data row object.
 * @param {Object} column - The column configuration object with at least an `id` property.
 * @returns {string|number} Formatted cell value for display in the table.
 */
export const formatTableCellValue = (row, column) => {
  const value = row?.[column?.id]; // Safely access the value
  if (column?.id === "price") {
    // If price is null/undefined/empty, show $0
    const priceValue = value != null && value !== "" ? value : 0;
    return `$${priceValue}`;
  } else {
    return value != null && value !== "" ? value : "-";
  }
};
