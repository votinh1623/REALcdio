import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { usePostCommunity } from "./Community/usePostCommunity";
import toast from "react-hot-toast";

const CommentsForm = () => {
    const { postId } = useParams();
    const { user } = useUserStore();
    const { createComment } = usePostCommunity();
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to comment");
            return;
        }

        try {
            await createComment({ postId, content });
            setContent("");
            toast.success("Comment added successfully");
        } catch (error) {
            toast.error("Failed to add comment");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="3"
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Write a comment..."
                required
            ></textarea>
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
                Add Comment
            </button>
        </form>
    );
};

export default CommentsForm;