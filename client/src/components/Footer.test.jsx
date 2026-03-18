import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';

const renderFooter = () => {
  return render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
};

describe('Footer', () => {
  it('renders the ShopSmart brand', () => {
    renderFooter();
    expect(screen.getByText('ShopSmart')).toBeInTheDocument();
  });

  it('renders footer description', () => {
    renderFooter();
    expect(
      screen.getByText(/Your one-stop destination for quality products/)
    ).toBeInTheDocument();
  });

  it('renders Shop section with product links', () => {
    renderFooter();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('All Products')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('renders Account section with auth links', () => {
    renderFooter();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('renders Support section', () => {
    renderFooter();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    const currentYear = new Date().getFullYear();
    renderFooter();
    expect(
      screen.getByText(new RegExp(`${currentYear}`))
    ).toBeInTheDocument();
  });
});
