import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminPanel from '../pages/AdminPanel';
import Navbar from '../components/Navbar';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock ShopContext
const mockContextValue = {
  token: 'mock-token',
  backendUrl: 'http://localhost:5000',
  userType: 'user',
  userRole: 'user',
  navigate: vi.fn(),
  setShowSearch: vi.fn(),
  getCartCount: vi.fn().mockReturnValue(0),
  setToken: vi.fn(),
  setCartItems: vi.fn(),
  userId: '123',
};

const renderWithRouter = (ui, initialEntries = ['/']) => {
  return render(
    <ShopContext.Provider value={mockContextValue}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/host-panel" element={<AdminPanel />} />
          <Route path="/navbar" element={<Navbar />} />
        </Routes>
        {ui}
      </MemoryRouter>
    </ShopContext.Provider>
  );
};

describe('E2E Flow Simulation', () => {
  it('prevents normal user from accessing host panel via URL', () => {
    renderWithRouter(null, ['/host-panel']);
    expect(screen.getByText('403 Forbidden')).toBeInTheDocument();
  });

  it('allows host user to access host panel via URL', async () => {
    // Update context for host
    const hostContext = { ...mockContextValue, userType: 'host' };
    
    // Mock window.location.assign
    const originalLocation = window.location;
    delete window.location;
    window.location = { assign: vi.fn(), hostname: 'localhost' };

    render(
      <ShopContext.Provider value={hostContext}>
        <MemoryRouter initialEntries={['/host-panel']}>
          <Routes>
            <Route path="/host-panel" element={<AdminPanel />} />
          </Routes>
        </MemoryRouter>
      </ShopContext.Provider>
    );

    await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalled();
    });

    window.location = originalLocation;
  });

  it('Navbar does not show Host Panel link for normal user', () => {
    render(
      <ShopContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </ShopContext.Provider>
    );
    expect(screen.queryByText('Host Panel')).toBeNull();
  });

  it('Navbar shows Host Panel link for host user', () => {
    const hostContext = { ...mockContextValue, userType: 'host' };
    render(
      <ShopContext.Provider value={hostContext}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </ShopContext.Provider>
    );
    expect(screen.getByText('Host Panel')).toBeInTheDocument();
  });
});
