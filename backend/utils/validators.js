// Email validation
export const validateEmail = (email) => {
  const errors = [];

  if (!email || !email.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email address");
  }

  return errors;
};

// Password validation
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return errors;
};

// Username validation
export const validateUsername = (username) => {
  const errors = [];

  if (!username || !username.trim()) {
    errors.push("Username is required");
  } else if (username.length < 3) {
    errors.push("Username must be at least 3 characters long");
  } else if (username.length > 50) {
    errors.push("Username cannot exceed 50 characters");
  }

  return errors;
};

// Book validation
export const validateBook = (bookData) => {
  const errors = {};

  // Title validation
  if (!bookData.title || !bookData.title.trim()) {
    errors.title = "Title is required";
  } else if (bookData.title.length > 100) {
    errors.title = "Title cannot exceed 100 characters";
  }

  // Author validation
  if (!bookData.author || !bookData.author.trim()) {
    errors.author = "Author is required";
  } else if (bookData.author.length > 100) {
    errors.author = "Author name cannot exceed 100 characters";
  }

  // Category validation
  if (!bookData.category || !bookData.category.trim()) {
    errors.category = "Category is required";
  }

  // Description validation (optional)
  if (bookData.description && bookData.description.length > 1000) {
    errors.description = "Description cannot exceed 1000 characters";
  }

  // Published year validation (optional)
  if (bookData.publishedYear) {
    const year = parseInt(bookData.publishedYear);
    const currentYear = new Date().getFullYear();

    if (isNaN(year)) {
      errors.publishedYear = "Please enter a valid year";
    } else if (year < 1000 || year > currentYear) {
      errors.publishedYear = `Year must be between 1000 and ${currentYear}`;
    }
  }

  return errors;
};

// Category validation
export const validateCategory = (categoryData) => {
  const errors = {};

  // Name validation
  if (!categoryData.name || !categoryData.name.trim()) {
    errors.name = "Category name is required";
  } else if (categoryData.name.length > 50) {
    errors.name = "Category name cannot exceed 50 characters";
  }

  // Description validation (optional)
  if (categoryData.description && categoryData.description.length > 200) {
    errors.description = "Description cannot exceed 200 characters";
  }

  return errors;
};

// Profile update validation
export const validateProfile = (profileData) => {
  const errors = {};

  // Username validation
  if (profileData.username) {
    const usernameErrors = validateUsername(profileData.username);
    if (usernameErrors.length > 0) {
      errors.username = usernameErrors[0];
    }
  }

  // Email validation
  if (profileData.email) {
    const emailErrors = validateEmail(profileData.email);
    if (emailErrors.length > 0) {
      errors.email = emailErrors[0];
    }
  }

  // Password validation (if changing password)
  if (profileData.password) {
    const passwordErrors = validatePassword(profileData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0];
    }
  }

  // Confirm password validation
  if (profileData.password && profileData.confirmPassword) {
    if (profileData.password !== profileData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
};

// File validation
export const validateFile = (
  file,
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"],
) => {
  const errors = [];

  if (!file) {
    return errors;
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must not exceed ${maxSize / (1024 * 1024)}MB`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(", ")}`);
  }

  return errors;
};

// Search query validation
export const validateSearchQuery = (query) => {
  const errors = [];

  if (query && query.length < 2) {
    errors.push("Search query must be at least 2 characters");
  }

  if (query && query.length > 100) {
    errors.push("Search query cannot exceed 100 characters");
  }

  return errors;
};
