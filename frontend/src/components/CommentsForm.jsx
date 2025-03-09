import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { Send as FaPaperPlane } from "lucide-react";
import { usePostCommunity } from "./Community/usePostCommunity";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

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
         //   toast.success("Comment added successfully");
        } catch (error) {
            toast.error("Failed to add comment");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 ">
            {user && (
                <img
                    src={user.pfp}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
            )}
            <TextareaAutosize
                value={content}
                onChange={(e) => setContent(e.target.value)}
                minRows={1}
                className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Write a comment..."
                required
            />
            <button
                type="submit"
                className="flex items-center justify-center p-2 rounded-full bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
                <FaPaperPlane className="text-white" />
            </button>
        </form>
    );
};

export default CommentsForm;