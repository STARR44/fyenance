import React, { useState, useEffect } from "react";
import "./budgetForm.css";

function BudgetForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    amountAllocated: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate the form with initial data when component mounts
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Budget Name is required.";
    }
    if (!formData.amountAllocated || Number(formData.amountAllocated) <= 0) {
      newErrors.amountAllocated = "Amount Allocated must be greater than zero.";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required.";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End Date is required.";
    } else if (
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End Date must be later than or equal to Start Date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true); // Simulate submission state
      setTimeout(() => {
        onSubmit(formData); // Call the onSubmit handler
        setIsSubmitting(false); // Reset submission state
        setFormData({
          name: "",
          amountAllocated: "",
          startDate: "",
          endDate: "",
        }); // Reset the form
      }, 1000);
    }
  };

  return (
    <div className="budget-form">
      <h3>New Budget</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Budget Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter budget name"
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>
        <label>
          Amount Allocated:
          <input
            type="number"
            name="amountAllocated"
            value={formData.amountAllocated}
            onChange={handleInputChange}
            placeholder="Enter allocated amount"
          />
          {errors.amountAllocated && (
            <small className="error">{errors.amountAllocated}</small>
          )}
        </label>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
          {errors.startDate && (
            <small className="error">{errors.startDate}</small>
          )}
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
          {errors.endDate && <small className="error">{errors.endDate}</small>}
        </label>
        <div className="form-buttons">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BudgetForm;
