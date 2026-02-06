import { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  FolderOpen,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: location.pathname === "/dashboard",
    },
    {
      name: "All Books",
      href: "/dashboard/books",
      icon: Library,
      current: location.pathname === "/dashboard/books",
    },
    {
      name: "My Books",
      href: "/dashboard/my-books",
      icon: BookOpen,
      current: location.pathname === "/dashboard/my-books",
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
      icon: FolderOpen,
      current: location.pathname === "/dashboard/categories",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      current: location.pathname === "/dashboard/analytics",
    },
  ];

  // Add Users menu item for admin only
  if (user?.role === "admin") {
    navigation.push({
      name: "Users",
      href: "/dashboard/users",
      icon: Users,
      current: location.pathname === "/dashboard/users",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">
              Book<span className="text-green-600">Hub</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/dashboard/profile"
            className="flex items-center space-x-3 px-3 py-2.5 mb-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <UserIcon className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex lg:items-center lg:justify-between">
              <h1 className="text-xl font-semibold text-gray-900 ml-4 lg:ml-0">
                {navigation.find((item) => item.current)?.name || "Dashboard"}
              </h1>

              <div className="hidden lg:flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome back,{" "}
                  <span className="font-medium">{user?.username}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
