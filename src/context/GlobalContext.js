import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { login as authLogin, signup as authSignup } from "../utils/AuthService";

const GlobalContext = createContext();
// The GlobalProvider component wraps the entire app to provide state management
export const GlobalProvider = ({ children }) => {
  // Defining the state variables
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || ""
  );
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [cashFlow, setCashFlow] = useState({ income: 0, expenses: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = "https://your-backend-url.com/api"; // The base URL for the App

  // Axios instance
  const api = axios.create({ baseURL: BASE_URL });

  // Attach token to requests
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle token refresh on 401 errors
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          setToken(res.data.token); // Set the new token
          localStorage.setItem("token", res.data.token); // Save the new token in localStorage

          // Retry the failed request with the new token
          error.config.headers.Authorization = `Bearer ${res.data.token}`;
          return axios(error.config);
        } catch (refreshError) {
          console.error("Token refresh failed, logging out", refreshError);
          handleLogout(); // If refresh fails, log the user out
        }
      }
      return Promise.reject(error);
    }
  );

  // Fetching user data when the token is set
  useEffect(() => {
    if (token) {
      fetchUserDetails();
      fetchBudgets();
      fetchTransactions();
      fetchCategories();
    }
  }, [token]);

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await api.get("/user");
      setUser(response.data); // Storing user data in state
    } catch (error) {
      console.error("Failed to fetch user details", error);
      handleLogout(); // Log the user out if fetching fails
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      const response = await api.get("/budgets");
      setBudgets(response.data);
    } catch (error) {
      console.error("Failed to fetch budgets", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  // Add transaction
  const addTransaction = async (transaction) => {
    try {
      const response = await api.post("/transactions", transaction);
      setTransactions((prev) => [...prev, response.data]);
      fetchBudgets();
      fetchCategories();
    } catch (error) {
      console.error("Failed to add transaction", error);
    }
  };

  // Update transaction
  const updateTransaction = async (id, updatedTransaction) => {
    try {
      const response = await api.put(`/transactions/${id}`, updatedTransaction);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? response.data : t))
      );
      fetchBudgets();
      fetchCategories();
    } catch (error) {
      console.error("Failed to update transaction", error);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      fetchBudgets();
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  // Add budget
  const addBudget = async (budget) => {
    try {
      const response = await api.post("/budgets", budget);
      setBudgets((prev) => [...prev, response.data]);

      fetchTransactions();
      fetchCategories();
    } catch (error) {
      console.error("Failed to add budget", error);
    }
  };

  const updateBudget = async (id, updatedData) => {
    try {
      const response = await api.put(`/budgets/${id}`, updatedData);
      setBudgets((prev) => prev.map((b) => (b.id === id ? response.data : b)));

      fetchTransactions();
      fetchCategories();
    } catch (error) {
      console.error("Failed to update budget", error);
    }
  };

  // Delete budget
  const deleteBudget = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      setBudgets((prev) => prev.filter((b) => b.id !== id));

      fetchTransactions();
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete budget", error);
    }
  };

  // Handle login
  const handleLogin = async (identifier, password) => {
    setLoading(true);
    try {
      const data = await authLogin({ identifier, password });
      setToken(data.token); // Set token in state
      setRefreshToken(data.refreshToken); // Set refresh token in state
      setUser(data.user); // Set user data

      localStorage.setItem("token", data.token); // Save tokens in localStorage
      localStorage.setItem("refreshToken", data.refreshToken);

      // Reset app data after login
      setTransactions([]);
      setBudgets([]);
      setBalance(0);
      setCashFlow({ income: 0, expenses: 0 });
      setCategories([]);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (username, email, password) => {
    setLoading(true);
    try {
      const data = await authSignup({ username, email, password });
      setToken(data.token);
      setRefreshToken(data.refreshToken);
      setUser(data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null); // Reset user state
    setToken(""); // Clear token state
    setRefreshToken(""); // Clear refresh token
    setTransactions([]); 
    setBudgets([]);
    setBalance(0);
    setCashFlow({ income: 0, expenses: 0 });
    setCategories([]);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        token,
        transactions,
        budgets,
        balance,
        cashFlow,
        categories,
        loading,
        error,
        api,
        handleLogin,
        handleSignup,
        handleLogout,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);




// import React, { createContext, useContext, useState, useEffect } from "react";

// const GlobalContext = createContext();

// export const GlobalProvider = ({ children }) => {
//   const [transactions, setTransactions] = useState([]);
//   const [budgets, setBudgets] = useState([]);
//   const [balance, setBalance] = useState(0);
//   const [cashFlow, setCashFlow] = useState({ income: 0, expenses: 0 });
//   const [categories, setCategories] = useState([]);

//   const categoryData = [
//     { id: 1, name: "Food", color: "#C34AEB" },
//     { id: 2, name: "Subscriptions", color: "#C32A81" },
//     { id: 3, name: "Transportation", color: "#5CEB1B" },
//     { id: 4, name: "Utilities", color: "#E3A576" },
//     { id: 5, name: "Miscellaneous", color: "#C2B6B6" },
//   ];

//   useEffect(() => {
//     setCategories(categoryData);
//   }, []);

//   const recalculateTotals = (updatedTransactions, updatedBudgets) => {
//     const totalIncome = updatedTransactions
//       .filter((t) => t.type === "income")
//       .reduce((sum, t) => sum + Number(t.amount), 0);

//     const totalExpenses = updatedTransactions
//       .filter((t) => t.type === "expense")
//       .reduce((sum, t) => sum + Number(t.amount), 0);

//     setCashFlow({ income: totalIncome, expenses: totalExpenses });
//     setBalance(totalIncome - totalExpenses);

//     //  Calculate categories
//     const updatedCategories = categoryData.map((category) => {
//       const totalSpent = updatedTransactions
//         .filter((t) => t.categoryId === category.id && t.type === "expense")
//         .reduce((sum, t) => sum + Number(t.amount), 0);

//       // Only consider categories that have transactions
//       const usedCategories = categoryData.filter((cat) =>
//         updatedTransactions.some(
//           (t) => t.categoryId === cat.id && t.type === "expense"
//         )
//       );

//       const totalUsedExpenses = usedCategories.reduce((sum, cat) => {
//         const catSpent = updatedTransactions
//           .filter((t) => t.categoryId === cat.id && t.type === "expense")
//           .reduce((sum, t) => sum + Number(t.amount), 0);
//         return sum + catSpent;
//       }, 0);

//       // Normalize percentage based on only the used categories
//       const percentage =
//         totalUsedExpenses > 0 ? (totalSpent / totalUsedExpenses) * 100 : 0;

//       return {
//         ...category,
//         totalSpent,
//         percentage: parseFloat(percentage.toFixed(2)),
//       };
//     });

//     setCategories(updatedCategories);

//     // Update budget spent amounts
//     const updatedBudgetsWithSpent = updatedBudgets.map((budget) => {
//       const spent = updatedTransactions
//         .filter((t) => t.budgetId === budget.id && t.type === "expense")
//         .reduce((sum, t) => sum + Number(t.amount), 0);

//       return {
//         ...budget,
//         spent,
//         amountLeft: budget.allocated - spent,
//         status: getBudgetStatus(budget.allocated - spent),
//       };
//     });

//     setBudgets(updatedBudgetsWithSpent);
//   };

//   const getBudgetStatus = (amountLeft) => {
//     if (amountLeft < 0) return "Exceeded";
//     if (amountLeft === 0) return "Inactive";
//     return "Active";
//   };

//   const addTransaction = (transaction) => {
//     setTransactions((prevTransactions) => {
//       const updatedTransactions = [
//         ...prevTransactions,
//         { id: Date.now(), ...transaction },
//       ];
//       recalculateTotals(updatedTransactions, budgets);
//       return updatedTransactions;
//     });
//   };

//   const updateTransaction = (id, updatedTransaction) => {
//     setTransactions((prevTransactions) => {
//       const updatedTransactions = prevTransactions.map((t) =>
//         t.id === id ? { ...t, ...updatedTransaction } : t
//       );
//       recalculateTotals(updatedTransactions, budgets);
//       return updatedTransactions;
//     });
//   };

//   const deleteTransaction = (id) => {
//     setTransactions((prevTransactions) => {
//       const updatedTransactions = prevTransactions.filter((t) => t.id !== id);
//       recalculateTotals(updatedTransactions, budgets);
//       return updatedTransactions;
//     });
//   };

//   // Function to add a budget
//   const addBudget = (budget) => {
//     setBudgets((prevBudgets) => {
//       const newBudget = {
//         id: Date.now(),
//         ...budget,
//         spent: transactions
//           .filter((t) => t.budgetId === budget.id && t.type === "expense")
//           .reduce((sum, t) => sum + Number(t.amount), 0),
//       };
//       newBudget.amountLeft = newBudget.allocated - newBudget.spent;
//       newBudget.status = getBudgetStatus(newBudget.amountLeft);
//       const updatedBudgets = [...prevBudgets, newBudget];
//       recalculateTotals(transactions, updatedBudgets);
//       return updatedBudgets;
//     });
//   };

//   //Function to Update Budget
//   const updateBudget = (id, updatedBudget) => {
//     setBudgets((prevBudgets) => {
//       const updatedBudgets = prevBudgets.map((b) => {
//         if (b.id === id) {
//           const spent = transactions
//             .filter((t) => t.budgetId === id && t.type === "expense")
//             .reduce((sum, t) => sum + Number(t.amount), 0);

//           const amountLeft = updatedBudget.allocated - spent;

//           return {
//             ...b,
//             ...updatedBudget,
//             spent,
//             amountLeft,
//             status: getBudgetStatus(amountLeft),
//           };
//         }
//         return b;
//       });

//       recalculateTotals(transactions, updatedBudgets);
//       return updatedBudgets;
//     });
//   };

//   //Function to delete Budget
//   const deleteBudget = (id) => {
//     setBudgets((prevBudgets) => {
//       const updatedBudgets = prevBudgets.filter((b) => b.id !== id);
//       recalculateTotals(transactions, updatedBudgets);
//       return updatedBudgets;
//     });
//   };

//   return (
//     <GlobalContext.Provider
//       value={{
//         transactions,
//         budgets,
//         balance,
//         cashFlow,
//         categories,
//         addTransaction,
//         updateTransaction,
//         deleteTransaction,
//         addBudget,
//         updateBudget,
//         deleteBudget,
//       }}
//     >
//       {children}
//     </GlobalContext.Provider>
//   );
// };

// export const useGlobalContext = () => {
//   return useContext(GlobalContext);
// };
//
