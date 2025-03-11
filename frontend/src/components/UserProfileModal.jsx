import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const UserProfileModal = ({ userId, onClose }) => {
    const [user, setUser] = useState(null);
    const [lastOnline, setLastOnline] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user/${userId}`);
                const data = await response.json();
                setUser(data);

                // Format last online time
                if (data.lastOnline) {
                    const timeAgo = formatDistanceToNow(new Date(data.lastOnline), { addSuffix: true });

                    // If the last seen is less than a minute, show "Online"
                    if (timeAgo.includes("less than a minute")) {
                        setLastOnline("Online");
                    } else {
                        setLastOnline(timeAgo);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    if (!user) return null; // Prevent rendering until data is loaded

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center relative">
                {/* Close Button */}
                <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={onClose}>
                    ✕
                </button>

                {/* Profile Picture */}
                <img src={user.pfp} alt={user.name} className="rounded-full w-32 h-32 mx-auto mb-4" />

                {/* Username */}
                <h2 className="text-xl font-bold text-white">{user.name}</h2>

                {/* Online Status */}
                <div className="mt-2 flex justify-center items-center">
                    {lastOnline === "Online" ? (
                        <>
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                            <p className="text-md font-semibold text-green-400">Online</p>
                        </>
                    ) : (
                        <p className="text-sm text-gray-400">Last online: {lastOnline || "Just now"}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
