import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostCommunity } from "../components/Community/usePostCommunity";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";
import CommentsForm from "../components/CommentsForm";

const PostDetailsPage = () => {
    const { postId } = useParams();
    const { fetchPostById, post, loading, deletePost, fetchCommentsByPostId, comments } = usePostCommunity();
    const { user, checkAuth } = useUserStore();
    const navigate = useNavigate();

    useEffect(() => {
        //checkAuth();
        fetchPostById(postId);
        fetchCommentsByPostId(postId);
    }, [checkAuth, fetchPostById, fetchCommentsByPostId, postId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    const handleDeletePost = async () => {
        if (!user || user._id !== post.userId._id) {
            toast.error("You are not authorized to delete this post");
            return;
        }

        try {
            await deletePost(postId);
            toast.success("Post deleted successfully");
            navigate("/community");
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    return (
        <div className='min-h-screen'>
            <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <h1 className='text-4xl font-bold text-emerald-400 mb-8'>{post.head}</h1>
                {post.image && <img src={post.image} alt={post.head} className='w-full h-auto mb-8 mx-auto' />}
                <div className='text-xl font-bold text-emerald-500 mb-4'>
                    Theme: <span className='text-lg font-bold text-emerald-400'>{post.theme}</span>
                </div>
                {post.relatedGame && (
                    <div className='text-xl font-bold text-emerald-500 mb-4'>
                        Related Game: <span className='text-lg font-bold text-emerald-400'>{post.relatedGame.name}</span>
                    </div>
                )}
                <div className='text-xl font-bold text-emerald-500 mb-4'>
                    Description:
                </div>
                <p className='text-lg text-gray-300 whitespace-pre-line'>{post.body}</p>
                {user && user._id === post.userId._id && (
                    <div className='mt-8'>
                        <button
                            className='flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300'
                            onClick={handleDeletePost}
                        >
                            Delete Post
                        </button>
                    </div>
                )}
                <div className='mt-8'>
                    <h2 className='text-2xl font-bold text-emerald-400 mb-4'>Comments</h2>
                    <CommentsForm />
                    <div className='mt-4 space-y-4'>
                        {comments.map((comment) => (
                            <div key={comment._id} className='bg-gray-800 p-4 rounded-lg shadow-md'>
                                <p className='text-sm text-gray-500 mb-2'>By {comment.userId.name}</p>
                                <p className='text-lg text-gray-300'>{comment.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailsPage;