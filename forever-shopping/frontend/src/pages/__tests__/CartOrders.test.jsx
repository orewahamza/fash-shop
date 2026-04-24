import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Cart from '../Cart';
import Orders from '../Orders';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock axios
vi.mock('axios');

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const defaultContext = {
  products: [],
  currency: '$',
  cartItems: {},
  updateQuantity: vi.fn(),
  token: 'mock-token',
  backendUrl: 'http://localhost:5000',
};

const renderWithContext = (component, contextValue = defaultContext) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </ShopContext.Provider>
  );
};

describe('Cart Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login if not authenticated', async () => {
    vi.useFakeTimers();
    renderWithContext(<Cart />, { ...defaultContext, token: '' });

    expect(screen.getByText('Please log in first')).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Please log in first');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    vi.useRealTimers();
  });

  it('shows empty cart message when cart is empty', () => {
    renderWithContext(<Cart />, { ...defaultContext, cartItems: {} });

    expect(screen.getByText('Your cart is currently empty')).toBeInTheDocument();
    expect(screen.getByText("Looks like you haven't added anything to your cart yet.")).toBeInTheDocument();
    expect(screen.getByText('BROWSE PRODUCTS')).toBeInTheDocument();
  });

  it('shows cart items when cart is not empty', () => {
    const products = [
      { _id: '1', name: 'Product 1', price: 100, image: ['img1.jpg'] },
    ];
    const cartItems = { '1': { 'M': 1 } };
    renderWithContext(<Cart />, { ...defaultContext, products, cartItems });

    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });
});

describe('Orders Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows empty order message when no orders', async () => {
    axios.post.mockResolvedValue({ data: { success: true, orders: [] } });

    renderWithContext(<Orders />, { ...defaultContext, token: 'mock-token' });

    // Initially loading
    expect(screen.getByText('Loading orders...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Your order is empty')).toBeInTheDocument();
    });
  });

  it('shows orders when orders exist', async () => {
    const orders = [
      {
        items: [
          {
            name: 'Order Item 1',
            price: 50,
            quantity: 1,
            size: 'M',
            image: ['img.jpg'],
          }
        ],
        status: 'Processing',
        payment: false,
        paymentMethod: 'COD',
        date: Date.now(),
      }
    ];
    axios.post.mockResolvedValue({ data: { success: true, orders } });

    renderWithContext(<Orders />, { ...defaultContext, token: 'mock-token' });

    await waitFor(() => {
      expect(screen.getByText('Order Item 1')).toBeInTheDocument();
    });
  });
});
