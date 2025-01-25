import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import "./TransactionForm.css";

function TransactionForm({ transaction, onCancel }) {
  const { addTransaction, updateTransaction, categories, budgets } =
    useGlobalContext();
    console.log(budgets)
    console.log(categories)

  const [formData, setFormData] = useState({
    type: "Expense",
    category: "",
    budget: "",
    amount: "",
    date_created: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        amount: transaction.amount ? String(transaction.amount) : "",
        category: transaction.category || "", // Ensure we handle ID here
        budget: transaction.budget || "",
      });

      console.log(budgets)
      console.log(categories)
    } else {
      resetForm();
    }
  }, [transaction]);

  // useEffect(() => {
  //   if (transaction) {
  //     setFormData({
  //       ...transaction,
  //       amount: transaction.amount ? String(transaction.amount) : "",
  //     });
  //   } else {
  //     resetForm();
  //   }
  // }, [transaction]);

  const resetForm = () => {
    setFormData({
      type: "Expense",
      category: "",
      budget: "",
      amount: "",
      date_created: new Date().toISOString().split("T")[0],
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value, // Do not convert dropdown values to numbers
    }));
  
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   // setFormData((prev) => ({
  //   //   ...prev,
  //   //   [name]:
  //   //     name === "amount"
  //   //       ? Number(value)
  //   //       : name === "category" || name === "budget"
  //   //       ? value
  //   //         ? Number(value)
  //   //         : "" // Ensure IDs are stored as numbers
  //   //       : value,
  //   // }));

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: name === "amount" ? Number(value) : value ? Number(value) : null, // Convert to number or set to null
  //   }));

  //   setErrors((prev) => ({ ...prev, [name]: "" }));
  // };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = "Amount is required.";
    if (!formData.date_created) newErrors.date_created = "Date is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Debugging step
  
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      if (transaction) {
        updateTransaction(transaction.id, formData);
      } else {
        addTransaction(formData); // Use formData directly
      }
      resetForm();
      onCancel();
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const payload = {
  //     ...formData,
  //     budget: formData.budget, // Map budgetId to budget
  //     budgetId: undefined, // Remove unnecessary budgetId key
  //   };


  //   const validationErrors = validateForm();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //   } else {
  //     if (transaction) {
  //       updateTransaction(transaction.id, payload);
  //     } else {
  //       addTransaction(payload);
  //     }
  //     resetForm();
  //     onCancel();
  //   }
  //   // if (Object.keys(validationErrors).length > 0) {
  //   //   setErrors(validationErrors);
  //   // } else {
  //   //   if (transaction) {
  //   //     updateTransaction(transaction.id, formData);
  //   //   } else {
  //   //     addTransaction(formData);
  //   //   }
  //   //   resetForm();
  //   //   onCancel();
  //   // }
  // };

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
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </label>

        {formData.type === "Expense" && (
          <>
            <label>
              Category:
              <select
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Category (optional)</option>
                {categories.map((category) => (
                  <option key={categories.indexOf(category.id)} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Budget:
              <select
                name="budget"
                value={formData.budget || ""}
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
            {/* <label>
              Category:
              <select
                name="category" // Match backend key
                value={formData.category || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Category (optional)</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Budget:
              <select
                name="budget" // Use budgetId for internal handling
                value={formData.budget || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Budget (optional)</option>
                {budgets.map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
              </select>
            </label> */}
          </>
        )}

        {/* {formData.type === "Expense" && (
          <>
            <label>
              Category:
              <select
                name="category"
                value={formData.category}
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
        )} */}

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
            name="date_created"
            value={formData.date_created}
            onChange={handleInputChange}
            required
          />
          {errors.date_created && <p className="error">{errors.date_created}</p>}
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
