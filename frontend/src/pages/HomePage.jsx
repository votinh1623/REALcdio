import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import AnimatedBackground from "../components/AnimatedBackground";

const categories = [
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

    // Ensure products is always an array to avoid .length error
    const safeProducts = Array.isArray(products) ? products : [];

    return (
        <div className='relative min-h-screen'>
            <AnimatedBackground />
            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <div className='bg-gray-800 bg-opacity-90 p-4 rounded-md shadow-xl mb-8 border border-cyberPurple'>
                    <p className='text-center text-xl text-neonGreen'>
                        GameVerse is a simple way to find and share indie games experience online for free.
                    </p>
                </div>
                <h1 className='text-center text-5xl sm:text-6xl font-bold mb-4'>
                    Explore Our Categories
                </h1>
                <p className='text-center text-xl text-neonBlue mb-12'>
                    Discover the latest trends in the gaming industry
                </p>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {categories.map((category) => (
                        <CategoryItem category={category} key={category.name} />
                    ))}
                </div>

                {!isLoading && safeProducts.length > 0 && <FeaturedProducts featuredProducts={safeProducts} />}
            </div>
        </div>
    );
};
export default HomePage;
