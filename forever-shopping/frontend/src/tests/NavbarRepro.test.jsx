import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/Navbar';
import { ShopContext } from '../context/ShopContext';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockContext = {
  setShowSearch: vi.fn(),
  getCartCount: vi.fn().mockReturnValue(0),
  navigate: vi.fn(),
  token: 'mock-token',
  setToken: vi.fn(),
  setCartItems: vi.fn(),
  userRole: 'user', 
  userType: 'host', // Important: host user
  userId: 'user-123',
  backendUrl: 'http://localhost:4000',
};

const renderNavbar = (contextOverrides = {}) => {
  return render(
    <BrowserRouter>
      <ShopContext.Provider value={{ ...mockContext, ...contextOverrides }}>
        <Navbar />
      </ShopContext.Provider>
    </BrowserRouter>
  );
};

describe('Navbar Host Panel Access', () => {
  it('should NOT show admin modal when host clicks Host Panel', () => {
    renderNavbar({ userType: 'host', userRole: 'user' });

    // Find Host Panel link
    const hostLink = screen.getByText('Host Panel');
    fireEvent.click(hostLink);

    // Assert modal is NOT visible
    expect(screen.queryByText('Admin Access Required')).not.toBeInTheDocument();
  });
});
