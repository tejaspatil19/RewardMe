

import React from 'react';
import PropTypes from 'prop-types';
import ComTable from '../Table/ComTable';

const TotalRewardsTable = ({ data, isLoading, error }) => {
  const columns = [
    {
      key: 'customerName',
      label: 'Customer Name'
    },
    {
      key: 'rewardPoints',
      label: 'Total Reward Points',
      className: 'points',
      render: (value) => value.toLocaleString()
    }
  ];

  return (
    <ComTable
      data={data}
      columns={columns}
      title="Total Rewards"
      isLoading={isLoading}
      error={error}
      enableFilter
      enableSort
    />
  );
};

TotalRewardsTable.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

TotalRewardsTable.defaultProps = {
  isLoading: false,
  error: null
};

export default TotalRewardsTable;