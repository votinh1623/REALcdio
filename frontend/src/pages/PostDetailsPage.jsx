import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { usePostCommunity } from "../components/Community/usePostCommunity";
import { useUserStore } from "../stores/useUserStore";
import { TrashIcon } from "lucide-react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import UserProfileModal from "../components/UserProfileModal";
import toast from "react-hot-toast";
import CommentsForm from "../components/CommentsForm";
import AnimatedBackground from "../components/AnimatedBackground";
import { shallow } from "zustand/shallow";
import { useRef } from "react";
const PostDetailsPage = () => {
    let renderCount = useRef(0);
    renderCount.current++;
    console.log(` PostDetailsPage rendered ${renderCount.current} times`);
    const { postId } = useParams();
    const {
        fetchPostById,
        fetchCommentsByPostId,
        subscribeToPostComments,
        unsubscribeFromPostComments,
        post,
        comments,
        loading,
        deletePost,
        deleteComment,
        likeComment,
        dislikeComment,
        likePost,
        dislikePost,
    } = usePostCommunity(
        (state) => ({
            fetchPostById: state.fetchPostById,
            fetchCommentsByPostId: state.fetchCommentsByPostId,
            subscribeToPostComments: state.subscribeToPostComments,
            unsubscribeFromPostComments: state.unsubscribeFromPostComments,
            post: state.post,
            comments: state.comments,
            loading: state.loading,
            deletePost: state.deletePost,
            deleteComment: state.deleteComment,
            likeComment: state.likeComment,
            dislikeComment: state.dislikeComment,
            likePost: state.likePost,
            dislikePost: state.dislikePost,
        }),
        shallow // ✅ critical to prevent over-rerenders
    );
    const { user } = useUserStore(); // checkAuth
    const navigate = useNavigate();
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        //checkAuth();
        fetchPostById(postId);
        fetchCommentsByPostId(postId);
        subscribeToPostComments(postId);
        return () => {
            unsubscribeFromPostComments(postId);
        };
    }, [postId]);
    useEffect(() => {
        const unsubscribe = usePostCommunity.subscribe(
            (state) => state, // subscribes to the whole store
            (newState, prevState) => {
                console.log("🔁 Zustand state changed");
                console.log("Prev:", prevState);
                console.log("New:", newState);
            }
        );

        return () => unsubscribe();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }


    const handleProfileClick = (event, userId) => {
        const rect = event.target.getBoundingClientRect();
        setModalPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        setSelectedUserId(userId);
    };
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
        console.log("User Info:", user);
        if (!user || (user.role !== "admin" && user._id !== post.userId._id)) {
            toast.error("You are not authorized to delete this comment");
            return;
        }
        try {
            await deleteComment(commentId, user.token);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }

    };
    const handleLikeComment = async (commentId) => {
        try {
            await likeComment(commentId);
        } catch (error) {
            console.error("Failed to like comment:", error);
        }
        // window.location.reload();
    };

    const handleDislikeComment = async (commentId) => {
        try {
            await dislikeComment(commentId);
        } catch (error) {
            console.error("Failed to dislike comment:", error);
        }
        // window.location.reload();
    };
    const LikesDislikes = ({ commentId, likeCount, dislikeCount, onLike, onDislike }) => {
        return (
            <div className="likes-dislikes flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                    <button onClick={() => onLike(commentId)}>
                        <ThumbsUp className="text-green-500" />
                    </button>
                    <span>{likeCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button onClick={() => onDislike(commentId)}>
                        <ThumbsDown className="text-red-500" />
                    </button>
                    <span>{dislikeCount}</span>
                </div>
            </div>

        );

    };
    const handleLikePost = async () => {
        if (!user) {
            toast.error("You must be logged in to like posts.");
            return;
        }
        try {
            await likePost(postId, user.token);
            fetchPostById(postId); // Refresh post data
        } catch (error) {
            console.error("Failed to like post:", error);
        }
    };

    const handleDislikePost = async () => {
        if (!user) {
            toast.error("You must be logged in to dislike posts.");
            return;
        }
        try {
            await dislikePost(postId, user.token);
            fetchPostById(postId); // Refresh post data
        } catch (error) {
            console.error("Failed to dislike post:", error);
        }
    };
    return (
        <div className='min-h-screen'>
            <AnimatedBackground />
            <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-full'>
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
                <div className="flex items-center space-x-4 mt-4">
                    <button
                        onClick={handleLikePost}
                        className="flex items-center space-x-2 text-green-500 hover:text-green-400"
                    >
                        <ThumbsUp />
                        <span>{post.likes?.length || 0}</span>
                    </button>

                    <button
                        onClick={handleDislikePost}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-400"
                    >
                        <ThumbsDown />
                        <span>{post.dislikes?.length || 0}</span>
                    </button>
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
                            <div key={comment._id} className='bg-gray-800 p-4 rounded-lg shadow-md flex items-start gap-4 ml-16 mr-16'>
                                {/* Profile Picture */}

                                <img
                                    src={comment.userId.pfp}
                                    alt={comment.userId.name}
                                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                    onClick={() => setSelectedUserId(comment.userId._id)}
                                />

                                {/* Comment Content */}
                                <div className="flex-1">
                                    <p className='text-sm text-gray-500 mb-2'>
                                        {comment.userId.name} - {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </p>
                                    <p className='text-lg text-gray-300 whitespace-pre-line'>{comment.content}</p>
                                </div>

                                {/* Likes, Dislikes & Delete Button */}
                                <div className="flex items-center space-x-4">
                                    {(user && (user.role === "admin" || user._id === comment.userId._id)) && (
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className='text-red-500 hover:text-red-700'
                                        >
                                            <TrashIcon />
                                        </button>
                                    )}
                                    <LikesDislikes
                                        commentId={comment._id}
                                        likeCount={comment.like}
                                        dislikeCount={comment.dislike}
                                        onLike={handleLikeComment}
                                        onDislike={handleDislikeComment}
                                    />
                                </div>

                            </div>

                        ))}
                        {selectedUserId && (
                            <UserProfileModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailsPage;