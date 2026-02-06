import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Layout
import DashboardLayout from "../components/layout/DashboardLayout";

// Public Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

// Dashboard Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Books from "../pages/dashboard/Books";
import BookDetails from "../pages/dashboard/BookDetails";
import AddBook from "../pages/dashboard/Addbook";
import EditBook from "../pages/dashboard/EditBook";
import MyBooks from "../pages/dashboard/MyBooks";
import Categories from "../pages/dashboard/Categories";
import Analytics from "../pages/dashboard/Analytics";
import Users from "../pages/dashboard/Users";
import Profile from "../pages/dashboard/Profile";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="books/new" element={<AddBook />} />
            <Route path="books/:id" element={<BookDetails />} />
            <Route path="books/:id/edit" element={<EditBook />} />
            <Route path="my-books" element={<MyBooks />} />
            <Route path="categories" element={<Categories />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />

            {/* Admin Only Routes */}
            <Route
              path="users"
              element={
                <AdminRoute>
                  <Users />
                </AdminRoute>
              }
            />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
