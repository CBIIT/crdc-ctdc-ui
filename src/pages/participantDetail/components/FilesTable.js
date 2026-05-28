import React from 'react';
import {
  TableContextProvider,
  TableView,
  Wrapper,
} from '@bento-core/paginated-table';
import { themeConfig, customTheme } from '../tableThemeConfig';
import { filesColumns } from '../../../bento/participantDetailData';
import { filesWrapperConfig } from '../wrapperConfig';
import { wrapperCustomTheme } from '../wrapperTheme';

export const initFilesTableState = (initialState) => ({
  ...initialState,
  title: 'Files',
  dataKey: 'data_file_uuid',
  tableMsg: { noMatch: 'There are no files available for this participant.' },
  columns: filesColumns,
  selectedRows: [],
  sortBy: 'data_file_name',
  sortOrder: 'asc',
  rowsPerPage: 10,
  page: 0,
  extendedViewConfig: {
    pagination: false,
    manageViewColumns: { title: 'View Columns' },
    download: {
      downloadCsv: 'Download Table Contents As CSV',
      downloadFileName: 'CTDC_Participant_Files',
    },
  },
});

const FilesTable = ({ classes, files = [] }) => (
  <div className={classes.tableSection}>
    <div className={classes.tableSectionTitle}>Associated Files</div>
    <div className={classes.tableWrapper}>
      <TableContextProvider>
        <Wrapper
          wrapConfig={filesWrapperConfig}
          customTheme={wrapperCustomTheme}
          classes={classes}
          section="Files"
        >
          <TableView
            initState={initFilesTableState}
            themeConfig={{ ...themeConfig, customTheme }}
            queryVariables={{}}
            totalRowCount={files.length}
            server={false}
            tblRows={files}
          />
        </Wrapper>
      </TableContextProvider>
    </div>
  </div>
);

export default FilesTable;
