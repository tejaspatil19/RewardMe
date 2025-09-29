
import React from 'react';
import PropTypes from 'prop-types';
import ComTable from '../Table/ComTable';

const MonthlyRewardsTable = ({ data, isLoading, error }) => {
  const columns = [
    {
      key: 'customerId',
      label: 'Customer ID',
      className: 'center'
    },
    {
      key: 'customerName',
      label: 'Customer Name'
    },
    {
      key: 'month',
      label: 'Month'
    },
    {
      key: 'year',
      label: 'Year',
      className: 'center'
    },
    {
      key: 'rewardPoints',
      label: 'Reward Points',
      className: 'points',
      render: (value) => value.toLocaleString()
    }
  ];

  // Sort data alphabetically by customerName
  const sortedData = Array.isArray(data)
    ? [...data].sort((a, b) => {
      const nameA = a.customerName ? a.customerName.toLowerCase() : '';
      const nameB = b.customerName ? b.customerName.toLowerCase() : '';
      return nameA.localeCompare(nameB);
    })
    : [];

  return (
    <ComTable
      data={sortedData}
      columns={columns}
      title="User Monthly Rewards"
      isLoading={isLoading}
      error={error}
      enableFilter
      enableSort
    />
  );
};

MonthlyRewardsTable.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

MonthlyRewardsTable.defaultProps = {
  isLoading: false,
  error: null
};

export default MonthlyRewardsTable;