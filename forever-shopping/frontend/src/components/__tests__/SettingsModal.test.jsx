import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SettingsModal from '../SettingsModal';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock axios and toast
vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock ShopContext
const mockContextValue = {
  token: 'mock-token',
  backendUrl: 'http://localhost:5000',
  userType: 'user',
  setUserType: vi.fn(),
  getUserProfile: vi.fn(),
};

const renderWithContext = (component, contextValue = mockContextValue) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      {component}
    </ShopContext.Provider>
  );
};

describe('SettingsModal', () => {
  it('does not render when isOpen is false', () => {
    renderWithContext(<SettingsModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('Settings')).toBeNull();
  });

  it('renders correctly when isOpen is true', () => {
    renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Change Password')).toBeInTheDocument();
  });

  it('displays "Become a Host" when userType is user', () => {
    renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />, { ...mockContextValue, userType: 'user' });
    expect(screen.getByText('Become a Host')).toBeInTheDocument();
  });

  it('displays "Switch to Normal User" when userType is host', () => {
    renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />, { ...mockContextValue, userType: 'host' });
    expect(screen.getByText('Switch to Normal User')).toBeInTheDocument();
  });

  it('opens confirmation view on toggle click', () => {
    renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Become a Host'));
    expect(screen.getByText('Confirm Host Access')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('calls API and updates profile on successful toggle', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true, message: 'Success', token: 'new-token' } });
    const getUserProfileMock = vi.fn();
    
    renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />, { ...mockContextValue, getUserProfile: getUserProfileMock });
    
    // Go to confirmation
    fireEvent.click(screen.getByText('Become a Host'));
    
    // Enter password
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit
    fireEvent.click(screen.getByText('Confirm'));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/user/change-type',
        { password: 'password123', requestedType: 'host' },
        { headers: { token: 'mock-token' } }
      );
      expect(getUserProfileMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Success');
    });
  });

  it('handles API error correctly', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: false, message: 'Invalid password' } });
    
    renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);
    
    fireEvent.click(screen.getByText('Become a Host'));
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('Confirm'));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid password');
    });
  });
});
