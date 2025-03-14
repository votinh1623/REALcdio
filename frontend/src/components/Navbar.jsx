import { ShoppingCart, UserPlus, LogIn, Lock, Bell, Home, Grid, Edit, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState, useEffect, useRef } from "react";
import axios from "../lib/axios";

const Navbar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const { user, logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const { cart } = useCartStore();
    const [notifications, setNotifications] = useState([]);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        if(!user){
            return;
        }
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("/notifications", {
                    headers: { Authorization: `Bearer ${user?.token}` }, // Ensure token is included
                    withCredentials: true,
                });
                setNotifications(response.data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Auto-refresh notifications every 10s
        return () => clearInterval(interval);
    }, [user]);
        
    useEffect(() => {
        if(!user){
            return;
        }
        setShowProfileDropdown(false); // Close profile dropdown whenever user changes
    }, [user]);
    // useEffect(() => {
    //     const fetchUserProfile = async () => {
    //         try {
    //             const response = await axios.get("/auth/profile", {
    //                 withCredentials: true,
    //             });
    //             setUser(response.data);
    //         } catch (err) {
    //             console.error("Failed to fetch user profile:", err);
    //         }
    //     };

    //     if (!user) {
    //         fetchUserProfile();
    //     }
    // }, [user, setUser]);

	const markAsRead = async (id) => {
        try {
            await axios.post(`/notifications/${id}/read`, {}, { withCredentials: true });
            setNotifications(notifications.filter(notification => notification._id !== id));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleProfileClick = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };
    useEffect(() => {
        if(!user){
            return;
        }
        const handleClickOutside = (event) => {
            if (
                notificationRef.current && !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
            if (
                profileRef.current && !profileRef.current.contains(event.target)
            ) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
            <div className='container mx-auto px-4 py-3'>
                <div className='flex flex-wrap justify-between items-center'>
                    <Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
                       GameVerse
                    </Link>

                    <nav className='flex flex-wrap items-center gap-4'>
                        <Link
                            to={"/"}
                            className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
                        >
                            <Home className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                            <span className='hidden sm:inline'>Home</span>
                        </Link>
                        <Link
                            to={"/all-games"}
                            className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
                        >
                            <Grid className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                            <span className='hidden sm:inline'>Categories</span>
                        </Link>
                       
                        {user && (
                            <Link
                                to={"/cart"}
                                className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
                            >
                                <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                                <span className='hidden sm:inline'>Cart</span>
                                {cart.length > 0 && (
                                    <span
                                        className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
                                    >
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        {user && (
                             <div className="relative">
                             <button
                                 className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                                 onClick={() => setShowNotifications(!showNotifications)}
                             >
                                 <Bell className="inline-block mr-1 group-hover:text-emerald-400" size={20} />
                                    Notification
                                 {notifications.length > 0 && (
                                     <span className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                                         {notifications.length}
                                     </span>
                                 )}
                             </button>
                 
                             {showNotifications && (
                                 <div ref={notificationRef}className=" absolute right-0 mt-2 w-64 bg-gray-800 text-white rounded-md shadow-lg z-50">
                                     <ul>
                                         {notifications.length > 0 ? (
                                             notifications.map((notification) => (
                                                 <li key={notification._id} className="px-4 py-2 hover:bg-gray-700 flex items-center">
                                                     <img
                                                         src={notification.sender.pfp || "/default-avatar.png"}
                                                         alt="User PFP"
                                                         className="w-8 h-8 rounded-full object-cover mr-2"
                                                     />
                                                     <Link
                                                         to={`/post/${notification.postId}`}
                                                         onClick={() => markAsRead(notification._id)}
                                                         className="flex-1"
                                                     >
                                                         {notification.message}
                                                     </Link>
                                                 </li>
                                             ))
                                         ) : (
                                             <li className="px-4 py-2 hover:bg-gray-700">No notifications</li>
                                         )}
                                     </ul>
                                 </div>
                             )}
                         </div>
                        )}
                         <Link
                                to={"/community"}
                                className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
                            >
                                <Users className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                                <span className='hidden sm:inline'>Community</span>
                            </Link>
                        {/* {user && (
                            <Link
                                to={"/community"}
                                className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
                            >
                                <Users className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                                <span className='hidden sm:inline'>Community</span>
                            </Link>
                        )} */}
                        {isAdmin && (
                            <Link
                                className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
                                 transition duration-300 ease-in-out flex items-center'
                                to={"/secret-dashboard"}
                            >
                                <Lock className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Link>
                        )}
                        {user && (
                            <div ref = {profileRef} className='relative'>
                                <button
                                    className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
                                    onClick={handleProfileClick}
                                >
                                    <img
                                        src={user.pfp}
                                        alt='Profile'
                                        className='inline-block w-8 h-8 rounded-full object-cover'
                                    />
                                </button>
                                {showProfileDropdown && (
                                    <div className='absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-50'>
                                        <ul>
                                            <li className='px-4 py-2 hover:bg-gray-700'>
                                                <Link to='/profile'>View Profile</Link>
                                            </li>
                                            <li className='px-4 py-2 hover:bg-gray-700'>
                                                <Link to='/support'>Support</Link>
                                            </li>
                                            <li className='px-4 py-2 hover:bg-gray-700'>
                                                <button onClick={logout}>Log Out</button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        {!user && (
                            <>
                                <Link
                                    to={"/signup"}
                                    className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <UserPlus className='mr-2' size={18} />
                                    Sign Up
                                </Link>
                                <Link
                                    to={"/login"}
                                    className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <LogIn className='mr-2' size={18} />
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;