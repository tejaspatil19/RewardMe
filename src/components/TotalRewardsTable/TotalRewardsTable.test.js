import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TotalRewardsTable from './TotalRewardsTable';

const mockData = [
  { customerName: 'John Doe', rewardPoints: 150 },
  { customerName: 'Jane Smith', rewardPoints: 200 }
];

describe('TotalRewardsTable', () => {
  test('renders table with correct columns and data', () => {
    render(<TotalRewardsTable data={mockData} isLoading={false} error={null} />);
    expect(screen.getByText('Total Rewards')).toBeInTheDocument();
    expect(screen.getByText('Customer Name')).toBeInTheDocument();
    expect(screen.getByText('Total Reward Points')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<TotalRewardsTable data={[]} isLoading={true} error={null} />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('shows error state', () => {
    render(<TotalRewardsTable data={[]} isLoading={false} error={'Test error'} />);
    expect(screen.getByText(/Error loading data:/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  test('shows no data message when empty', () => {
    render(<TotalRewardsTable data={[]} isLoading={false} error={null} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
