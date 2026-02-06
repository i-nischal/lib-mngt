// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000/uploads";

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// User Roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Book Categories (example - can be dynamic from API)
export const BOOK_CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Fantasy",
  "Mystery",
  "Romance",
  "Thriller",
  "Self-Help",
  "Business",
  "Education",
  "Children",
  "Other",
];

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Logged out successfully!",
  REGISTER_SUCCESS: "Registration successful!",
  BOOK_CREATED: "Book created successfully!",
  BOOK_UPDATED: "Book updated successfully!",
  BOOK_DELETED: "Book deleted successfully!",
  CATEGORY_CREATED: "Category created successfully!",
  CATEGORY_UPDATED: "Category updated successfully!",
  CATEGORY_DELETED: "Category deleted successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  ERROR: "Something went wrong. Please try again.",
};

// Image Settings
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

// Date Formats
export const DATE_FORMAT = "MMM DD, YYYY";
export const DATETIME_FORMAT = "MMM DD, YYYY hh:mm A";