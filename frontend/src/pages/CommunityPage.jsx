import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

const CommunityPage = () => {
    const { user } = useUserStore();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingSearchTerm, setPendingSearchTerm] = useState(""); // user input
    const [searchTerm, setSearchTerm] = useState(""); // actual search term used in query
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortByMine, setSortByMine] = useState(false);
    const postsPerPage = 5;

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: postsPerPage,
                    search: searchTerm,
                    ...(sortByMine && user ? { userId: user._id } : {}),
                });

                const response = await fetch(`/api/posts?${params.toString()}`);
                const data = await response.json();
                setPosts(data.posts);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage, searchTerm, sortByMine, user]);

    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            post.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.relatedGame && post.relatedGame.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesMine = !sortByMine || (user && post.userId._id === user._id);
        return matchesSearch && matchesMine;
    });

    const handleSearchClick = () => {
        setCurrentPage(1); // reset to first page on new search
        setSearchTerm(pendingSearchTerm);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    if (loading) return <div className="text-center p-8 text-xl">Loading...</div>;

    return (
        <div className='container mx-auto p-4 max-w-full sm:p-6'>
            <AnimatedBackground />
            <div className='mb-4 sm:ml-12 sm:mr-12 ml-4 mr-4'>
                <div className='flex flex-wrap items-center justify-between'>
                    <h1 className='text-5xl font-bold mb-4'>Welcome to our community!</h1>
                    <div className='flex flex-wrap gap-2 items-center'>
                        <input
                            type="text"
                            placeholder="Search posts/theme..."
                            className="w-64 p-2 rounded text-black"
                            value={pendingSearchTerm}
                            onChange={(e) => setPendingSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={handleSearchClick}
                            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            
            {/* ... the rest of your code remains unchanged ... */}
            <div className='p-6 rounded-lg shadow-lg'>
                <div className='flex justify-between items-center mb-4 ml-24 mr-24 border border-emerald-400 p-4 rounded-lg'>
                    <h1 className='text-3xl font-bold ml-8'>Community Posts</h1>
                    {user && (
                        <div className="flex space-x-4">
                            <Link
                                to="/create-post"
                                className='mr-8 bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out'
                            >
                                Create Post
                            </Link>
                            <button
                                onClick={() => setSortByMine(!sortByMine)}
                                className={`mr-8 py-2 px-4 rounded-md transition duration-300 ease-in-out ${sortByMine ? "bg-green-500" : "bg-gray-600"} text-white`}
                            >
                                {sortByMine ? "Show All Posts" : "My Posts"}
                            </button>
                        </div>
                    )}
                </div>

                {filteredPosts.length === 0 ? (
                    <p className="text-center text-gray-400">No posts available.</p>
                ) : (
                    <>
                        <div className='grid grid-cols-1 gap-4 ml-24 mr-24 mt-8'>
                            {filteredPosts.map((post) => (
                                <Link
                                    to={`/post/${post._id}`}
                                    key={post._id}
                                    className='bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out border border-yellow-800 flex justify-between items-center'
                                >
                                    <div>
                                        {post.img && <img src={post.img} alt={post.head} className='mb-2 rounded max-w-xs' />}
                                        <h2 className='text-xl font-semibold mb-2'>{post.head}</h2>
                                        <p className='text-gray-500 text-sm'>Theme: {post.theme}</p>
                                        <p className='text-gray-500 text-sm'>By: {post.userId.name}</p>
                                        {post.relatedGame && <p className='text-gray-500 text-sm'>Related Game: {post.relatedGame}</p>}
                                        <p className='text-gray-500 text-sm'>Comments: {post.commentsCount}</p>
                                    </div>
                                    <div className='text-right mr-4'>
                                        <p className='text-gray-400 text-sm mb-2'>Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
                                        <p className='text-gray-400 text-sm'>
                                            {post.latestComment || "No comments yet"}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className='flex justify-between items-center mt-4 ml-24 mr-24'>
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className='bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out'
                            >
                                Previous
                            </button>
                            <p className='text-gray-400'>Page {currentPage} of {totalPages}</p>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className='bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out'
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;