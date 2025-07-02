import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AllGamesCategoryPage from "./pages/AllGamesCategoryPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProfilePage from "./pages/ProfilePage";

import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import CreatePostForm from "./components/CreatePostForm";
import CommunityPage from "./pages/CommunityPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import AnimatedBackground from "./components/AnimatedBackground";  

function App() {
	const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;
		getCartItems();
	}, [getCartItems, user]);

	if (checkingAuth) return <LoadingSpinner />;

	return (
		<div className="min-h-screen bg-darkBg text-neonGreen font-mono relative overflow-hidden">
			{/* <AnimatedBackground /> */}
			{/* ✅ Apply animated background to ALL pages */}
			<div className="relative z-10 pt-20">
				
				<Navbar />
				
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/all-games' element={<AllGamesCategoryPage />} />
					<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
					<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
					<Route
						path='/secret-dashboard'
						element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
					/>
					<Route path='/product/:productId' element={<ProductDetailsPage />} />
					<Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
					<Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
					<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
					<Route path='/create-post' element={user ? <CreatePostForm /> : <Navigate to='/login' />} />
					<Route path='/community' element={<CommunityPage />} />
					<Route path='/profile' element={user ? <ProfilePage /> : <Navigate to='/login' />} />
					<Route path='/post/:postId' element={<PostDetailsPage />} />
				</Routes>
			</div>

			<Toaster />
		</div>
	);
}

export default App;
