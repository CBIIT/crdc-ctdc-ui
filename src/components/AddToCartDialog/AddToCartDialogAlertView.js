import React, { useEffect } from 'react';
import {
  Dialog, DialogContent, DialogContentText,
} from '@material-ui/core';
import DialogThemeProvider from './dialogThemeConfig';
import { alertMessage as defaultAlertMessage } from '../../bento/fileCentricCartWorkflowData';

function AddToCartDialogAlertView(props) {
  const { open, classes = {}, onClose, alertMessage = defaultAlertMessage } = props;
  const closeAlertModelTimer = 4000;

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => { onClose(); }, closeAlertModelTimer);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  const AlertDialog = (
    <DialogThemeProvider>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.popUpWindow}
      >
        <DialogContent className={classes.popUpWindowContent}>
          <DialogContentText id="alert-dialog-description">
            {alertMessage}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </DialogThemeProvider>
  );

  return AlertDialog;
}

export default AddToCartDialogAlertView;
