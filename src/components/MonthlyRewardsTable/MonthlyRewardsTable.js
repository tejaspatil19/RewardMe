
import React from 'react';
import PropTypes from 'prop-types';
import Table from '../Table/Table';

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

  return (
    <Table
      data={data}
      columns={columns}
      title="User Monthly Rewards"
      isLoading={isLoading}
      error={error}
      enableFilter
      enableSort
      className="monthly-rewards-table"
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