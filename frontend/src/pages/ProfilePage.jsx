import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

import axios from "../lib/axios"; // Ensure this path points to your configured axios instance
import { id } from "date-fns/locale";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [lastOnline, setLastOnline] = useState("");

  // State for change password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);


  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/auth/profile", { withCredentials: true });
        setUser(response.data);
        setUsername(response.data.name);
        const userId = response.data._id;

        if (response.data.lastOnline) {
          const timeAgo = formatDistanceToNow(new Date(response.data.lastOnline), { addSuffix: true });
          setLastOnline(timeAgo.includes("less than a minute") ? "Online" : timeAgo);
        }

        if (userId) {
          const [postCountResponse, commentCountResponse] = await Promise.all([
            axios.get(`/user/${userId}/post-count`, { withCredentials: true }),
            axios.get(`/user/${userId}/comment-count`, { withCredentials: true }),
          ]);

          setPostCount(postCountResponse.data.postCount || 0);
          setCommentCount(commentCountResponse.data.commentCount || 0);
        }
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
      setIsEditing(false);
    } catch (err) {
      setUpdateMessage(err.response?.data?.message || "Failed to update profile");
    }
  };
  //pfp
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Base64 preview
        setSelectedFile(reader.result); // Base64 to send
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select an image first.");
      return;
    }

    try {
      const response = await axios.post("/user/update-pfp", { pfp: selectedFile }, {
        headers: { Authorization: `Bearer ${user.token}` },
        withCredentials: true
      });

      setUser((prevUser) => ({ ...prevUser, pfp: response.data.pfp })); // Update profile picture in UI
      setUploadMessage("Profile picture updated successfully!");
    } catch (error) {
      setUploadMessage("Failed to upload image.");
      console.error(error);
    }
  };


  // Handler for changing the password
  const handleChangePassword = async (e) => {
    e.preventDefault();
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
        <div className="bg-gray-800 p-6 rounded-lg mb-8 flex flex-col sm:flex-row items-center">
          <div className="sm:w-1/2">
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
                  disabled={!isEditing}
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
              <div className="flex space-x-4">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  type="button"
                  onClick={() => setIsEditing(true)}

                >
                  Edit

                </button>
                {isEditing && (
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded"
                    type="submit"
                  >
                    Save
                  </button>
                )}
              </div>
              {updateMessage && (
                <p className="mt-4 text-center text-green-400">{updateMessage}</p>
              )}
            </form>
          </div>

          {/* Profile Picture and Activity Status */}
          <div className="sm:w-1/2 flex flex-col items-center">
            {/* Profile Picture */}
            <img
              className="rounded-full w-64 h-64 object-cover mb-4"
              src={user.pfp}
              alt="User Profile Picture"
            />
            {isEditing && (
              <div className="mt-4">
                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2 text-white" />
                <button onClick={handleUpload} className="bg-green-500 text-white py-2 px-4 rounded mt-2">Upload</button>
              </div>
            )}
            {uploadMessage && <p className="text-green-400 mt-2">{uploadMessage}</p>}
            {/* Upload File Input */}
            {/* <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 text-white"
            /> */}

            {/* Upload Button */}
            {/* <button
              onClick={handleUpload}
              className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
            >
              Upload New Picture
            </button> */}

            {/* Activity Status Row */}
            <div className="w-2/3 flex justify-center bg-gray-700 p-4 rounded-lg shadow-lg text-white text-sm">
              <div className="text-center mx-4">
                <p className="text-md font-semibold text-emerald-400">{postCount}</p>
                <p className="text-xs text-gray-300">Posts</p>
              </div>
              <div className="text-center mx-4">
                <p className="text-md font-semibold text-emerald-400">{commentCount}</p>
                <p className="text-xs text-gray-300">Comments</p>
              </div>
              <div className="text-center mx-4 flex items-center">
                {lastOnline === "Online" ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    <p className="text-md font-semibold text-green-400">Online</p>
                  </>
                ) : (
                  <div>
                    <p className="text-xs text-gray-300">Last online</p>
                    <p className="text-md font-semibold text-gray-400">{lastOnline || "Just now"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Change Password Form */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          {passwordMessage && (
            <p className="mb-4 text-center text-red-500">{passwordMessage}</p>
          )}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? "Hide Change Password" : "Change Password"}
          </button>
          {showChangePassword && (
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
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;