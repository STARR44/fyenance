import axios from "axios";
const BASE_URL = "https://your-backend-url.com/api";

// Login function to authenticate user
export const login = async ({ identifier, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      identifier,
      password,
    });
    return response.data; // Return the data which includes the token and user info
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};

// Signup function to register a new user
export const signup = async ({ username, email, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      username,
      email,
      password,
    });
    return response.data; // Return the data which includes the token and user info
  } catch (error) {
    throw new Error("Signup failed: " + error.message);
  }
};
