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
   ```

2. **Create a Virtual Environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use venv\Scripts\activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up the Database:**
   - Open `fyenance_backend/settings.py` and configure the database settings as needed (default is SQLite).
   - Apply migrations:
     ```bash
     python manage.py migrate
     ```

5. **Run the Development Server:**
   ```bash
   python manage.py runserver
   ```

6. **(Optional) Create a Superuser for Admin Access:**
   ```bash
   python manage.py createsuperuser
   ```

7. **API Testing and Frontend Connection:**
   - The API will be accessible at `http://127.0.0.1:8000`.
   - Ensure the frontend communicates with the backend by configuring the appropriate endpoints in the React app.

   ---

   ## React Setup Instructions
   To set up the React frontend, follow these steps:
   
   ## Step 1: Clone the Repository
   First, clone the repository from GitHub and navigate into the project folder
```bash
   git clone <repository-url>
   cd fyenance_frontend
```

   ## Step 2: Install Dependencies
   Now, install all the required dependencies.
```bash
   npm install
```

   ## Step 3: Configure API Base URL
   Set the API base URL by creating an `.env` file.
```bash
   touch .env
   echo "REACT_APP_API_BASE_URL=http://127.0.0.1:8000" >> .env
```
   Then, in your React code, you can use the API base URL like this:
```bash
   const baseURL = process.env.REACT_APP_API_BASE_URL;
```

   ## Step 4: Ignore Unnecessary Files
   To avoid pushing unnecessary files like `node_modules/` and `.env`, add them to your `.gitignore`.
```bash
   touch .gitignore
   echo "node_modules/" >> .gitignore
   echo ".env" >> .gitignore
```
   Then, commit the .gitignore file.
```bash
   git add .gitignore
   git commit -m "Added .gitignore to exclude unnecessary files"
```

   ## Step 5: Start the Development Server
   Run the development server to preview the app.
```bash
   npm start
```
   Once the server starts, open your browser and visit:
```bash
   http://localhost:3000
```

   ## Step 6: Push Changes to GitHub
```bash
   git add .
   git commit -m "Set up initial React frontend and configuration"
   git push origin master
```

   ---
