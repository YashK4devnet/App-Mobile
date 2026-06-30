import { apiRequest } from "../API_CONFIG";

export const authService = {
  // Login API call
  login: async (credentials) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Register API call
  register: async (userData) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Logout API call
  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },
};
