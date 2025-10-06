import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TablePagination,
  TextField,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const ComTable = ({
  data,
  columns,
  title,
  isLoading = false,
  error = null,
  enableFilter = true,
  enableSort = true,
  rowsPerPageOptions = [5, 10, 25],
  className = ''
}) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(columns[0]?.key || '');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [filterText, setFilterText] = useState('');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let filteredData = data;
  if (enableFilter && filterText.trim()) {
    filteredData = data.filter(item =>
      columns.some(column => {
        const value = item[column.key];
        return value && value.toString().toLowerCase().includes(filterText.toLowerCase());
      })
    );
  }

  const sortedData = enableSort
    ? stableSort(filteredData, getComparator(order, orderBy))
    : filteredData;

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {enableFilter && (
        <TextField
          label="Filter by customer name"
          variant="outlined"
          size="small"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}
      {isLoading ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>Loading data...</Typography>
        </Box>
      ) : error ? (
        <Typography color="error">Error loading data: {error}</Typography>
      ) : (
        <Paper>
          <TableContainer>
            <MuiTable>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      sortDirection={orderBy === column.key ? order : false}
                      align={column.className === 'center' ? 'center' : 'left'}
                    >
                      {enableSort ? (
                        <TableSortLabel
                          active={orderBy === column.key}
                          direction={orderBy === column.key ? order : 'asc'}
                          onClick={() => handleRequestSort(column.key)}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? paginatedData.map((row, idx) => (
                  <TableRow key={row.id || idx}>
                    {columns.map(column => (
                      <TableCell key={column.key} align={column.className === 'center' ? 'center' : 'left'}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      {filterText ? 'No matching records found' : 'No data available'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </MuiTable>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={sortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

ComTable.propTypes = {
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
  rowsPerPageOptions: PropTypes.array,
  className: PropTypes.string
};

export default ComTable;
