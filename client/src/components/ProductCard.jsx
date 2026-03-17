import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <Link to={`/products/${product._id}`} className="card product-card">
            {discount > 0 && (
                <span className="badge badge-primary">{discount}% OFF</span>
            )}

            <img
                src={product.image}
                alt={product.name}
                className="card-image"
                loading="lazy"
            />

            <div className="card-body">
                <h3 className="card-title">{product.name}</h3>

                <div className="product-rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {product.rating?.toFixed(1) || '0.0'}
                    <span>({product.numReviews || 0})</span>
                </div>

                <div className="product-price">
                    <span className="current">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <span className="original">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>

                <button
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 'var(--spacing-md)', width: '100%' }}
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
