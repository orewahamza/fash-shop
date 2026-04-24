import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminPanel from '../AdminPanel';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock ShopContext
const mockContextValue = {
  token: 'mock-token',
  backendUrl: 'http://localhost:5000',
  userType: 'user',
};

const renderWithContext = (component, contextValue = mockContextValue) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      {component}
    </ShopContext.Provider>
  );
};

describe('AdminPanel', () => {
  it('shows 403 Forbidden when userType is not host', () => {
    renderWithContext(<AdminPanel />, { ...mockContextValue, userType: 'user' });
    expect(screen.getByText('403 Forbidden')).toBeInTheDocument();
    expect(screen.getByText('Host privileges required.')).toBeInTheDocument();
  });

  it('redirects when userType is host', async () => {
    // Mock window.location.assign
    const originalLocation = window.location;
    delete window.location;
    window.location = { assign: vi.fn(), hostname: 'localhost' };

    renderWithContext(<AdminPanel />, { ...mockContextValue, userType: 'host' });
    
    expect(screen.queryByText('403 Forbidden')).toBeNull();
    expect(screen.getByText('Redirecting to Admin Panel…')).toBeInTheDocument();

    // Verify redirect logic runs
    // Since useEffect is async and calls axios, we might need to wait
    // But basic redirect happens if axios fails or succeeds
    await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalled();
    });

    // Cleanup
    window.location = originalLocation;
  });
});
