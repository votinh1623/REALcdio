import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { Link } from "react-router-dom";

const CommunityPage = () => {
    const { user } = useUserStore();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [primarySortOption, setPrimarySortOption] = useState("date");
    const [secondarySortOption, setSecondarySortOption] = useState("newest");
    const postsPerPage = 5;

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

    const handlePrimarySortChange = (e) => {
        setPrimarySortOption(e.target.value);
        // Reset secondary sort option based on primary sort option
        if (e.target.value === "date") {
            setSecondarySortOption("newest");
        } else if (e.target.value === "alphabet") {
            setSecondarySortOption("asc");
        } else if (e.target.value === "comments") {
            setSecondarySortOption("most");
        }
    };

    const handleSecondarySortChange = (e) => {
        setSecondarySortOption(e.target.value);
    };

    const sortedPosts = [...posts].sort((a, b) => {
        if (primarySortOption === "date") {
            if (secondarySortOption === "newest") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (secondarySortOption === "oldest") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        } else if (primarySortOption === "alphabet") {
            if (secondarySortOption === "asc") {
                return a.head.localeCompare(b.head);
            } else if (secondarySortOption === "desc") {
                return b.head.localeCompare(a.head);
            }
        } else if (primarySortOption === "comments") {
            if (secondarySortOption === "most") {
                return b.commentsCount - a.commentsCount;
            } else if (secondarySortOption === "least") {
                return a.commentsCount - b.commentsCount;
            }
        }
        return 0;
    });

    const filteredPosts = sortedPosts.filter(post =>
        post.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.relatedGame && post.relatedGame.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredPosts.length / postsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='mb-4 ml-12 mr-12'>
                <div className='flex flex-wrap items-center justify-between'>
                    <h1 className='text-5xl font-bold mb-4'>Welcome to our community!</h1>
                    <div className='flex items-center space-x-2'>
                        <label htmlFor="primary-sort-posts" className='text-lg font-bold text-emerald-400'>Sort by:</label>
                        <select id="primary-sort-posts" value={primarySortOption} onChange={handlePrimarySortChange} className='text-lg font-bold text-emerald-400 bg-gray-800 border border-emerald-400 p-1 rounded-lg'>
                            <option value="date">Date</option>
                            <option value="alphabet">Alphabet</option>
                            <option value="comments">Comment</option>
                        </select>
                        <select id="secondary-sort-posts" value={secondarySortOption} onChange={handleSecondarySortChange} className='text-lg font-bold text-emerald-400 bg-gray-800 border border-emerald-400 p-1 rounded-lg'>
                            {primarySortOption === "date" && (
                                <>
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                </>
                            )}
                            {primarySortOption === "alphabet" && (
                                <>
                                    <option value="asc">Asc</option>
                                    <option value="desc">Desc</option>
                                </>
                            )}
                            {primarySortOption === "comments" && (
                                <>
                                    <option value="most">Most</option>
                                    <option value="least">Least</option>
                                </>
                            )}
                        </select>
                        <input
                            type="text"
                            placeholder="Search posts/theme..."
                            className="w-64 p-2 rounded text-black"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className='bg-gray-900 p-6 rounded-lg shadow-lg'>
                <div className='flex justify-between items-center mb-4 ml-24 mr-24 border border-emerald-400 p-4 rounded-lg'>
                    <h1 className='text-3xl font-bold ml-8'>Community Posts</h1>
                    
                    {user && (
                        <Link
                            to={"/create-post"}
                            className='mr-8 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                        >
                            Create Post
                        </Link>
                    )}
                </div>
                {filteredPosts.length === 0 ? (
                    <p>No posts available</p>
                ) : (
                    <div>
                        <div className='grid grid-cols-1 gap-2 ml-24 mr-24 mt-8'>
                            {currentPosts.map((post) => (
                                <Link to={`/post/${post._id}`} key={post._id} className='bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out border border-yellow-800 flex justify-between items-center'>
                                <div>
                                    {post.img && <img src={post.img} alt={post.head} className='mb-2 rounded' />}
                                    <h2 className='text-xl font-semibold mb-2'>{post.head}</h2>
                                    <p className='text-gray-500 text-sm'>Theme: {post.theme}</p>
                                    <p className='text-gray-500 text-sm'>By: {post.userId.name}</p>
                                    {post.relatedGame && <p className='text-gray-500 text-sm'>Related Game: {post.relatedGame}</p>}
                                    <p className='text-gray-500 text-sm'>Comments: {post.commentsCount}</p>
                                </div>
                                <div className='text-right mr-4'>
                                    <p className='text-gray-400 text-sm mb-2'>Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
                                    {post.latestComment && (
                                        <p className='text-gray-400 text-sm'>Latest comment: {post.latestComment}</p>
                                    )}
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
                            <p className='text-gray-400'>Page {currentPage}</p>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
                                className='bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out'
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;