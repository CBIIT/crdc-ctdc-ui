import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient } from '@apollo/client';
import { Button, Snackbar } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { onAddCartFiles } from '@bento-core/cart';
import { TableContext, onRowSeclect } from '@bento-core/paginated-table';
import ToolTip from '@bento-core/tool-tip';
import {
  GET_FILE_IDS_FOR_SELECTED_BIOSPECIMENS,
} from '../../../bento/dashboardTabData';
import {
  alertMessage,
  maximumNumberOfFilesAllowedInTheCart,
} from '../../../bento/fileCentricCartWorkflowData';
import {
  BIOSPECIMEN_BUTTON_TOOLTIP,
} from '../../../bento/participantDetailData';
import AddToCartDialogAlertView from '../../../components/AddToCartDialog/AddToCartDialogAlertView';

const HELP_ICON_URL = 'https://raw.githubusercontent.com/google/material-design-icons/master/src/action/help/materialicons/24px.svg';

const AddBiospecimenFilesButton = ({ specimenIdsWithFiles }) => {
  const { context } = useContext(TableContext);
  const { selectedRows = [], dispatch: tableDispatch } = context;
  const reduxDispatch = useDispatch();
  const client = useApolloClient();
  const cartCount = useSelector((state) => state.cartReducer?.count || 0);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(false);

  const hasFilesForSelection = selectedRows.some((id) => specimenIdsWithFiles.has(id));
  const isDisabled = selectedRows.length === 0 || !hasFilesForSelection;

  const handleAddFiles = async () => {
    const variables = {
      first: 10000,
      specimen_record_id: selectedRows,
    };

    try {
      const { data } = await client.query({
        query: GET_FILE_IDS_FOR_SELECTED_BIOSPECIMENS,
        variables,
      });

      const ids = (data.biospecimen_data_files || [])
        .map((f) => f.data_file_uuid)
        .filter(Boolean);

      if (ids.length >= maximumNumberOfFilesAllowedInTheCart) {
        setDisplayAlert(true);
      } else {
        reduxDispatch(onAddCartFiles(ids));
        setOpenSnackbar(true);
        tableDispatch(onRowSeclect([]));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error adding biospecimen files:', err);
    }
  };

  return (
    <>
      <Button
        onClick={handleAddFiles}
        className="add_selected_button add_selected_button_Biospecimens"
        disableRipple
        disabled={isDisabled}
      >
        ADD FILES FOR SELECTED BIOSPECIMENS
      </Button>
      <ToolTip title={BIOSPECIMEN_BUTTON_TOOLTIP} arrow={false}>
        <img
          className="add_selected_file_tooltip_icon"
          src={HELP_ICON_URL}
          alt="tooltipIcon"
        />
      </ToolTip>
      <Snackbar
        className="snackBar"
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={(
          <div className="snackBarMessage">
            <span className="snackBarMessageIcon">
              <CheckCircleIcon />
              {' '}
            </span>
            <span className="snackBarText">
              {cartCount}
              {' '}
              File(s) successfully added to My Files.
            </span>
          </div>
        )}
      />
      {displayAlert && (
        <AddToCartDialogAlertView
          alertMessage={alertMessage}
          open={displayAlert}
          onClose={() => setDisplayAlert(false)}
        />
      )}
    </>
  );
};

export default AddBiospecimenFilesButton;
