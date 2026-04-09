import React, { useContext } from 'react';
import { Tooltip, Button } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import jbrowseIcon from '../../../assets/participant/jbrowse_icon.png';
import {
  TableContextProvider,
  TableView,
  TableContext,
} from '@bento-core/paginated-table';
import { themeConfig } from '../../dashTemplate/tabs/tableConfig/Theme';
import { customTheme } from '../../dashTemplate/tabs/wrapperConfig/Theme';
import { filesColumns, FILES_BUTTON_TOOLTIP } from '../../../bento/participantDetailData';

const initFilesTableState = (initialState) => ({
  ...initialState,
  title: 'Files',
  dataKey: 'data_file_uuid',
  tableMsg: { noMatch: 'No files associated with this participant.' },
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

const FileButtons = ({ classes }) => {
  const { context } = useContext(TableContext);
  const selectedRows = context?.selectedRows || [];

  return (
    <div className={classes.tableButtonRow}>
      <span>
        <Button
          className={classes.cartButton}
          disabled={selectedRows.length === 0}
          onClick={() => {
            // TODO: Wire up to AddToCart flow
          }}
          disableElevation
        >
          Add Selected Files
        </Button>
      </span>
      <Tooltip title={FILES_BUTTON_TOOLTIP} placement="top-end" classes={{ tooltip: classes.tooltipBody }}>
        <HelpIcon className={classes.questionMarkIcon} />
      </Tooltip>
      <span>
        <Button className={classes.jbrowseButton} disabled disableElevation>
          View in&nbsp;<img src={jbrowseIcon} alt="JBrowse" className={classes.jbrowseIcon} /><strong>J</strong>Browse
        </Button>
      </span>
      <Tooltip title="View in JBrowse (coming soon)" placement="top-end" classes={{ tooltip: classes.tooltipBody }}>
        <HelpIcon className={classes.questionMarkIcon} />
      </Tooltip>
    </div>
  );
};

const FilesTable = ({ classes, files = [] }) => (
  <div className={classes.tableSection}>
    <div className={classes.tableSectionTitle}>Associated Files</div>
    <div className={classes.tableWrapper}>
      <TableContextProvider>
        <TableView
          initState={initFilesTableState}
          themeConfig={{ ...themeConfig, customTheme }}
          queryVariables={{}}
          totalRowCount={files.length}
          server={false}
          tblRows={files}
        />
        <FileButtons classes={classes} />
      </TableContextProvider>
    </div>
  </div>
);

export default FilesTable;
