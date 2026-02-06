import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Edit, Trash2, Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { getMyBooks, deleteBook } from '../../services/bookService';
import { formatDate } from '../../utils/helpers';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await getMyBooks();
      setBooks(response.books || []);
      setError('');
    } catch (err) {
      setError('Failed to load your books');
      console.error('Error fetching my books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await deleteBook(id);
      setSuccess('Book deleted successfully');
      fetchMyBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };

  if (loading) {
    return <Loader size="lg" text="Loading your books..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Books</h1>
          <p className="text-gray-600 mt-1">
            Books you've added to the library ({books.length})
          </p>
        </div>
        <Link to="/dashboard/books/new">
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            Add New Book
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <Card key={book._id} hover className="h-full">
              {/* Book Cover */}
              <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {book.coverImage && book.coverImage !== 'default-book-cover.jpg' ? (
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
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">by {book.author}</p>

                <div className="space-y-2 mb-4">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    {book.category}
                  </span>

                  {book.publishedYear && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      Published: {book.publishedYear}
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Added: {formatDate(book.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Link
                    to={`/dashboard/books/${book._id}/edit`}
                    className="flex-1"
                  >
                    <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't added any books to the library yet
            </p>
            <Link to="/dashboard/books/new">
              <Button variant="primary">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Book
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyBooks;