import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios"; // Ensure this path points to your configured axios instance

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for change password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Use axios to call the backend endpoint as defined in useUserStore.
        const response = await axios.get("/auth/profile", {
          withCredentials: true,
        });
        setUser(response.data);
        setUsername(response.data.name);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handler for updating the profile (username only)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/auth/update-profile",
        { name: username },
        { withCredentials: true }
      );
      setUpdateMessage(res.data.message || "Profile updated successfully");
    } catch (err) {
      setUpdateMessage(err.response?.data?.message || "Failed to update profile");
    }
  };

  // Handler for changing the password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    // Check if new password is at least 6 characters long
    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match");
      return;
    }
    try {
      const res = await axios.post(
        "/auth/change-password",
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      setPasswordMessage(res.data.message || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage(err.response?.data?.message || "Failed to change password");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen text-white overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Profile Information */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h1 className="text-center text-5xl sm:text-6xl font-bold text-white-400 mb-4">
            User Profile
          </h1>
          <p className="text-center text-xl text-gray-300 mb-12">
            Manage your profile information below.
          </p>
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label className="block text-gray-300" htmlFor="username">
                Username
              </label>
              <input
                className="w-full p-2 rounded text-black"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300" htmlFor="email">
                Email
              </label>
              <input
                className="w-full p-2 rounded bg-gray-700 cursor-not-allowed"
                type="email"
                id="email"
                value={user.email}
                disabled
              />
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
              Save Changes
            </button>
            {updateMessage && (
              <p className="mt-4 text-center text-green-400">{updateMessage}</p>
            )}
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          {passwordMessage && (
            <p className="mb-4 text-center text-red-500">{passwordMessage}</p>
          )}
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label className="block text-gray-300" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                className="w-full p-2 rounded text-black"
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300" htmlFor="newPassword">
                New Password
              </label>
              <input
                className="w-full p-2 rounded text-black"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                className="w-full p-2 rounded text-black"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;