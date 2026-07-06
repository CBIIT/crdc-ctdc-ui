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

// --------------- Pure helpers (exported for unit testing) ---------------

export const isAddButtonDisabled = (selectedRows, specimenIdsWithFiles) => {
  if (selectedRows.length === 0) return true;
  return !selectedRows.some((id) => specimenIdsWithFiles.has(id));
};

export const computeIdsToAdd = (fetchedIds, cartFiles) => {
  const existingCartIds = new Set(cartFiles);
  return [...new Set(fetchedIds)].filter((id) => !existingCartIds.has(id));
};

export const exceedsCartLimit = (idsToAdd, cartFiles, max) => {
  const existingCartIds = new Set(cartFiles);
  return existingCartIds.size + idsToAdd.length > max;
};

const AddBiospecimenFilesButton = ({ specimenIdsWithFiles }) => {
  const { context } = useContext(TableContext);
  const { selectedRows = [], dispatch: tableDispatch } = context;
  const reduxDispatch = useDispatch();
  const client = useApolloClient();
  const cartCount = useSelector((state) => state.cartReducer?.count || 0);
  const cartFiles = useSelector((state) => state.cartReducer?.filesId || []);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDisabled = loading || isAddButtonDisabled(selectedRows, specimenIdsWithFiles);

  const handleAddFiles = async () => {
    setLoading(true);
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

      const idsToAdd = computeIdsToAdd(ids, cartFiles);

      if (idsToAdd.length === 0) {
        // All files are already in the cart — nothing to add
      } else if (exceedsCartLimit(idsToAdd, cartFiles, maximumNumberOfFilesAllowedInTheCart)) {
        setDisplayAlert(true);
      } else {
        reduxDispatch(onAddCartFiles(idsToAdd));
        setOpenSnackbar(true);
        tableDispatch(onRowSeclect([]));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error adding biospecimen files:', err);
    } finally {
      setLoading(false);
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
        <button
          type="button"
          aria-label={BIOSPECIMEN_BUTTON_TOOLTIP}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex',
          }}
        >
          <img className="add_selected_file_tooltip_icon" src={HELP_ICON_URL} alt="" />
        </button>
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
