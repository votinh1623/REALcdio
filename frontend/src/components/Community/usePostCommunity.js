import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../../lib/axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";
console.log("Connecting to Socket.IO at:", import.meta.env.VITE_BACKEND_URL);

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
    transports: ['websocket'],
    secure: false,
});
socket.on("connect", () => {
    console.log("✅ Connected to socket:", socket.id);
});
socket.on("disconnect", () => {
    console.log("❌ Disconnected");
});
export const usePostCommunity = create((set, get) => ({

    posts: [],
    post: null,
    comments: [],
    loading: false,

    setPosts: (posts) => set({ posts }),
    createPost: async (postData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/posts", postData);
            set((prevState) => ({
                posts: [...prevState.posts, res.data],
                loading: false,
            }));
            toast.success("Post created successfully");
        } catch (error) {
            toast.error(error.response.data.error || "Failed to create post");
            set({ loading: false });
        }
    },
    fetchAllPosts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/posts");
            set({ posts: response.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch posts", loading: false });
            toast.error(error.response.data.error || "Failed to fetch posts");
        }
    },
    fetchPostsByTheme: async (theme) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/posts/theme/${theme}`);
            set({ posts: response.data.posts, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch posts", loading: false });
            toast.error(error.response.data.error || "Failed to fetch posts");
        }
    },
    deletePost: async (postId) => {
        set({ loading: true });
        try {
            console.log(`Attempting to delete post with ID: ${postId}`);
            await axios.delete(`/posts/${postId}`);
            set((prevState) => ({
                posts: prevState.posts.filter((post) => post._id !== postId),
                loading: false,
            }));
            toast.success("Post deleted successfully");
        } catch (error) {
            console.error("Error deleting post:", error);
            set({ loading: false });
            toast.error(error.response?.data?.error || "Failed to delete post");
        }
    },
    toggleFeaturedPost: async (postId) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/posts/${postId}`);
            set((prevPosts) => ({
                posts: prevPosts.posts.map((post) =>
                    post._id === postId ? { ...post, isFeatured: response.data.isFeatured } : post
                ),
                loading: false,
            }));
            toast.success("Post updated successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to update post");
        }
    },
    fetchFeaturedPosts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/posts/featured");
            set({ posts: response.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch posts", loading: false });
            console.log("Error fetching featured posts:", error);
        }
    },
    fetchPostById: async (postId) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/posts/${postId}`);
            set({ post: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to fetch post");
        }
    },
    createComment: async (commentData) => {
        try {
            const res = await axios.post("/comments", commentData);
            toast.success("Comment added");
            // No need to call set() here because new comment comes via socket
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to add comment");
        }
    },

    fetchCommentsByPostId: async (postId) => {
        try {
            const response = await axios.get(`/comments/${postId}`);
            const current = get().comments;

            const isSame = JSON.stringify(current) === JSON.stringify(response.data);
            if (!isSame) {
                set({ comments: response.data });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch comments");
        }
    },
    deleteComment: async (commentId, token) => {
        set({ loading: true });
        try {
            await axios.delete(`/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            socket.emit("deleteComment", commentId); // 🔴 Emit deletion
            set((state) => ({
                comments: state.comments.filter((c) => c._id !== commentId),
                loading: false,
            }));
            toast.success("Comment deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete comment");
            set({ loading: false });
        }
    },
    likeComment: async (commentId) => {
        try {
            const response = await axios.post(`/comments/${commentId}/like`);
            set((prevState) => ({
                comments: prevState.comments.map((comment) =>
                    comment._id === commentId ? response.data : comment
                ),
            }));
        } catch (error) {
            toast.error(error.response.data.error || "Failed to like comment");
        }
    },
    dislikeComment: async (commentId) => {
        try {
            const response = await axios.post(`/comments/${commentId}/dislike`);
            set((prevState) => ({
                comments: prevState.comments.map((comment) =>
                    comment._id === commentId ? response.data : comment
                ),
            }));
        } catch (error) {
            toast.error(error.response.data.error || "Failed to dislike comment");
        }
    },
    likePost: async (postId, token) => {
        try {
            await axios.post(`/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Liked post!");
        } catch (error) {
            toast.error("Failed to like post");
            console.error(error);
        }
    },

    dislikePost: async (postId, token) => {
        try {
            await axios.post(`/posts/${postId}/dislike`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Disliked post!");
        } catch (error) {
            toast.error("Failed to dislike post");
            console.error(error);
        }
    },
    subscribeToPostComments: (postId) => {
        socket.emit("joinPost", postId);

        socket.off("newComment");
        socket.on("newComment", (newComment) => {
            try {
                console.log("🟢 received new comment:", newComment);
                const currentComments = get().comments;
                const alreadyExists = currentComments.some((c) => c._id === newComment._id);
                if (!alreadyExists) {
                    set({ comments: [newComment, ...currentComments] });
                }
            } catch (err) {
                console.error("🔥 Error during socket newComment update", err);
            }
        });

        socket.off("deleteComment");
        socket.on("deleteComment", (commentId) => {
            set((state) => ({
                comments: state.comments.filter((c) => c._id !== commentId),
            }));
        });
    },

    unsubscribeFromPostComments: (postId) => {
        socket.emit("leavePost", postId);
        socket.off("newComment");
        socket.off("deleteComment");
    },

}));