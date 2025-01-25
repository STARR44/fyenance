import React, { createContext, useContext, useState, useEffect } from "react";

import { jwtDecode } from "jwt-decode";
import useAxios from "../utils/useAxios"; // Ensure correct path to useAxios
import AuthContext from "./AuthContext"; // Assuming your AuthContext exists for authentication

const GlobalContext = createContext();

const baseURL = 'http://127.0.0.1:8000'

export const GlobalProvider = ({ children }) => {
  const axiosInstance = useAxios();
  const { authTokens } = useContext(AuthContext); // Get authTokens from AuthContext

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [cashFlow, setCashFlow] = useState({ income: 0, expenses: 0 });
  const [balance, setBalance] = useState(0); // Initialize balance

  // Decode the token to get balance and other user data
  useEffect(() => {
    if (authTokens) {
      const decodedToken = jwtDecode(authTokens.access);
      setBalance(parseFloat(decodedToken.account_balance));
    }
  }, [authTokens]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, budgetsRes, categoriesRes] = await Promise.all([
          axiosInstance.get(`${baseURL}/api/transactions/`),
          axiosInstance.get(`${baseURL}/api/budgets/`),
          axiosInstance.get(`${baseURL}/api/categories/`),
        ]);

        setTransactions(transactionsRes.data);
        setBudgets(budgetsRes.data);
        setCategories(categoriesRes.data);

        // Optional: Calculate cash flow if not directly provided by backend
        const income = transactionsRes.data
          .filter((t) => t.type === "Income")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = transactionsRes.data
          .filter((t) => t.type === "Expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        setCashFlow({ income, expenses });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    console.log(budgets)
    console.log(categories)

    fetchData();
  // }, [axiosInstance]);
      if (authTokens) fetchData();
  }, [authTokens]);



  const addTransaction = async (transaction) => {
    try {
      // Directly send transaction data to the server
      const response = await axiosInstance.post(`${baseURL}/api/transactions/`, transaction);
      setTransactions((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding transaction:", error.message);
    }
  };


  // Update a transaction

  const updateTransaction = async (id, updatedTransaction) => {
    try {
      // Construct payload based on transaction type
      const payload = {
        transaction_id: updatedTransaction.transaction_id,
        amount: updatedTransaction.amount,
        type: updatedTransaction.type,
        date_created: updatedTransaction.date_created,
      };
  
      // Add category and budget only for Expense transactions
      if (updatedTransaction.type === "Expense") {
        if (updatedTransaction.category) {
          const categoryObj = categories.find(
            (cat) => cat.name === updatedTransaction.category
          );
          if (categoryObj) payload.category = categoryObj.id;
        }
        if (updatedTransaction.budget) {
          const budgetObj = budgets.find(
            (budget) => budget.name === updatedTransaction.budget
          );
          if (budgetObj) payload.budget = budgetObj.id;
        }
      }
  
      // Send request to backend
      const response = await axiosInstance.post(`${baseURL}/api/transactions/`, payload);
  
      // Update state with the updated transaction
      setTransactions((prev) =>
        prev.map((t) => (t.transaction_id === id ? response.data : t))
      );
    } catch (error) {
      console.error("Error updating transaction:", error.message);
    }
  };


  // Delete a transaction
  const deleteTransaction = async (id) => {
    try {
      await axiosInstance.delete(`${baseURL}/api/transactions/`, {
        data: { transaction_id: id },
      });

      setTransactions((prev) => prev.filter((t) => t.transaction_id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Add a budget
  const addBudget = async (budget) => {
    try {
      const response = await axiosInstance.post(`${baseURL}/api/budgets/`, budget);
      setBudgets((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  // Update a budget
  const updateBudget = async (id, updatedBudget) => {
    try {
      const response = await axiosInstance.post(`${baseURL}/api/budgets/`, {
        name: id,
        ...updatedBudget,
      });

      setBudgets((prev) =>
        prev.map((b) => (b.id === id ? response.data : b))
      );
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  // Delete a budget
  const deleteBudget = async (id) => {
    try {
      await axiosInstance.delete(`${baseURL}/api/budgets/`, {
        data: { name: id },
      });

      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const BASE_URL = "https://your-backend-url.com/api"; // The base URL for the App

//   // Axios instance
//   const api = axios.create({ baseURL: BASE_URL });

//   // Attach token to requests
//   api.interceptors.request.use((config) => {
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   // Handle token refresh on 401 errors
//   api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       if (error.response?.status === 401 && refreshToken) {
//         try {
//           const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
//             refreshToken,
//           });
//           setToken(res.data.token); // Set the new token
//           localStorage.setItem("token", res.data.token); // Save the new token in localStorage

//           // Retry the failed request with the new token
//           error.config.headers.Authorization = `Bearer ${res.data.token}`;
//           return axios(error.config);
//         } catch (refreshError) {
//           console.error("Token refresh failed, logging out", refreshError);
//           handleLogout(); // If refresh fails, log the user out
//         }
//       }
//       return Promise.reject(error);
//     }
//   );

//   // Fetching user data when the token is set
//   useEffect(() => {
//     if (token) {
//       fetchUserDetails();
//       fetchBudgets();
//       fetchTransactions();
//       fetchCategories();
//     }
//   }, [token]);

//   // Fetch user details
//   const fetchUserDetails = async () => {
//     try {
//       const response = await api.get("/user");
//       setUser(response.data); // Storing user data in state
//     } catch (error) {
//       console.error("Failed to fetch user details", error);
//       handleLogout(); // Log the user out if fetching fails
//     }
//   };

//   // Fetch transactions
//   const fetchTransactions = async () => {
//     try {
//       const response = await api.get("/transactions");
//       setTransactions(response.data);
//     } catch (error) {
//       console.error("Failed to fetch transactions", error);
//     }
//   };

//   // Fetch budgets
//   const fetchBudgets = async () => {
//     try {
//       const response = await api.get("/budgets");
//       setBudgets(response.data);
//     } catch (error) {
//       console.error("Failed to fetch budgets", error);
//     }
//   };

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const response = await api.get("/categories");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Failed to fetch categories", error);
//     }
//   };

//   // Add transaction
//   const addTransaction = async (transaction) => {
//     try {
//       const response = await api.post("/transactions", transaction);
//       setTransactions((prev) => [...prev, response.data]);
//       fetchBudgets();
//       fetchCategories();
//     } catch (error) {
//       console.error("Failed to add transaction", error);
//     }
//   };

//   // Update transaction
//   const updateTransaction = async (id, updatedTransaction) => {
//     try {
//       const response = await api.put(`/transactions/${id}`, updatedTransaction);
//       setTransactions((prev) =>
//         prev.map((t) => (t.id === id ? response.data : t))
//       );
//       fetchBudgets();
//       fetchCategories();
//     } catch (error) {
//       console.error("Failed to update transaction", error);
//     }
//   };

//   // Delete transaction
//   const deleteTransaction = async (id) => {
//     try {
//       await api.delete(`/transactions/${id}`);
//       setTransactions((prev) => prev.filter((t) => t.id !== id));
//       fetchBudgets();
//       fetchCategories();
//     } catch (error) {
//       console.error("Failed to delete transaction", error);
//     }
//   };

//   // Add budget
//   const addBudget = async (budget) => {
//     try {
//       const response = await api.post("/budgets", budget);
//       setBudgets((prev) => [...prev, response.data]);

//       fetchTransactions();
//       fetchCategories();
//     } catch (error) {
//       console.error("Failed to add budget", error);
//     }
//   };

//   const updateBudget = async (id, updatedData) => {
//     try {
//       const response = await api.put(`/budgets/${id}`, updatedData);
//       setBudgets((prev) => prev.map((b) => (b.id === id ? response.data : b)));

//       fetchTransactions();
//       fetchCategories();
//     } catch (error) {
//       console.error("Failed to update budget", error);
//     }
//   };

//   // Delete budget
//   const deleteBudget = async (id) => {
//     try {
//       await api.delete(`/budgets/${id}`);
//       setBudgets((prev) => prev.filter((b) => b.id !== id));

//       fetchTransactions();
//       fetchCategories();
//     } catch (error) {
//       console.error("Failed to delete budget", error);
//     }
//   };

//   // Handle login
//   const handleLogin = async (identifier, password) => {
//     setLoading(true);
//     try {
//       const data = await authLogin({ identifier, password });
//       setToken(data.token); // Set token in state
//       setRefreshToken(data.refreshToken); // Set refresh token in state
//       setUser(data.user); // Set user data

//       localStorage.setItem("token", data.token); // Save tokens in localStorage
//       localStorage.setItem("refreshToken", data.refreshToken);

//       // Reset app data after login
//       setTransactions([]);
//       setBudgets([]);
//       setBalance(0);
//       setCashFlow({ income: 0, expenses: 0 });
//       setCategories([]);
//     } catch (err) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle signup
//   const handleSignup = async (username, email, password) => {
//     setLoading(true);
//     try {
//       const data = await authSignup({ username, email, password });
//       setToken(data.token);
//       setRefreshToken(data.refreshToken);
//       setUser(data.user);

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("refreshToken", data.refreshToken);
//     } catch (err) {
//       setError(err.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle logout
//   const handleLogout = () => {
//     setUser(null); // Reset user state
//     setToken(""); // Clear token state
//     setRefreshToken(""); // Clear refresh token
//     setTransactions([]); 
//     setBudgets([]);
//     setBalance(0);
//     setCashFlow({ income: 0, expenses: 0 });
//     setCategories([]);
//     localStorage.removeItem("token");
//     localStorage.removeItem("refreshToken");
//   };

  return (
    <GlobalContext.Provider
      value={{
        user,
        token,
        transactions,
        budgets,
        categories,
        balance,
        cashFlow,
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

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};







