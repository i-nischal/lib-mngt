import api from "./api";

// Get dashboard summary
export const getSummary = async () => {
  const response = await api.get("/analytics/summary");
  return response.data;
};

// Get books by category
export const getBooksByCategory = async () => {
  const response = await api.get("/analytics/books-by-category");
  return response.data;
};

// Get books by month
export const getBooksByMonth = async () => {
  const response = await api.get("/analytics/books-by-month");
  return response.data;
};

// Get books by author
export const getBooksByAuthor = async () => {
  const response = await api.get("/analytics/books-by-author");
  return response.data;
};

// Get user statistics
export const getUserStats = async () => {
  const response = await api.get("/analytics/user-stats");
  return response.data;
};
