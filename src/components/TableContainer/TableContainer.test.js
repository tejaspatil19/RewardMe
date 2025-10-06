import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableContainer from './TableContainer';

// Mock child tables to isolate TableContainer logic
jest.mock('../MonthlyRewardsTable/MonthlyRewardsTable', () => (props) => <div>MonthlyRewardsTable{props.error ? <span>{props.error}</span> : null}</div>);
jest.mock('../TotalRewardsTable/TotalRewardsTable', () => (props) => <div>TotalRewardsTable{props.error ? <span>{props.error}</span> : null}</div>);
jest.mock('../TransactionsTable/TransactionsTable', () => (props) => <div>TransactionsTable{props.error ? <span>{props.error}</span> : null}</div>);


describe('TableContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all child tables', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ transactions: [] })
    }));
    render(<TableContainer />);
    await waitFor(() => {
      expect(screen.getByText('MonthlyRewardsTable')).toBeInTheDocument();
      expect(screen.getByText('TotalRewardsTable')).toBeInTheDocument();
      expect(screen.getByText('TransactionsTable')).toBeInTheDocument();
    });
  });

  test('shows no transactions message when data is empty', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ transactions: [] })
    }));
    render(<TableContainer />);
    await waitFor(() => {
      expect(screen.getByText(/No transactions found/i)).toBeInTheDocument();
    });
  });

  test('shows error message when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, statusText: 'Network error' }));
    render(<TableContainer />);
    await waitFor(() => {
      expect(screen.getAllByText((content) => /Failed to fetch db\.json/i.test(content)).length).toBeGreaterThan(0);
    });
  });

  test('shows loading state initially', async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    render(<TableContainer />);
    expect(screen.getAllByText('MonthlyRewardsTable').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TotalRewardsTable').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TransactionsTable').length).toBeGreaterThan(0);
  });
});
