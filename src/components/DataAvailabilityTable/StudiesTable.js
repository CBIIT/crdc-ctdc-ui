import React, { useContext } from 'react';
import PaginatedTableView from '../PaginatedTable/TableView';
import {
  TableContext,
} from '../../bento-core';
import { themeConfig } from './tableThemeConfig';
import CustomTableHeader from './header/CustomTblHeader';

const StudiesTable = ({
  table,
  tableLayOut,
  data,
  interOpData,
  rowsPerPage,
}) => {
  // access table state
  const { context } = useContext(TableContext);
  return (
    <PaginatedTableView
      isServer={false}
      tblRows={data}
      config={{
        ...table,
        interOpData,
        data
      }}
      tableLayOut={tableLayOut}
      totalRowCount={data.length || 0}
      customthemeConfig={{ ...themeConfig(context) }}
      rowsPerPage={rowsPerPage}
      customTableHeader={CustomTableHeader}
    />
  );
};

export default StudiesTable;
