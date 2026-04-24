
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ShopContextProvider from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

// Mock dependencies
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('axios');

// Mock context values
const mockContextValue = {
  setShowSearch: vi.fn(),
  getCartCount: vi.fn(() => 0),
  navigate: vi.fn(),
  token: 'mock-token',
  setToken: vi.fn(),
  setCartItems: vi.fn(),
  userRole: 'user', // Default to user
  userId: 'mock-user-id',
  backendUrl: 'http://localhost:4000',
};

// Wrapper component
const TestWrapper = ({ role = 'user' }) => {
  const contextValue = { ...mockContextValue, userRole: role };
  
  return (
    <BrowserRouter>
      <ShopContextProvider value={contextValue}>
        <Navbar />
      </ShopContextProvider>
    </BrowserRouter>
  );
};

describe('Role Upgrade Flow', () => {
  it('should show confirmation modal when non-admin clicks Admin Panel', () => {
    render(<TestWrapper role="user" />);
    
    // Find Admin Panel link
    const adminLink = screen.getByText('Admin Panel');
    fireEvent.click(adminLink);
    
    // Check if modal appears (using text content search as it might be in a portal or direct)
    // Assuming the modal text is "Request Admin Access" or similar based on previous implementation
    expect(screen.getByText(/Request Admin Access/i)).toBeInTheDocument();
  });

  it('should call API when Confirm is clicked', async () => {
    axios.post.mockResolvedValue({ data: { success: true, message: 'Request sent' } });
    
    render(<TestWrapper role="user" />);
    
    const adminLink = screen.getByText('Admin Panel');
    fireEvent.click(adminLink);
    
    const confirmButton = screen.getByText('Request Access');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/roles/admin-request'),
        {},
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith('Request sent');
    });
  });

  it('should navigate directly if user is admin', () => {
    // We need to spy on window.open since it's an external link usually
    // Or if it's internal navigation.
    // Based on previous implementation, Admin Panel was a link.
    // But for admin, it should just be a link.
    
    render(<TestWrapper role="admin" />);
    const adminLink = screen.getByText('Admin Panel');
    expect(adminLink.closest('a')).toHaveAttribute('href', 'http://localhost:5174'); // Assuming this is the admin URL
  });
});
