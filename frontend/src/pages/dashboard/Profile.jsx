import { useState } from "react";
import { User as UserIcon, Mail, Calendar } from "lucide-react";
import Card from "../../components/common/Card";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "../../services/authService";
import { formatDate } from "../../utils/helpers";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        username: formData.username,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await updateProfile(updateData);
      updateUser(response.user);
      setSuccess("Profile updated successfully");
      setEditing(false);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
    setEditing(false);
    setError("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <Card>
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user?.username}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">
              Member since {formatDate(user?.createdAt)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{user?.email}</span>
          </div>
        </div>

        {!editing ? (
          <Button variant="primary" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Change Password (optional)
              </h3>

              <div className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />

                {formData.password && (
                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!!formData.password}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Profile;
