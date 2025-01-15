import React, { useState, useEffect } from "react";
import "./TransactionForm.css";

function TransactionForm({
  categories,
  budgets,
  transaction,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    type: transaction ? transaction.type : "income", // Default to 'income'
    category: transaction ? transaction.category : "", // Default to empty string if not editing
    budget: transaction ? transaction.budget : "", // Add budget field
    amount: transaction ? transaction.amount : "",
    date: transaction ? transaction.date : "",
  });

  // Populate form when editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        // Ensure amount is a number (if applicable)
        amount: transaction.amount ? String(transaction.amount) : "",
      });
    } else {
      // Reset form data for new transactions
      setFormData({
        type: "income",
        category: "",
        budget: "", // Reset budget field
        amount: "",
        date: "",
      });
    }
  }, [transaction]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.date) {
      onSubmit(formData); // Submit the form data
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="transaction-form">
      <h3>{transaction ? "Edit Transaction" : "New Transaction"}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Transaction Type:
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        {/* Show category only if type is expense */}
        {formData.type === "expense" && (
          <label>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>{" "}
              {/* Placeholder option */}
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Show budget field only if type is expense */}
        {formData.type === "expense" && (
          <label>
            Budget:
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
            >
              <option value="">Select Budget</option> {/* Placeholder option */}
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.name}>
                  {budget.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Transaction Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </label>

        <div className="form-buttons">
          <button type="submit">{transaction ? "Update" : "Save"}</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;
