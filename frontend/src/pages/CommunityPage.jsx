import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { Link } from "react-router-dom";

const CommunityPage = () => {
    const { user } = useUserStore();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("/api/posts", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Community Posts</h1>
            {posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {posts.map((post) => (
                        <Link to={`/post/${post._id}`} key={post._id} className='bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out'>
                            <h2 className='text-xl font-semibold mb-2'>{post.head}</h2>
                            <p className='text-gray-400 mb-2'>{post.body}</p>
                            <p className='text-gray-500 text-sm'>Theme: {post.theme}</p>
                            {post.relatedGame && <p className='text-gray-500 text-sm'>Related Game: {post.relatedGame}</p>}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommunityPage;