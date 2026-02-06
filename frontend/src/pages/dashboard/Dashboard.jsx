import { useAuth } from "../../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome back, {user?.username}!
      </h1>
      <p className="text-gray-600">Dashboard content coming soon...</p>
    </div>
  );
};

export default Dashboard;
