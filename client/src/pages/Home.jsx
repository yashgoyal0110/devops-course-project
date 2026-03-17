import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(`${apiUrl}/api/products/featured`),
                    fetch(`${apiUrl}/api/categories`)
                ]);

                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    setFeaturedProducts(productsData);
                }

                if (categoriesRes.ok) {
                    const categoriesData = await categoriesRes.json();
                    setCategories(categoriesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <main>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content slide-up">
                        <h1 className="hero-title">
                            Discover <span>Premium Products</span> at Unbeatable Prices
                        </h1>
                        <p className="hero-subtitle">
                            Shop from thousands of products across multiple categories with fast delivery and easy returns.
                        </p>
                        <div className="hero-actions">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Now
                            </Link>
                            <Link to="/products?featured=true" className="btn btn-secondary btn-lg">
                                View Featured
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Shop by Category</h2>
                        <Link to="/products" className="btn btn-ghost">
                            View All
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid grid-3">
                        {categories.slice(0, 6).map(category => (
                            <Link
                                key={category._id}
                                to={`/products?category=${category._id}`}
                                className="category-card"
                            >
                                <img src={category.image} alt={category.name} />
                                <div className="category-card-overlay">
                                    <h3 className="category-card-title">{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Products</h2>
                        <Link to="/products?featured=true" className="btn btn-ghost">
                            View All
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid grid-4">
                        {featuredProducts.slice(0, 8).map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {featuredProducts.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">📦</div>
                            <h3 className="empty-state-title">No Products Found</h3>
                            <p className="empty-state-text">
                                Check back later for featured products.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section text-center">
                <div className="container">
                    <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-3xl)' }}>
                        Ready to Start Shopping?
                    </h2>
                    <p className="text-secondary" style={{ marginBottom: 'var(--spacing-xl)', maxWidth: '500px', margin: '0 auto var(--spacing-xl)' }}>
                        Join thousands of satisfied customers and discover amazing deals every day.
                    </p>
                    <Link to="/products" className="btn btn-primary btn-lg">
                        Browse All Products
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default Home;
