import EnhancedTable from "./EnhancedTable";
import {
  totalRewardsTableColumn,
  transactionsTableColumn,
  userMonthlyTableColumn,
} from "../utils/const";
import {
  totalRewardsByCustomerName,
  totalRewardsOfEachTransaction,
  totalRewardsByMonthAndYearOfPurchase,
} from "../utils/table-data";
import log from "../utils/logger";

export default function TableContainer({ filteredCustomers }) {
  log.debug("Filtered Customers Data:", filteredCustomers);
  // Processed data after filtering
  const totalRewardsByMonthAndYearOfPurchaseData =
    totalRewardsByMonthAndYearOfPurchase(filteredCustomers);
  const totalRewardsByCustomerNameData =
    totalRewardsByCustomerName(filteredCustomers);
  const totalRewardsOfEachTransactionData =
    totalRewardsOfEachTransaction(filteredCustomers);

  return (
    <div data-testid="table-container">
      {/* Transactions */}
      <EnhancedTable
        title="Transactions"
        columns={transactionsTableColumn}
        rows={totalRewardsOfEachTransactionData}
      />

      {/* User Monthly Rewards */}
      <EnhancedTable
        title="User Monthly Rewards"
        columns={userMonthlyTableColumn}
        rows={totalRewardsByMonthAndYearOfPurchaseData}
      />

      {/* Total Rewards */}
      <EnhancedTable
        title="Total Rewards"
        columns={totalRewardsTableColumn}
        rows={totalRewardsByCustomerNameData}
      />
    </div>
  );
}
