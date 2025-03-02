import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const themes = ["art", "music", "game"];

const CreatePostForm = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [newPost, setNewPost] = useState({
        theme: "",
        relatedGame: "",
        head: "",
        body: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to create a post", { id: "login" });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(newPost),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create post");
            }

            toast.success("Post created successfully");
            navigate("/");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Post</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='theme' className='block text-sm font-medium text-gray-300'>
                        Theme
                    </label>
                    <select
                        id='theme'
                        name='theme'
                        value={newPost.theme}
                        onChange={(e) => setNewPost({ ...newPost, theme: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    >
                        <option value=''>Select a theme</option>
                        {themes.map((theme) => (
                            <option key={theme} value={theme}>
                                {theme}
                            </option>
                        ))}
                    </select>
                </div>
                {newPost.theme === "game" && (
                    <div>
                        <label htmlFor='relatedGame' className='block text-sm font-medium text-gray-300'>
                            Related Game
                        </label>
                        <input
                            type='text'
                            id='relatedGame'
                            name='relatedGame'
                            value={newPost.relatedGame}
                            onChange={(e) => setNewPost({ ...newPost, relatedGame: e.target.value })}
                            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        />
                    </div>
                )}
                <div>
                    <label htmlFor='head' className='block text-sm font-medium text-gray-300'>
                        Head
                    </label>
                    <input
                        type='text'
                        id='head'
                        name='head'
                        value={newPost.head}
                        onChange={(e) => setNewPost({ ...newPost, head: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>
                <div>
                    <label htmlFor='body' className='block text-sm font-medium text-gray-300'>
                        Body
                    </label>
                    <textarea
                        id='body'
                        name='body'
                        value={newPost.body}
                        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                        rows='5'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    ></textarea>
                </div>
                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Post
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default CreatePostForm;