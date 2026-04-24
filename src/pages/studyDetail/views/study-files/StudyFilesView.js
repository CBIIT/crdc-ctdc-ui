import React, { useContext, useState } from 'react';
import { withStyles, Button, Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { useDispatch, useSelector } from 'react-redux';
import { TableContextProvider, TableContext, onRowSeclect } from '../../../../bento-core';
import { onAddCartFiles } from '@bento-core/cart';
import PaginatedTableView from '../../../../components/PaginatedTable/TableView';
import { studyFilesTabConfig } from '../../../../bento/studyDetailData';
import { studyFilesThemeConfig } from './StudyFilesTheme';
import styles from './StudyFilesStyle';
import {
  maximumNumberOfFilesAllowedInTheCart,
  alertMessage,
} from '../../../../bento/fileCentricCartWorkflowData';
import SnackbarView from '@bento-core/paginated-table/dist/wrapper/components/Snackbar/Snackbar';
import AddToCartDialogAlertView from '@bento-core/paginated-table/dist/wrapper/components/AddToCartDialog/AddToCartDialogAlertView';

const FILES_BUTTON_TOOLTIP = 'Add filtered files associated with all participants in the current results set to My Files';

const studyFilesWrapperConfig = [
  {
    container: 'paginatedTable',
    paginatedTable: true,
  },
];

const StudyFileButtons = ({ classes }) => {
  const { context } = useContext(TableContext);
  const selectedRows = context?.selectedRows || [];
  const dispatch = useDispatch();
  const filesId = useSelector((state) => state.cartReducer.filesId);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

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
        <Button
          className={classes.cartButton}
          disabled={selectedRows.length === 0}
          onClick={handleAddToCart}
          disableElevation
        >
          ADD SELECTED FILES
        </Button>
        <Tooltip
          title={FILES_BUTTON_TOOLTIP}
          placement="top-start"
          classes={{ tooltip: classes.tooltipBody }}
        >
          <button
            aria-label={`Help: ${FILES_BUTTON_TOOLTIP}`}
            className={classes.tooltipIconButton}
          >
            <HelpIcon className={classes.questionMarkIcon} aria-hidden="true" />
          </button>
        </Tooltip>
      </div>
    </>
  );
};

const StudyFilesView = ({ studyDataFiles = [], classes }) => (
  <div className={classes.container}>
    <p className={classes.paragraph}>
      This study currently has the following Study Files directly associated with it.
    </p>
    <div className={classes.paginatedTableWrapper}>
      <TableContextProvider>
        <PaginatedTableView
          config={studyFilesTabConfig}
          totalRowCount={studyDataFiles.length}
          activeFilters={{}}
          tblRows={studyDataFiles}
          isServer={false}
          tableLayOut={studyFilesWrapperConfig}
          customthemeConfig={studyFilesThemeConfig}
          activeTab
        />
        <StudyFileButtons classes={classes} />
      </TableContextProvider>
    </div>
  </div>
);

export default withStyles(styles)(StudyFilesView);
