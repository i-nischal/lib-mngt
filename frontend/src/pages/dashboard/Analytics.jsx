import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Users as UsersIcon,
} from "lucide-react";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import {
  getSummary,
  getBooksByCategory,
  getBooksByMonth,
  getBooksByAuthor,
  getUserStats,
} from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [booksByCategory, setBooksByCategory] = useState([]);
  const [booksByMonth, setBooksByMonth] = useState([]);
  const [booksByAuthor, setBooksByAuthor] = useState([]);
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [summaryRes, categoryRes, monthRes, authorRes, userRes] =
        await Promise.all([
          getSummary(),
          getBooksByCategory(),
          getBooksByMonth(),
          getBooksByAuthor(),
          getUserStats(),
        ]);

      setSummary(summaryRes.summary);
      setBooksByCategory(categoryRes.data || []);
      setBooksByMonth(monthRes.data || []);
      setBooksByAuthor(authorRes.data || []);
      setUserStats(userRes.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load analytics data");
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader size="lg" text="Loading analytics..." />;
  }

  // Calculate max value for bar chart scaling
  const maxCategoryCount = Math.max(
    ...booksByCategory.map((item) => item.count),
    1,
  );
  const maxAuthorCount = Math.max(
    ...booksByAuthor.map((item) => item.count),
    1,
  );
  const maxMonthCount = Math.max(...booksByMonth.map((item) => item.count), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Insights and statistics about your library
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Books
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {summary?.totalBooks || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Categories
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {summary?.totalCategories || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        {user?.role === "admin" && (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {summary?.totalUsers || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <UsersIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Books by Category */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Books by Category
          </h2>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>

        {booksByCategory.length > 0 ? (
          <div className="space-y-4">
            {booksByCategory.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.count} books
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${(item.count / maxCategoryCount) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No data available</p>
        )}
      </Card>

      {/* Books by Author */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Top Authors</h2>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>

        {booksByAuthor.length > 0 ? (
          <div className="space-y-4">
            {booksByAuthor.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.author}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.count} books
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(item.count / maxAuthorCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No data available</p>
        )}
      </Card>

      {/* Books Added by Month */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Books Added (Last 12 Months)
          </h2>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>

        {booksByMonth.length > 0 ? (
          <div className="space-y-4">
            {booksByMonth.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.period}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.count} books
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(item.count / maxMonthCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No data available</p>
        )}
      </Card>

      {/* Key Insights */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-1">
              Most Popular Category
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {booksByCategory[0]?.category || "N/A"}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {booksByCategory[0]?.count || 0} books
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-900 font-medium mb-1">
              Most Prolific Author
            </p>
            <p className="text-2xl font-bold text-green-700">
              {booksByAuthor[0]?.author || "N/A"}
            </p>
            <p className="text-sm text-green-600 mt-1">
              {booksByAuthor[0]?.count || 0} books
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
