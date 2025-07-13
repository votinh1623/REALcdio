import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";
import { usePostCommunity } from "./Community/usePostCommunity";

const themes = ["art", "music", "game"];

const CreatePostForm = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [newPost, setNewPost] = useState({
        theme: "",
        relatedGame: "",
        head: "",
        body: "",
        image: "",
    });
    const { createPost, loading } = usePostCommunity();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tempId = Date.now();
        const optimisticPost = {
            ...newPost,
            id: tempId,
            status: 'pending',
            user: { name: user.name, id: user._id }, // optional
        };

        // 1️⃣ Optimistically show post in UI
        // You can call a Zustand action or a callback prop to add this to the UI
        // Example: optimisticAddPost(optimisticPost)

        try {
            // 2️⃣ Try to create post (this will fail silently if offline with background sync)
            await createPost(newPost);

            // 3️⃣ You may update status if necessary or let fetch on next load take care of it
            // Example: markPostAsSynced(tempId)
            setNewPost({ theme: "", relatedGame: "", head: "", body: "", image: "" });

        } catch (err) {
            console.warn("Post creation failed (possibly offline); queued for sync.");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setNewPost({ ...newPost, image: reader.result });
            };

            reader.readAsDataURL(file); // base64
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
                <div className='mt-1 flex items-center'>
                    <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
                    <label
                        htmlFor='image'
                        className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    >
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Upload Image
                    </label>
                    {newPost.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
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