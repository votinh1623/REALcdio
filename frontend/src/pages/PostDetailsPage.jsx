import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { usePostCommunity } from "../components/Community/usePostCommunity";
import { useUserStore } from "../stores/useUserStore";
import { TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import CommentsForm from "../components/CommentsForm";

const PostDetailsPage = () => {
    const { postId } = useParams();
    const { fetchPostById, post, loading, deletePost, fetchCommentsByPostId, comments, deleteComment } = usePostCommunity();
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
            //toast.success("Post deleted successfully");
            navigate("/community");
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };
    return (
        <div className='min-h-screen'>
            <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <h1 className='text-4xl font-bold text-emerald-400 mb-2'>{post.head}</h1>
                <p className='text-sm text-gray-500 mb-8'>By {post.userId.name} - {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                
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
                             <div key={comment._id} className='bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center ml-16 mr-16'>
                             <div>
                                 <p className=' ml-2 text-sm text-gray-500 mb-2'>By {comment.userId.name} - {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                                 <p className='ml-4 text-lg text-gray-300 whitespace-pre-line'>{comment.content}</p>
                             </div>
                             {user && user._id === comment.userId._id && (
                                 <button
                                     onClick={() => handleDeleteComment(comment._id)}
                                     className='mr-8 text-red-500 hover:text-red-700 ml-4'
                                 >
                                     <TrashIcon />
                                 </button>
                        )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailsPage;