import React, { useContext, useRef } from 'react';
import PaginatedTableView from '../PaginatedTable/TableView';
import { downloadJson } from '../PaginatedTable/utils';
import {
  TableContext,
} from '../../bento-core';
import { themeConfig } from './tableThemeConfig';
import CustomTableHeader from './header/CustomTblHeader';

const StudiesTable = ({
  table,
  tableLayOut,
  data,
  rowsPerPage,
}) => {
  // access table state
  const { context } = useContext(TableContext);
  // The table initializes its download handler once. Read current rows when clicked
  // so a later repository configuration response also updates the CSV.
  const currentData = useRef(data);
  currentData.current = data;
  const { download } = table.extendedViewConfig;

  return (
    <PaginatedTableView
      isServer={false}
      tblRows={data}
      config={{
        ...table,
        data,
        extendedViewConfig: {
          ...table.extendedViewConfig,
          download: {
            ...download,
            customDownload: false,
            downloadTable: () => downloadJson(currentData.current, download),
          },
        },
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
