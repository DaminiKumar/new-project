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
    const date = new Date(customer.purchaseDate);
    const rewardPoints = calculateRewards(customer.price);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${customer.customerId}-${month}-${year}`;

    if (!totalRewardsByMonthAndYearOfPurchaseMap[key]) {
      totalRewardsByMonthAndYearOfPurchaseMap[key] = {
        customerId: customer.customerId,
        customerName: customer.customerName,
        month: month,
        year: year,
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
      purchaseDate: purchaseDate,
      product: product,
      price: price,
      rewardPoints: rewardPoints,
    });
  });

  return totalRewardsOfEachTransaction;
};
