import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import "./TransactionForm.css";

function TransactionForm({ transaction, onCancel }) {
  const { addTransaction, updateTransaction, categories, budgets } =
    useGlobalContext();

  const [formData, setFormData] = useState({
    type: "expense",
    categoryId: "",
    budgetId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        amount: transaction.amount ? String(transaction.amount) : "",
      });
    } else {
      resetForm();
    }
  }, [transaction]);

  const resetForm = () => {
    setFormData({
      type: "expense",
      categoryId: "",
      budgetId: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount"
          ? Number(value)
          : name === "categoryId" || name === "budgetId"
          ? value
            ? Number(value)
            : "" // Ensure IDs are stored as numbers
          : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = "Amount is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      if (transaction) {
        updateTransaction(transaction.id, formData);
      } else {
        addTransaction(formData);
      }
      resetForm();
      onCancel();
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

        {formData.type === "expense" && (
          <>
            <label>
              Category:
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
              >
                <option value="">Select Category (optional)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Budget:
              <select
                name="budgetId"
                value={formData.budgetId}
                onChange={handleInputChange}
              >
                <option value="">Select Budget (optional)</option>
                {budgets.map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
              </select>
            </label>
          </>
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
          {errors.amount && <p className="error">{errors.amount}</p>}
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
          {errors.date && <p className="error">{errors.date}</p>}
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
