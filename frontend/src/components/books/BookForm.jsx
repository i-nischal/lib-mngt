import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, BookOpen, Plus } from "lucide-react";
import Card from "../common/Card";
import Alert from "../common/Alert";
import Button from "../common/Button";
import Input from "../common/Input";
import Loader from "../common/Loader";
import { getAllCategories } from "../../services/categoryService";
import {
  createBook,
  updateBook,
  getBookById,
} from "../../services/bookService";

const BookForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingBook, setFetchingBook] = useState(mode === "edit");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    isbn: "",
    publishedYear: "",
    coverImage: null,
  });

  useEffect(() => {
    fetchCategories();
    if (mode === "edit" && id) {
      fetchBook();
    }
  }, [id, mode]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchBook = async () => {
    try {
      setFetchingBook(true);
      const response = await getBookById(id);
      const book = response.book;

      // Check if category exists in the list
      const categoryExists = categories.some(
        (cat) => cat.name === book.category,
      );
      setUseCustomCategory(!categoryExists && book.category);

      setFormData({
        title: book.title,
        author: book.author,
        category: book.category,
        description: book.description || "",
        isbn: book.isbn || "",
        publishedYear: book.publishedYear || "",
        coverImage: null,
      });
      if (book.coverImage && book.coverImage !== "default-book-cover.jpg") {
        setImagePreview(`http://localhost:5000/uploads/${book.coverImage}`);
      }
    } catch (err) {
      setError("Failed to load book details");
    } finally {
      setFetchingBook(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, coverImage: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.author.trim()) {
      setError("Author is required");
      return;
    }
    if (!formData.category.trim()) {
      setError("Category is required");
      return;
    }

    try {
      setLoading(true);

      if (mode === "edit") {
        await updateBook(id, formData);
      } else {
        await createBook(formData);
      }

      navigate("/dashboard/my-books");
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${mode} book`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingBook) {
    return <Loader size="lg" text="Loading book details..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === "edit" ? "Edit Book" : "Add New Book"}
        </h1>
        <p className="text-gray-600 mt-1">
          {mode === "edit"
            ? "Update book information"
            : "Add a new book to your library"}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Cover Image
            </label>
            <div className="flex items-start gap-6">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                <div className="w-40 h-56 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 border-dashed">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <BookOpen className="w-12 h-12 mb-2" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="cursor-pointer">
                  <div className="border-2 border-gray-300 border-dashed rounded-lg p-6 hover:border-green-500 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Click to upload cover image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Title */}
          <Input
            label="Book Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            required
          />

          {/* Author */}
          <Input
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            required
          />

          {/* Category and Published Year - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>

              {!useCustomCategory ? (
                <div className="space-y-2">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomCategory(true);
                      setFormData((prev) => ({ ...prev, category: "" }));
                    }}
                    className="text-sm text-green-600 hover:text-green-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add custom category
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter custom category name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomCategory(false);
                      setFormData((prev) => ({ ...prev, category: "" }));
                    }}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Choose from existing categories
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-1">
                {useCustomCategory
                  ? "This category will be created if it doesn't exist"
                  : `${categories.length} categories available`}
              </p>
            </div>

            {/* Published Year */}
            <Input
              label="Published Year"
              name="publishedYear"
              type="number"
              value={formData.publishedYear}
              onChange={handleChange}
              placeholder="e.g., 2024"
              min="1000"
              max={new Date().getFullYear()}
            />
          </div>

          {/* ISBN */}
          <Input
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter ISBN number (optional)"
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description (optional)"
              rows="5"
              maxLength="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading
                ? mode === "edit"
                  ? "Updating..."
                  : "Adding..."
                : mode === "edit"
                  ? "Update Book"
                  : "Add Book"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/my-books")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BookForm;
