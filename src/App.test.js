
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders app header', () => {
    render(<App />);
    expect(screen.getByText('RewardMe')).toBeInTheDocument();
    expect(screen.getByText('Customer Rewards Program Dashboard')).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(<App />);
    expect(screen.getByText('Reward Program Rules')).toBeInTheDocument();
    expect(screen.getByText('2 points per dollar spent over $100')).toBeInTheDocument();
  });

  test('shows loading state when fetching data', async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    await act(async () => {
      render(<App />);
    });
    expect(screen.getAllByText('Loading data...').length).toBeGreaterThan(0);
  });

  test('shows error state if fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, statusText: 'Network error' }));
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getAllByText(/Error loading data:/i).length).toBeGreaterThan(0);
    });
  });
});
// ...existing code...
