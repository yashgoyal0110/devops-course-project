import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    ShopSmart
                </Link>

                <button
                    className="navbar-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`navbar-nav ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                        Home
                    </Link>
                    <Link to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                        Products
                    </Link>
                    {isAuthenticated && (
                        <Link to="/orders" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                            My Orders
                        </Link>
                    )}
                </div>

                <div className="navbar-actions">
                    <Link to="/cart" className="btn btn-ghost btn-icon cart-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-md">
                            <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
                                Hi, {user.name?.split(' ')[0]}
                            </span>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
