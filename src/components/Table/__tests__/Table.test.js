
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Table from '../Table';
import { createTestTransactions } from '../../../utils/testUtils';

const mockData = createTestTransactions(3, {
  price: 120.00,
  rewardPoints: 90
});

const mockColumns = [
  { key: 'id', label: 'ID' },
  { key: 'customerName', label: 'Customer Name' },
  { key: 'price', label: 'Price', render: (value) => `$${value.toFixed(2)}` },
  { key: 'rewardPoints', label: 'Points' }
];

describe('Table Component', () => {
  test('renders table with data', () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        title="Test Table"
      />
    );

    expect(screen.getByText('Test Table')).toBeInTheDocument();
    expect(screen.getByText('Customer Name')).toBeInTheDocument();
    expect(screen.getByText('Test Customer 1')).toBeInTheDocument();
  });

  test('displays loading state', () => {
    render(
      <Table
        data={[]}
        columns={mockColumns}
        title="Test Table"
        isLoading={true}
      />
    );

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('displays error state', () => {
    render(
      <Table
        data={[]}
        columns={mockColumns}
        title="Test Table"
        error="Test error message"
      />
    );

    expect(screen.getByText('Error loading data: Test error message')).toBeInTheDocument();
  });

  test('filters data based on search input', async () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        title="Test Table"
      />
    );

    const filterInput = screen.getByPlaceholderText('Filter table data...');
    fireEvent.change(filterInput, { target: { value: 'Test Customer 2' } });

    await waitFor(() => {
      expect(screen.getByText('Test Customer 2')).toBeInTheDocument();
      expect(screen.queryByText('Test Customer 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Customer 3')).not.toBeInTheDocument();
    });
  });

  test('sorts data when column header is clicked', async () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        title="Test Table"
        enableSort={true}
      />
    );

    const customerNameHeader = screen.getByText('Customer Name');
    fireEvent.click(customerNameHeader);

    await waitFor(() => {
      expect(customerNameHeader).toHaveTextContent('Customer Name ↑');
    });
  });

  test('renders custom cell content with render function', () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        title="Test Table"
      />
    );

    expect(screen.getAllByText('$120.00')).toHaveLength(3);
  });

  test('displays "no data" message when data is empty', () => {
    render(
      <Table
        data={[]}
        columns={mockColumns}
        title="Test Table"
      />
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('displays filtered result count', () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        title="Test Table"
      />
    );

    expect(screen.getByText('Showing 3 of 3 records')).toBeInTheDocument();
  });

  test('disables filtering when enableFilter is false', () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        title="Test Table"
        enableFilter={false}
      />
    );

    expect(screen.queryByPlaceholderText('Filter table data...')).not.toBeInTheDocument();
  });

  test('disables sorting when enableSort is false', () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        title="Test Table"
        enableSort={false}
      />
    );

    const headers = screen.getAllByRole('columnheader');
    headers.forEach(header => {
      expect(header).not.toHaveClass('sortable');
    });
  });
});