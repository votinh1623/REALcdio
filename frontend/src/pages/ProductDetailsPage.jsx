import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";
const ProductDetailsPage = () => {
    const { productId } = useParams();
    const { fetchProductById, product, loading } = useProductStore();
    const { user } = useUserStore();
    const { addToCart } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProductById(productId);
    }, [fetchProductById, productId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }
     const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add products to cart", { id: "login" });
            return;
        } else {
            // Add product to cart
            addToCart(product);
            // Navigate to cart
            navigate('/cart');
        }
    };
    return (
        <div className='min-h-screen'>
            <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <h1 className='text-4xl font-bold text-emerald-400 mb-8'>{product.name}</h1>
                <img src={product.image} alt={product.name} className='w-full h-auto mb-8 mx-auto' />
                <div className='text-4xl font-bold text-emerald-500 mb-4'>
                    Price: <span className='text-3xl font-bold text-emerald-400'>
                            {product.price === 0 ? "FREE" : `$${product.price}`}
                        </span>
                </div>
                <div className='text-xl font-bold text-emerald-500 mb-4'>
                    Description: 
                </div>
                <p className='text-lg text-gray-300 whitespace-pre-line'>{product.description}</p>
                <div className='text-xl font-bold text-emerald-500 mb-4 mt-8'>
                    Details: 
                </div>
                <p className='text-lg text-gray-300 whitespace-pre-line'>{product.detailedDescription}</p>
                <button
                    className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
                     text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 mt-8'
                    onClick={handleAddToCart}
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default ProductDetailsPage;