import { ShoppingCart, UserPlus, LogIn, Lock, Bell, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

import { useState, useEffect } from "react";

const Navbar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const { user, logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const { cart } = useCartStore();
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [lastCartLength, setLastCartLength] = useState(cart.length);

    useEffect(() => {
        if (cart.length > lastCartLength) {
            const newNotification = `Added ${cart[cart.length - 1].name} to the cart`;
            setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
            setNotificationCount((prevCount) => prevCount + 1);
        }
        setLastCartLength(cart.length);
    }, [cart, lastCartLength]);
    
	useEffect(() => {
        setShowProfileDropdown(false); // Close profile dropdown whenever user changes
    }, [user]);

	useEffect(() => {
        // Khi user thay đổi, reset danh sách và số lượng thông báo
        setNotifications([]);
        setNotificationCount(0);
    }, [user]);

	const handleNotificationClick = () => {
		setShowNotifications(!showNotifications);
		setNotificationCount(0);
	};


    const handleProfileClick = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    return (
        <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
            <div className='container mx-auto px-4 py-3'>
                <div className='flex flex-wrap justify-between items-center'>
                    <Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
                        CHO TOAN
                    </Link>

                    <nav className='flex flex-wrap items-center gap-4'>
                        <Link
                            to={"/"}
                            className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
                        >
                            <Home className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                            <span className='hidden sm:inline'>Home</span>
                        </Link>

                        {user && ( //CART
                            <Link
                                to={"/cart"}
                                className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 
                            ease-in-out'
                            >
                                <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                                <span className='hidden sm:inline'>Cart</span>
                                {cart.length > 0 && (
                                    <span
                                        className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
                                    text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
                                    >
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        {user && ( //NOTIFICATIONS
                            <div
                                className='relative group cursor-pointer'
                                onMouseEnter={() => setShowNotifications(true)}
                                onMouseLeave={() => setShowNotifications(false)}
                                onClick={handleNotificationClick}
                            >
                                <div className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
                                    <Bell className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                                    <span className='hidden sm:inline'>Notifications</span>
                                    {notificationCount > 0 && (
                                        <span
                                            className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
                                        text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
                                        >
                                            {notificationCount}
                                        </span>
                                    )}
                                </div>
                                {showNotifications && (
                                    <div className='absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-50'>
                                        <ul>
                                            {notifications.length > 0 ? (
                                                notifications.map((notification, index) => (
                                                    <li key={index} className='px-4 py-2 hover:bg-gray-700'>
                                                        {notification}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className='px-4 py-2 hover:bg-gray-700'>No notifications</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
						{isAdmin && ( //DASHBOARD
                            <Link
                                className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
                                 transition duration-300 ease-in-out flex items-center'
                                to={"/secret-dashboard"}
                            >
                                <Lock className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Link>
                        )}	
                        {user && ( //PROFILE DROPDOWN
                            <div className='relative'>
                                <button
                                    className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
                                    onClick={handleProfileClick}
                                >
                                    <img
                                        src='https://th.bing.com/th/id/OIP.uVOJ8OQCf2mwzP60bPN8cgAAAA?rs=1&pid=ImgDetMain'
                                        alt='Profile'
                                        className='inline-block w-8 h-8 rounded-full'
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
                                    to={"/signup"} //SIGNUP
                                    className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
                                    rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <UserPlus className='mr-2' size={18} />
                                    Sign Up
                                </Link>
                                <Link
                                    to={"/login"} //LOGIN
                                    className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
                                    rounded-md flex items-center transition duration-300 ease-in-out'
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