import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Button } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import jbrowseIcon from '../../../assets/participant/jbrowse_icon.png';
import {
  TableContextProvider,
  TableView,
  TableContext,
  onRowSeclect,
} from '@bento-core/paginated-table';
import { onAddCartFiles } from '@bento-core/cart';
import { themeConfig, customTheme } from '../tableThemeConfig';
import { filesColumns, FILES_BUTTON_TOOLTIP, showJBrowseButton } from '../../../bento/participantDetailData';
import {
  maximumNumberOfFilesAllowedInTheCart,
  alertMessage,
} from '../../../bento/fileCentricCartWorkflowData';
import SnackbarView from '@bento-core/paginated-table/dist/wrapper/components/Snackbar/Snackbar';
import AddToCartDialogAlertView from '@bento-core/paginated-table/dist/wrapper/components/AddToCartDialog/AddToCartDialogAlertView';

const initFilesTableState = (initialState) => ({
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

const FileButtons = ({ classes, hasFiles }) => {
  const { context } = useContext(TableContext);
  const selectedRows = context?.selectedRows || [];
  const dispatch = useDispatch();
  const filesId = useSelector((state) => state.cartReducer.filesId);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [addedCount, setAddedCount] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleAddToCart = () => {
    const newUniqueFiles = selectedRows.filter((id) => !filesId.includes(id));
    if (filesId.length + newUniqueFiles.length > maximumNumberOfFilesAllowedInTheCart) {
      setDisplayAlert(true);
      return;
    }
    dispatch(onAddCartFiles(selectedRows));
    setAddedCount(newUniqueFiles.length);
    setOpenSnackbar(true);
    context.dispatch(onRowSeclect([]));
  };

  return (
    <>
      <SnackbarView open={openSnackbar} count={addedCount} onClose={() => setOpenSnackbar(false)} />
      {displayAlert && (
        <AddToCartDialogAlertView
          open={displayAlert}
          alertMessage={alertMessage}
          onClose={() => setDisplayAlert(false)}
        />
      )}
      <div className={classes.tableButtonRow}>
        {hasFiles && (
          <>
            <span>
              <Button
                className={classes.cartButton}
                disabled={selectedRows.length === 0}
                onClick={handleAddToCart}
                disableElevation
              >
                Add Selected Files
              </Button>
            </span>
            <Tooltip
              title={FILES_BUTTON_TOOLTIP}
              placement="top-end"
              classes={{ tooltip: classes.tooltipBody }}
              open={tooltipOpen}
              onClose={() => setTooltipOpen(false)}
              disableHoverListener
              disableFocusListener
              disableTouchListener
            >
              <button
                aria-label={`Help: ${FILES_BUTTON_TOOLTIP}`}
                className={classes.tooltipIconButton}
                onClick={() => setTooltipOpen(!tooltipOpen)}
              >
                <HelpIcon className={classes.questionMarkIcon} aria-hidden="true" />
              </button>
            </Tooltip>
          </>
        )}
        {showJBrowseButton && (
          <>
            <span>
              <Button className={classes.jbrowseButton} disabled disableElevation>
                View in&nbsp;<img src={jbrowseIcon} alt="JBrowse" className={classes.jbrowseIcon} />JBrowse
              </Button>
            </span>
            <Tooltip title="View in JBrowse (coming soon)" placement="top-end" classes={{ tooltip: classes.tooltipBody }}>
              <button
                aria-label="Help: View in JBrowse (coming soon)"
                className={classes.tooltipIconButton}
              >
                <HelpIcon className={classes.questionMarkIcon} aria-hidden="true" />
              </button>
            </Tooltip>
          </>
        )}
      </div>
    </>
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
        <FileButtons classes={classes} hasFiles={files.length > 0} />
      </TableContextProvider>
    </div>
  </div>
);

export default FilesTable;
