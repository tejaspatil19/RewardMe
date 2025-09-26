/**
 * Tests for main App component
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import * as apiService from './services/apiService';
import { mockTransactions } from './utils/testUtils';

// Mock the API service
jest.mock('./services/apiService');

describe('App Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('renders app header', async () => {
    // Mock successful API call
    apiService.fetchTransactions.mockResolvedValue(mockTransactions);

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('RewardMe')).toBeInTheDocument();
    expect(screen.getByText('Customer Rewards Program Dashboard')).toBeInTheDocument();
  });

  test('displays loading state initially', async () => {
    // Mock pending API call
    apiService.fetchTransactions.mockImplementation(() => new Promise(() => {}));

    await act(async () => {
      render(<App />);
    });

    expect(screen.getAllByText('Loading data...')).toHaveLength(3); // Three tables loading
  });

  test('displays error when API call fails', async () => {
    // Mock API call fails
    apiService.fetchTransactions.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      // Should show error message in at least one table
      expect(screen.getAllByText(/Error loading data:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Network error/i).length).toBeGreaterThan(0);
    });
  });


  test('successfully loads and displays data', async () => {
    // Mock successful API call
    apiService.fetchTransactions.mockResolvedValue(mockTransactions);

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('User Monthly Rewards')).toBeInTheDocument();
      expect(screen.getByText('Total Rewards')).toBeInTheDocument();
      expect(screen.getByText('Transactions')).toBeInTheDocument();
    });

    // Check if data is displayed - use getAllByText since John Doe appears multiple times
    await waitFor(() => {
      expect(screen.getAllByText('John Doe')).toHaveLength(6); // 2 in monthly + 1 in total + 3 in transactions
    });
  });

  test('renders footer', async () => {
    // Mock successful API call
    apiService.fetchTransactions.mockResolvedValue(mockTransactions);

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('Reward Program Rules')).toBeInTheDocument();
    expect(screen.getByText('2 points per dollar spent over $100')).toBeInTheDocument();
  });
});
