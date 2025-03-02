import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AllGamesCategoryPage from "./pages/AllGamesCategoryPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
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
		<div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
			{/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(143, 151, 206, 0.3)_0%,rgba(80, 108, 202, 0.2)_45%,rgba(170, 173, 190, 0.1)_100%)]' />
				</div>
			</div>

			<div className='relative z-50 pt-20'>
				<Navbar />
				<Routes>
					<Route path='/' element={<HomePage/>} />
					<Route path='/all-games' element={<AllGamesCategoryPage />} />	
					<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
					<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
					<Route
						path='/secret-dashboard'
						element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
					/>
					<Route path='/category/:category' element={<CategoryPage />} />
					<Route path='/product/:productId' element={<ProductDetailsPage />} /> 
					<Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
					<Route
						path='/purchase-success'
						element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
					/>
					<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
					<Route path='/create-post' element={user ? <CreatePostForm /> : <Navigate to='/login' />} />
					<Route path='/community' element={user ? <CommunityPage /> : <Navigate to='/login' />} />
				</Routes>
			</div>
			<Toaster />
		</div>
	);
}

export default App;
