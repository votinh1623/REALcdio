import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";


const categories = [
	// { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	// { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
	// { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	// { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	// { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	// { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
	// { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
	{ href: "/action", name: "Action", imageUrl: "/action-games.jpg" },
    { href: "/adventure", name: "Adventure", imageUrl: "/adventure-games.jpg" },
    { href: "/rpg", name: "RPG", imageUrl: "/rpg-games.webp" },
    { href: "/indie", name: "Indie", imageUrl: "/indie-games.avif" },
    { href: "/rhythm", name: "Rhythm", imageUrl: "/rhythm-games.jpg" },
    { href: "/strategy", name: "Strategy", imageUrl: "/strategy-games.jpg" },
    { href: "/puzzle", name: "Puzzle", imageUrl: "/puzzle-games.avif" },
];

const HomePage = () => {
    const { fetchFeaturedProducts, products, isLoading } = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    return (
        <div className='relative min-h-screen text-white overflow-hidden'>
            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <div className='bg-gray-900 bg-opacity-90 p-4 rounded-md shadow-lg mb-8'>
                    <p className='text-center text-xl text-emerald-400 mt-2'>
                        GameVerse is a simple way to find and share indie games experience online for free.
                    </p>
                </div>
                <h1 className='text-center text-5xl sm:text-6xl font-bold text-white-400 mb-4'>
                    Explore Our Categories
                </h1>
                <p className='text-center text-xl text-gray-300 mb-12'>
                    Discover the latest trends in the gaming industry
                </p>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {categories.map((category) => (
                        <CategoryItem category={category} key={category.name} />
                    ))}
                </div>

                {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
            </div>
        </div>
    );
};

export default HomePage;
