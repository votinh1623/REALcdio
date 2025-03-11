import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        // Fetch notifications for the logged-in user, including sender details
        const notifications = await Notification.find({ recipient: req.user._id, isRead: false })
            .populate("sender", "name pfp")
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Error marking notification as read:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
