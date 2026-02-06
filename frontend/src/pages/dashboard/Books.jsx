import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  BookOpen,
  Filter,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import { getAllBooks } from "../../services/bookService";
import { getAllCategories } from "../../services/categoryService";
import { formatDate } from "../../utils/helpers";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedCategory, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
      };

      const response = await getAllBooks(params);
      setBooks(response.books || []);
      setTotalPages(response.pages || 1);
      setError("");
    } catch (err) {
      setError("Failed to load books");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Books</h1>
          <p className="text-gray-600 mt-1">
            Browse and manage your book collection
          </p>
        </div>
        <Link to="/dashboard/books/new">
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            Add New Book
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books by title, author, or category..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={handleCategoryFilter}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Category: {selectedCategory}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Books Grid */}
      {loading ? (
        <Loader size="lg" text="Loading books..." />
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link key={book._id} to={`/dashboard/books/${book._id}`}>
                <Card hover className="h-full">
                  {/* Book Cover */}
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    {book.coverImage &&
                    book.coverImage !== "default-book-cover.jpg" ? (
                      <img
                        src={`http://localhost:5000/uploads/${book.coverImage}`}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      by {book.author}
                    </p>

                    <div className="space-y-2">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        {book.category}
                      </span>

                      {book.publishedYear && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          Published: {book.publishedYear}
                        </div>
                      )}

                      {book.addedBy && (
                        <div className="flex items-center text-xs text-gray-500">
                          <UserIcon className="w-3 h-3 mr-1" />
                          Added by {book.addedBy.username}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory
                ? "Try adjusting your filters"
                : "Start by adding your first book"}
            </p>
            {!searchTerm && !selectedCategory && (
              <Link to="/dashboard/books/new">
                <Button variant="primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Book
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Books;
