

import PropTypes from 'prop-types';
import ComTable from '../Table/ComTable';

const TransactionsTable = ({ data, isLoading, error }) => {
  const columns = [
    {
      key: 'id',
      label: 'Transaction ID',
      className: 'center'
    },
    {
      key: 'customerName',
      label: 'Customer Name'
    },
    {
      key: 'purchaseDate',
      label: 'Purchase Date',
      className: 'date',
      render: (value) => {
        const date = new Date(value);
        
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
      }
    },
    {
      key: 'productPurchased',
      label: 'Product Purchased'
    },
    {
      key: 'price',
      label: 'Price',
      className: 'currency',
      render: (value) => `$${value.toFixed(2)}`
    },
    {
      key: 'rewardPoints',
      label: 'Reward Points',
      className: 'points',
      render: (value) => value.toLocaleString()
    }
  ];

  return (
    <ComTable
      data={data}
      columns={columns}
      title="Transactions"
      isLoading={isLoading}
      error={error}
      enableFilter
      enableSort
      className="transactions-table"
    />
  );
};

TransactionsTable.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

TransactionsTable.defaultProps = {
  isLoading: false,
  error: null
};

export default TransactionsTable;