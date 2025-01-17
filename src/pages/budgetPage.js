import React, { useState, useRef, useEffect } from "react";
import DashboardNav from "../components/DashboardComponents/DashboardNav";
import BudgetForm from "../components/budgetForm";
import { useCurrency } from "../context/currencyContext";
import { formatCurrency } from "../utils/formatCurrency";
import "./budgetPage.css";

function BudgetPage() {
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      name: "Groceries",
      amountAllocated: 5000,
      amountSpent: 200,
      startDate: "2025-01-01",
      endDate: "2025-01-31",
    },
    {
      id: 2,
      name: "Vacation",
      amountAllocated: 3000,
      amountSpent: 3200,
      startDate: "2025-02-01",
      endDate: "2025-02-28",
    },
  ]);
  const { currency } = useCurrency();
  const [editingBudget, setEditingBudget] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const formRef = useRef(null);

  // Debounce search query for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close the form when clicking outside it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setEditingBudget(null); // Close the form
      }
    };

    if (editingBudget) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingBudget]);

  const handleAddOrEditBudget = (budget) => {
    if (budget.id) {
      setBudgets((prev) => prev.map((b) => (b.id === budget.id ? budget : b)));
    } else {
      setBudgets((prev) => [
        ...prev,
        {
          ...budget,
          id: budgets.length + 1,
          amountSpent: 0,
        },
      ]);
    }
    setEditingBudget(null); // Close the form
  };

  const handleDeleteBudget = (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      setBudgets((prev) => prev.filter((budget) => budget.id !== id));
    }
  };

  const calculateStatus = (budget) => {
    const remaining = budget.amountAllocated - budget.amountSpent;
    if (remaining < 0) return { label: "Exceeded", color: "#EE3535" };
    if (remaining === 0) return { label: "Inactive", color: "gray" };
    return { label: "Active", color: "#4ECC5A" };
  };

  const filteredBudgets = budgets.filter((budget) =>
    budget.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  return (
    <>
      <DashboardNav />
      <div className="budget-page">
        {/* Search and Add Budget Controls */}
        <div className="budget-actions">
          <input
            type="text"
            className="search-budget"
            placeholder="Search Budgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-budget" onClick={() => setEditingBudget({})}>
            Add Budget
          </button>
        </div>

        {/* Budget Form */}
        {editingBudget && (
          <div className="budget-form-container" ref={formRef}>
            <BudgetForm
              onSubmit={handleAddOrEditBudget}
              onCancel={() => setEditingBudget(null)}
              initialData={editingBudget}
            />
          </div>
        )}

        {/* Budget Table */}
        <table className="budget-table">
          <thead>
            <tr>
              <th>Budget Name</th>
              <th>Allocated</th>
              <th>Amount Left</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBudgets.length > 0 ? (
              filteredBudgets.map((budget) => {
                const status = calculateStatus(budget);
                const remaining = budget.amountAllocated - budget.amountSpent;

                return (
                  <tr key={budget.id}>
                    <td>{budget.name}</td>
                    <td>
                      {formatCurrency(budget.amountAllocated, currency, false)}
                    </td>
                    {/* Suppress decimals */}
                    <td
                      style={{ color: remaining >= 0 ? "#4ECC5A" : "#EE3535" }}
                    >
                      {remaining < 0 ? "-" : ""}
                      {formatCurrency(Math.abs(remaining), currency, false)}
                      {/* Suppress decimals */}
                    </td>
                    <td style={{ color: status.color }}>{status.label}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => setEditingBudget(budget)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5">No budgets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default BudgetPage;
