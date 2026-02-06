import api from "./api";

// Get all books with pagination and filters
export const getAllBooks = async (params = {}) => {
  const response = await api.get("/books", { params });
  return response.data;
};

// Get single book by ID
export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

// Create new book
export const createBook = async (bookData) => {
  const formData = new FormData();

  // Append all book data
  Object.keys(bookData).forEach((key) => {
    if (bookData[key] !== null && bookData[key] !== undefined) {
      formData.append(key, bookData[key]);
    }
  });

  const response = await api.post("/books", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update book
export const updateBook = async (id, bookData) => {
  const formData = new FormData();

  // Append all book data
  Object.keys(bookData).forEach((key) => {
    if (bookData[key] !== null && bookData[key] !== undefined) {
      formData.append(key, bookData[key]);
    }
  });

  const response = await api.put(`/books/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete book
export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

// Get books added by current user
export const getMyBooks = async () => {
  const response = await api.get("/books/mybooks");
  return response.data;
};

// Search books
export const searchBooks = async (searchTerm) => {
  const response = await api.get("/books", {
    params: { search: searchTerm },
  });
  return response.data;
};

// Filter books by category
export const filterBooksByCategory = async (category) => {
  const response = await api.get("/books", {
    params: { category },
  });
  return response.data;
};

// Filter books by author
export const filterBooksByAuthor = async (author) => {
  const response = await api.get("/books", {
    params: { author },
  });
  return response.data;
};
