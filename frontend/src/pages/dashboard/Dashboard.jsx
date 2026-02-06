import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  FolderOpen,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import { getSummary } from "../../services/userService";
import { formatDate } from "../../utils/helpers";

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await getSummary();
      setSummary(response.summary);
      setError("");
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader size="lg" text="Loading dashboard..." />;
  }

  const stats = [
    {
      name: "Total Books",
      value: summary?.totalBooks || 0,
      icon: BookOpen,
      color: "bg-blue-500",
      link: "/dashboard/books",
    },
    {
      name: "Categories",
      value: summary?.totalCategories || 0,
      icon: FolderOpen,
      color: "bg-green-500",
      link: "/dashboard/categories",
    },
    ...(user?.role === "admin"
      ? [
          {
            name: "Total Users",
            value: summary?.totalUsers || 0,
            icon: Users,
            color: "bg-purple-500",
            link: "/dashboard/users",
          },
        ]
      : []),
    {
      name: "My Books",
      value:
        summary?.recentBooks?.filter((book) => book.addedBy?._id === user?.id)
          ?.length || 0,
      icon: TrendingUp,
      color: "bg-orange-500",
      link: "/dashboard/my-books",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-green-100 text-lg">
          Here's what's happening in your library today
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} to={stat.link}>
              <Card hover className="h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/dashboard/books/new">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Book</span>
            </button>
          </Link>
          <Link to="/dashboard/categories/new">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Category</span>
            </button>
          </Link>
          <Link to="/dashboard/analytics">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">View Analytics</span>
            </button>
          </Link>
        </div>
      </Card>

      {/* Recent Books */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Books</h2>
          <Link to="/dashboard/books">
            <Button variant="ghost" className="text-sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {summary?.recentBooks?.length > 0 ? (
          <div className="space-y-4">
            {summary.recentBooks.map((book) => (
              <Link
                key={book._id}
                to={`/dashboard/books/${book._id}`}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                  {book.coverImage &&
                  book.coverImage !== "default-book-cover.jpg" ? (
                    <img
                      src={`http://localhost:5000/uploads/${book.coverImage}`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      {book.category}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(book.createdAt)}
                    </span>
                    {book.addedBy && (
                      <span>Added by {book.addedBy.username}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No books added yet</p>
            <Link to="/dashboard/books/new">
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Book
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
