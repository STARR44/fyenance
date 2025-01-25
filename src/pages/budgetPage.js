import React, { useState, useRef, useEffect } from "react";
import DashboardNav from "../components/DashboardComponents/DashboardNav";
import BudgetForm from "../components/budgetForm";
import { useCurrency } from "../context/currencyContext";
import { useGlobalContext } from "../context/GlobalContext";
import { formatCurrency } from "../utils/formatCurrency";
import "./budgetPage.css";

function BudgetPage() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useGlobalContext();
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
        setEditingBudget(null);
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
      updateBudget(budget.id, budget);
    } else {
      addBudget(budget);
    }
    setEditingBudget(null);
  };

  const handleDeleteBudget = (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      deleteBudget(id);
    }
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
                const statusColor =
                  budget.status === "Exceeded"
                    ? "#EE3535"
                    : budget.status === "Inactive"
                    ? "#898989"
                    : "#3F3E39";

                return (
                  <tr key={budget.id}>
                    <td>{budget.name}</td>
                    <td>{formatCurrency(budget.amount_allocated, currency, false)}</td>
                    <td
                      style={{
                        color: budget.amount_left >= 0 ? "#4ECC5A" : "#EE3535",
                      }}
                    >
                      {budget.amount_left < 0 ? "-" : ""}
                      {formatCurrency(
                        Math.abs(budget.amount_left),
                        currency,
                        false
                      )}
                    </td>
                    <td style={{ color: statusColor }}>{budget.status}</td>
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
