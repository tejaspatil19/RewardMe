import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MonthlyRewardsTable from './MonthlyRewardsTable';

const mockData = [
  {
    customerId: 'CUST001',
    customerName: 'John Doe',
    month: 'January',
    year: 2025,
    rewardPoints: 120
  },
  {
    customerId: 'CUST002',
    customerName: 'Jane Smith',
    month: 'February',
    year: 2025,
    rewardPoints: 90
  }
];

describe('MonthlyRewardsTable', () => {
  test('renders table with correct columns and data', () => {
    render(<MonthlyRewardsTable data={mockData} isLoading={false} error={null} />);
    expect(screen.getByText('User Monthly Rewards')).toBeInTheDocument();
    expect(screen.getByText('Customer ID')).toBeInTheDocument();
    expect(screen.getByText('Customer Name')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Reward Points')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('February')).toBeInTheDocument();
  expect(screen.getAllByText('2025').length).toBeGreaterThan(1);
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<MonthlyRewardsTable data={[]} isLoading={true} error={null} />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('shows error state', () => {
    render(<MonthlyRewardsTable data={[]} isLoading={false} error={'Test error'} />);
    expect(screen.getByText(/Error loading data:/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  test('shows no data message when empty', () => {
    render(<MonthlyRewardsTable data={[]} isLoading={false} error={null} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
