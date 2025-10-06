import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionsTable from './TransactionsTable';

const mockData = [
  {
    id: 'TXN001',
    customerName: 'John Doe',
    purchaseDate: '2025-01-15',
    productPurchased: 'Product A',
    price: 120.5,
    rewardPoints: 90
  },
  {
    id: 'TXN002',
    customerName: 'Jane Smith',
    purchaseDate: '2025-02-10',
    productPurchased: 'Product B',
    price: 75.0,
    rewardPoints: 25
  }
];

describe('TransactionsTable', () => {
  test('renders table with correct columns and data', () => {
    render(<TransactionsTable data={mockData} isLoading={false} error={null} />);
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Transaction ID')).toBeInTheDocument();
    expect(screen.getByText('Customer Name')).toBeInTheDocument();
    expect(screen.getByText('Purchase Date')).toBeInTheDocument();
    expect(screen.getByText('Product Purchased')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Reward Points')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
    expect(screen.getByText('$120.50')).toBeInTheDocument();
    expect(screen.getByText('$75.00')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<TransactionsTable data={[]} isLoading={true} error={null} />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('shows error state', () => {
    render(<TransactionsTable data={[]} isLoading={false} error={'Test error'} />);
    expect(screen.getByText(/Error loading data:/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  test('shows no data message when empty', () => {
    render(<TransactionsTable data={[]} isLoading={false} error={null} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
