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
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear().toString().slice(2)}`;
  };

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
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
                const categoryObj = categories.find(
                  (cat) => cat.id === transaction.categoryId
                );
                return (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>
                      <span
                        className={`type ${
                          transaction.type === "income" ? "income" : "expense"
                        }`}
                      >
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td>{categoryObj ? categoryObj.name : "-"}</td>
                    <td
                      style={{
                        color:
                          transaction.type === "income" ? "#4ECC5A" : "#EE3535",
                      }}
                    >
                      {formatAmount(transaction.amount)}
                    </td>
                    <td>{formatDate(transaction.date)}</td>
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
