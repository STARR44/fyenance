# Fyenance

## Overview
The Expense Tracker application provides an interactive user interface for managing expenses, budgets, and transactions. Built with React and Django, it combines a responsive frontend with a robust backend to ensure efficient expense tracking and management.

---

## 🚩 Key Features

### Dynamic Dashboard:
- **For New Users:**
  - Placeholder text: "Nothing to display yet."
  - Interactive prompts for adding a transaction, creating a budget, and linking a bank account.
- **For Returning Users:**
  - Personalized greeting with the user’s name and current time.
  - Overview of transactions and budgets.

### Profile Menu:
- Displays user details (name and email).
- Links to settings and logout options.

### Reusable Components:
- Navigation bar.
- Buttons and form fields.
- Profile menu.

### Auth Context:
- Manages user authentication.

### Global State Management:
- Manages user's transactions and budgets.
- Simplifies frontend-backend communication.

### Design:
- A clean and minimalist interface ensures a pleasant expense-tracking experience.

---

## Technology Stack
- **React:** Provides the dynamic, interactive functionality of the application.
- **CSS:** Ensures a modern, consistent, and responsive design for the UI.
- **Django:** Handles backend tasks such as database management, server-side logic, and API endpoints for dynamic content rendering.

---

## Usage
1. Fyenance is ideal for individuals tracking weekly or monthly expenses to ensure they stay within budget.
2. Click on the **Add Transaction** or **Add Budget** button and **Save** to start using the app.
3. To edit a transaction, click the **Edit** button, modify the text, and press **Save** to reflect the changes.
4. Delete a transaction by clicking the **Delete** button.

---

## Django Setup Instructions
To set up the Django backend, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd fyenance_backend
