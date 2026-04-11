import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient } from '@apollo/client';
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
import { biospecimenColumns, BIOSPECIMEN_BUTTON_TOOLTIP } from '../../../bento/participantDetailData';
import { GET_FILE_IDS_FOR_SELECTED_BIOSPECIMENS } from '../../../bento/dashboardTabData';
import {
  maximumNumberOfFilesAllowedInTheCart,
  alertMessage,
} from '../../../bento/fileCentricCartWorkflowData';
import SnackbarView from '@bento-core/paginated-table/dist/wrapper/components/Snackbar/Snackbar';
import AddToCartDialogAlertView from '@bento-core/paginated-table/dist/wrapper/components/AddToCartDialog/AddToCartDialogAlertView';

const initBiospecimenTableState = (initialState) => ({
  ...initialState,
  title: 'Biospecimens',
  dataKey: 'specimen_record_id',
  tableMsg: { noMatch: 'No biospecimens associated with this participant.' },
  columns: biospecimenColumns,
  selectedRows: [],
  sortBy: 'specimen_record_id',
  sortOrder: 'asc',
  rowsPerPage: 10,
  page: 0,
  extendedViewConfig: {
    pagination: false,
    manageViewColumns: { title: 'View Columns' },
    download: {
      downloadCsv: 'Download Table Contents As CSV',
      downloadFileName: 'CTDC_Participant_Biospecimens',
    },
  },
});

const BiospecimenButtons = ({ classes }) => {
  const { context } = useContext(TableContext);
  const selectedRows = context?.selectedRows || [];
  const dispatch = useDispatch();
  const client = useApolloClient();
  const filesId = useSelector((state) => state.cartReducer.filesId);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [addedCount, setAddedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const result = await client.query({
        query: GET_FILE_IDS_FOR_SELECTED_BIOSPECIMENS,
        variables: { specimen_record_id: selectedRows, first: 10000 },
        fetchPolicy: 'network-only',
      });
      const fileIds = (result?.data?.biospecimen_data_files || []).map((f) => f.data_file_uuid);
      const newUniqueFiles = fileIds.filter((id) => !filesId.includes(id));
      if (filesId.length + newUniqueFiles.length > maximumNumberOfFilesAllowedInTheCart) {
        setDisplayAlert(true);
        return;
      }
      dispatch(onAddCartFiles(fileIds));
      setAddedCount(newUniqueFiles.length);
      setOpenSnackbar(true);
      context.dispatch(onRowSeclect([]));
    } finally {
      setLoading(false);
    }
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
      <div className={classes.biospecimenButtonRow}>
        <span>
          <Button
            className={classes.cartButton}
            disabled={selectedRows.length === 0 || loading}
            onClick={handleAddToCart}
            disableElevation
          >
            Add Files for Selected Biospecimens
          </Button>
        </span>
        <Tooltip title={BIOSPECIMEN_BUTTON_TOOLTIP} placement="top-end" classes={{ tooltip: classes.tooltipBody }}>
          <HelpIcon className={classes.questionMarkIcon} />
        </Tooltip>
        <span>
          <Button className={classes.jbrowseButton} disabled disableElevation>
            View in&nbsp;<img src={jbrowseIcon} alt="JBrowse" className={classes.jbrowseIcon} />JBrowse
          </Button>
        </span>
        <Tooltip title="View in JBrowse (coming soon)" placement="top-end" classes={{ tooltip: classes.tooltipBody }}>
          <HelpIcon className={classes.questionMarkIcon} />
        </Tooltip>
      </div>
    </>
  );
};

const BiospecimensTable = ({ classes, biospecimens = [] }) => (
  <div className={classes.tableSection}>
    <div className={classes.tableSectionTitle}>Associated Biospecimens</div>
    <div className={classes.tableWrapper}>
      <TableContextProvider>
        <TableView
          initState={initBiospecimenTableState}
          themeConfig={{ ...themeConfig, customTheme }}
          queryVariables={{}}
          totalRowCount={biospecimens.length}
          server={false}
          tblRows={biospecimens}
        />
        <BiospecimenButtons classes={classes} />
      </TableContextProvider>
    </div>
  </div>
);

export default BiospecimensTable;
