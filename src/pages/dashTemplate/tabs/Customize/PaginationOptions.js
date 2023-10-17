import { customPaginationAction } from '@bento-core/paginated-table';
import {
  GET_MY_CART_DATA_QUERY,
  GET_MY_CART_DATA_QUERY_DESC,
  table,
} from '../../../../bento/fileCentricCartWorkflowData';

// pagination table behavior
// customizeOnRowSelect,
// customizeToggleSelectAll,
// customizeSortByColumn,
// customizeChangePage,
// customizeChangeRowsPerPage,
// customizeColumnViewChange,

export const myFileTablePaginationOptions = (context) => ({
  customizeSortByColumn: (column, order) => {
    const { dispatch, sortBy } = context;
    const sort = (order === 'asc' && sortBy === column) ? 'desc' : 'asc';
    const value = {
      sortOrder: sort,
      sortBy: column,
      query: sort === 'asc' ? GET_MY_CART_DATA_QUERY : GET_MY_CART_DATA_QUERY_DESC,
      paginationAPIField: sort === 'asc' ? table.paginationAPIField
        : table.paginationAPIFieldDesc,
    };
    dispatch(customPaginationAction(value));
  },
});

export const paginationOptions = (context, config) => {
  switch (config?.title) {
    case 'myFiles':
      return {
        ...myFileTablePaginationOptions(context),
      };
    default:
      return {};
  }
};
