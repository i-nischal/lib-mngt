import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  BookOpen, 
  Calendar,
  User as UserIcon,
  Hash,
  FolderOpen
} from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { getBookById, deleteBook } from '../../services/bookService';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await getBookById(id);
      setBook(response.book);
      setError('');
    } catch (err) {
      setError('Failed to load book details');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await deleteBook(id);
      navigate('/dashboard/my-books');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };

  if (loading) {
    return <Loader size="lg" text="Loading book details..." />;
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Book not found</h3>
        <Link to="/dashboard/books">
          <Button variant="primary">Back to Books</Button>
        </Link>
      </div>
    );
  }

  const canEdit = user?.role === 'admin' || book.addedBy?._id === user?.id;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      {/* Error Alert */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Book Details */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              {book.coverImage && book.coverImage !== 'default-book-cover.jpg' ? (
                <img
                  src={`http://localhost:5000/uploads/${book.coverImage}`}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {canEdit && (
              <div className="mt-4 space-y-2">
                <Link to={`/dashboard/books/${id}/edit`} className="block">
                  <Button variant="primary" fullWidth>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Book
                  </Button>
                </Link>
                <Button variant="danger" fullWidth onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Book
                </Button>
              </div>
            )}
          </div>

          {/* Book Information */}
          <div className="md:col-span-2">
            <div className="space-y-6">
              {/* Title and Author */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600">by {book.author}</p>
              </div>

              {/* Category Badge */}
              <div>
                <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  {book.category}
                </span>
              </div>

              {/* Description */}
              {book.description && book.description !== 'No description available' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                {/* Published Year */}
                {book.publishedYear && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Published Year</p>
                      <p className="font-semibold text-gray-900">{book.publishedYear}</p>
                    </div>
                  </div>
                )}

                {/* ISBN */}
                {book.isbn && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Hash className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ISBN</p>
                      <p className="font-semibold text-gray-900 font-mono text-sm">
                        {book.isbn}
                      </p>
                    </div>
                  </div>
                )}

                {/* Added By */}
                {book.addedBy && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Added By</p>
                      <p className="font-semibold text-gray-900">
                        {book.addedBy.username}
                      </p>
                    </div>
                  </div>
                )}

                {/* Date Added */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date Added</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(book.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookDetails;