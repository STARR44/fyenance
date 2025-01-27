import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { FaWallet } from "react-icons/fa"; // Import Wallet Icon
import { FaRegFrown } from "react-icons/fa"; // Import the Frown icon
import "./RecentTransactions.css";

function RecentTransactions({ limit = 5 }) {
  const { transactions, categories } = useGlobalContext();

  const formatAmount = (amount) => `₦${Number(amount).toLocaleString()}`;
  const formatDate = (dateString) => {
    const date_created = new Date(dateString);
    return `${date_created.getDate().toString().padStart(2, "0")}-${(
      date_created.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date_created.getFullYear().toString().slice(2)}`;
  };

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
    .slice(0, limit);

  return (
    <div className="recent-transactions">
      {/* Updated Header with Wallet Icon */}
      <h3 className="recent-transactions-header">
        <FaWallet className="wallet-icon" />
        <span>Recent Transactions</span>
      </h3>
      {/* <h3>Recent Transactions</h3> */}

      {recentTransactions.length > 0 ? (
        <div className="transaction-table">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => {
                return (
                  <tr key={transaction.transaction_id}>
                    <td>{transaction.transaction_id}</td>
                    <td>
                      <span
                        className={`type ${
                          transaction.type === "Income" ? "income" : "expense"
                        }`}
                      >
                        {transaction.type === "Income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td>{transaction.category_name || "-"}</td>
                    <td
                      style={{
                        color:
                          transaction.type === "Income" ? "#4ECC5A" : "#EE3535",
                      }}
                    >
                      {formatAmount(transaction.amount)}
                    </td>
                    <td>{formatDate(transaction.date_created)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-transactions">
          <FaRegFrown className="icon"/>
          No recent transactions...
        </p>
      )}
      {recentTransactions.length > 0 && (
        <Link to="/transactions" className="view-more">
          View All Transactions
        </Link>
      )}
    </div>
  );
}

export default RecentTransactions;
