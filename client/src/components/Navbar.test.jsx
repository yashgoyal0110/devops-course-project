import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

// Mock the context hooks
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../context/CartContext', () => ({
  useCart: vi.fn()
}));

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  beforeEach(() => {
    useCart.mockReturnValue({ cartCount: 0 });
  });

  it('renders the ShopSmart brand name', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn()
    });

    renderNavbar();
    expect(screen.getByText('ShopSmart')).toBeInTheDocument();
  });

  it('shows Login button when not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn()
    });

    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('shows Logout button and user name when authenticated', () => {
    useAuth.mockReturnValue({
      user: { name: 'John Doe', token: 'fake-token' },
      isAuthenticated: true,
      logout: vi.fn()
    });

    renderNavbar();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Hi, John')).toBeInTheDocument();
  });

  it('shows My Orders link when authenticated', () => {
    useAuth.mockReturnValue({
      user: { name: 'Jane', token: 'fake-token' },
      isAuthenticated: true,
      logout: vi.fn()
    });

    renderNavbar();
    expect(screen.getByText('My Orders')).toBeInTheDocument();
  });

  it('shows cart count badge when items in cart', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn()
    });
    useCart.mockReturnValue({ cartCount: 3 });

    renderNavbar();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders navigation links to Home and Products', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn()
    });

    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });
});
