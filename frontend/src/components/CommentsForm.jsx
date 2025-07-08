import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { Send as FaPaperPlane, Smile } from "lucide-react";
import { usePostCommunity } from "./Community/usePostCommunity";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import EmojiPicker from "emoji-picker-react";
import { useEffect } from "react";

const CommentsForm = () => {
    const { postId } = useParams();
    const { user } = useUserStore();
    const { createComment } = usePostCommunity();
    const [content, setContent] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    useEffect(() => {
        console.log("CommentsForm mounted");
    }, []);
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
            console.log("Submitted comment");
        } catch (error) {
            toast.error("Failed to add comment");
        }
    };
    const handleEmojiClick = (emojiData) => {
        setContent((prevContent) => prevContent + emojiData.emoji);
        setShowEmojiPicker(false); // Hide emoji picker after selection

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
            <div className="relative flex-grow">
                <TextareaAutosize
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // Prevent newline
                            handleSubmit(e);    // Submit the comment
                        }
                    }}
                    minRows={1}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Write a comment..."
                    required
                />
                {/* Emoji Picker Toggle Button */}
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition"
                >
                    <Smile size={24} />
                </button>
                {/* Emoji Picker Component */}
                {showEmojiPicker && (
                    <div className="absolute right-0 bottom-12 bg-gray-800 shadow-md rounded-lg z-50">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}
            </div>
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