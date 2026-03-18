import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';

// Mock the CartContext
vi.mock('../context/CartContext', () => ({
  useCart: vi.fn()
}));

import { useCart } from '../context/CartContext';

const mockProduct = {
  _id: '123',
  name: 'Test Wireless Headphones',
  description: 'Premium headphones',
  price: 2999,
  originalPrice: 4999,
  image: 'https://via.placeholder.com/400',
  rating: 4.5,
  numReviews: 42,
  stock: 10
};

const renderProductCard = (product = mockProduct) => {
  return render(
    <BrowserRouter>
      <ProductCard product={product} />
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  const mockAddToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useCart.mockReturnValue({ addToCart: mockAddToCart });
  });

  it('renders the product name', () => {
    renderProductCard();
    expect(screen.getByText('Test Wireless Headphones')).toBeInTheDocument();
  });

  it('renders the product price in INR format', () => {
    renderProductCard();
    expect(screen.getByText('₹2,999')).toBeInTheDocument();
  });

  it('renders the original price when available', () => {
    renderProductCard();
    expect(screen.getByText('₹4,999')).toBeInTheDocument();
  });

  it('shows discount badge when originalPrice is set', () => {
    renderProductCard();
    // Discount = (1 - 2999/4999) * 100 ≈ 40%
    expect(screen.getByText('40% OFF')).toBeInTheDocument();
  });

  it('does NOT show discount badge when no originalPrice', () => {
    const productNoDiscount = { ...mockProduct, originalPrice: undefined };
    renderProductCard(productNoDiscount);
    expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
  });

  it('displays rating and review count', () => {
    renderProductCard();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(42)')).toBeInTheDocument();
  });

  it('renders Add to Cart button', () => {
    renderProductCard();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('calls addToCart when button is clicked', () => {
    renderProductCard();
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });
});
