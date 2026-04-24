import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/Navbar';
import { ShopContext } from '../context/ShopContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock ShopContext
const mockContext = {
  setShowSearch: vi.fn(),
  getCartCount: vi.fn().mockReturnValue(0),
  navigate: vi.fn(),
  token: 'mock-token',
  setToken: vi.fn(),
  setCartItems: vi.fn(),
  userRole: 'user', // Default to non-admin
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

describe('Navbar Role Upgrade Gate', () => {
  it('should show role upgrade modal when non-admin clicks Admin Panel', () => {
    renderNavbar({ userRole: 'user' });

    // Find and click Admin Panel link
    const adminLink = screen.getByText('Admin Panel');
    fireEvent.click(adminLink);

    // Assert modal is visible
    expect(screen.getByText('Admin Access Required')).toBeInTheDocument();
    expect(screen.getByText('To access the Admin Panel you need to become an Admin.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Request Admin Role' })).toBeInTheDocument();
  });

  it('should not show modal when admin clicks Admin Panel', () => {
    renderNavbar({ userRole: 'admin' });

    const adminLink = screen.getByText('Admin Panel');
    fireEvent.click(adminLink);

    // Assert modal is NOT visible
    expect(screen.queryByText('Admin Access Required')).not.toBeInTheDocument();
  });

  it('should send API request when Request Admin Role is clicked', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    renderNavbar({ userRole: 'user' });

    // Open modal
    const adminLinks = screen.getAllByText('Admin Panel');
    fireEvent.click(adminLinks[0]);

    // Click Request button
    const requestButton = screen.getByRole('button', { name: 'Request Admin Role' });
    fireEvent.click(requestButton);

    // Assert loading state (optional, hard to catch without act/waitFor)
    expect(requestButton).toBeDisabled();

    // Wait for API call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/user-123/roles/admin-request',
        {},
        { headers: { token: 'mock-token' } }
      );
    });

    // Assert success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Request sent. You will be notified once approved.');
    });

    // Assert modal closed (assuming implementation closes it on success)
    // In the implementation: setShowRoleModal(false) on success
    // Wait for state update
    await waitFor(() => {
        expect(screen.queryByText('Admin Access Required')).not.toBeInTheDocument();
    });
  });

  it('should show error toast on API failure', async () => {
    axios.post.mockResolvedValue({ data: { success: false, message: 'Request already pending' } });
    renderNavbar({ userRole: 'user' });

    const adminLinks = screen.getAllByText('Admin Panel');
    fireEvent.click(adminLinks[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Request Admin Role' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Request already pending');
    });

    // Modal should stay open on error
    expect(screen.getByText('Admin Access Required')).toBeInTheDocument();
  });
});
