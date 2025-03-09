import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../../lib/axios";

export const usePostCommunity = create((set) => ({
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
        set({ loading: true });
        try {
            const res = await axios.post("/comments", commentData);
            set((prevState) => ({
                comments: [res.data, ...prevState.comments],
                loading: false,
            }));
            window.location.reload();
            toast.success("Comment added successfully");
        } catch (error) {
            toast.error(error.response.data.error || "Failed to add comment");
            set({ loading: false });
        }
    },
    fetchCommentsByPostId: async (postId) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/comments/${postId}`);
            set({ comments: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to fetch comments");
        }
    },
    deleteComment: async (commentId) => {
        set({ loading: true });
        try {
            await axios.delete(`/comments/${commentId}`);
            set((prevState) => ({
                comments: prevState.comments.filter((comment) => comment._id !== commentId),
                loading: false,
            }));
            toast.success("Comment deleted successfully");
        } catch (error) {
            toast.error(error.response.data.error || "Failed to delete comment");
            set({ loading: false });
        }
    },
    fetchCommentsByPostId: async (postId) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/comments/${postId}`);
            set({ comments: response.data, loading: false });
        } catch (error) {
            toast.error(error.response.data.error || "Failed to fetch comments");
            set({ loading: false });
        }
    },
    // refreshData: async () => {
    //     set({ loading: true });
    //     try {
    //         const [postsResponse, commentsResponse] = await Promise.all([
    //             axios.get("/posts"),
    //             axios.get("/comments"),
    //         ]);
    //         set({
    //             posts: postsResponse.data,
    //             comments: commentsResponse.data,
    //             loading: false,
    //         });
    //     } catch (error) {
    //         set({ loading: false });
    //         toast.error("Failed to refresh data");
    //     }
    // },
}));