import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import { CurrencyProvider } from "./context/currencyContext"; // Import CurrencyProvider to manage global currency state
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider for authentication context
import LandingPage from "./pages/LandingPage"; // Import Landing page
import About from "./pages/AboutPage"; // Import About page
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPages/MainDashboard"; // Import Dashboard page component
import TransactionPage from "./pages/TransactionPage";
import BudgetPage from "./pages/budgetPage";
import PrivateRoute from './utils/PrivateRoute';
import SettingsPage from "./pages/DashboardPages/SettingsPages/Settings"; // Import SettingsPage

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalProvider>
          <CurrencyProvider>
              <div>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Private Routes */}

                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <DashboardPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <PrivateRoute>
                        <TransactionPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/budgets"
                    element={
                      <PrivateRoute>
                        <BudgetPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <SettingsPage />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </div>

          </CurrencyProvider>
        </GlobalProvider>
      </AuthProvider>
    </Router>
    
  );
}

export default App;
