/**
 * Reusable Table component with filtering and sorting capabilities
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Table.css';

const Table = ({ 
  data, 
  columns, 
  title, 
  isLoading = false, 
  error = null,
  enableFilter = true,
  enableSort = true,
  className = '' 
}) => {
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data based on search text
  const filteredData = useMemo(() => {
    if (!filterText.trim()) return data;
    
    return data.filter(item =>
      columns.some(column => {
        const value = item[column.key];
        return value && value.toString().toLowerCase().includes(filterText.toLowerCase());
      })
    );
  }, [data, filterText, columns]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle different data types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String comparison
      const aStr = aValue ? aValue.toString().toLowerCase() : '';
      const bStr = bValue ? bValue.toString().toLowerCase() : '';
      
      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortConfig]);

  // Handle sort column click
  const handleSort = (columnKey) => {
    if (!enableSort) return;

    setSortConfig(prevConfig => ({
      key: columnKey,
      direction: prevConfig.key === columnKey && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort indicator for column header
  const getSortIndicator = (columnKey) => {
    if (!enableSort || sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (error) {
    return (
      <div className={`table-container ${className}`}>
        <div className="table-header">
          <h2>{title}</h2>
        </div>
        <div className="error-message">
          <p>Error loading data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <div className="table-header">
        <h2>{title}</h2>
        {enableFilter && (
          <div className="table-filter">
            <input
              type="text"
              placeholder="Filter table data..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="filter-input"
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          <div className="table-info">
            <p>Showing {sortedData.length} of {data.length} records</p>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map(column => (
                    <th
                      key={column.key}
                      onClick={() => handleSort(column.key)}
                      className={`${enableSort ? 'sortable' : ''} ${
                        sortConfig.key === column.key ? 'sorted' : ''
                      }`}
                      title={enableSort ? 'Click to sort' : ''}
                    >
                      {column.label}
                      {getSortIndicator(column.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr key={item.id || index}>
                      {columns.map(column => (
                        <td key={column.key} className={column.className || ''}>
                          {column.render
                            ? column.render(item[column.key], item)
                            : item[column.key]
                          }
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="no-data">
                      {filterText ? 'No matching records found' : 'No data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
      className: PropTypes.string
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  enableFilter: PropTypes.bool,
  enableSort: PropTypes.bool,
  className: PropTypes.string
};

export default Table;