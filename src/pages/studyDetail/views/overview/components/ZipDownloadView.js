import React from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  withStyles,
} from '@material-ui/core';
import ToolTip from '@bento-core/tool-tip';
import env from '../../../../../utils/env';

import { enableAuthentication } from '../../../../../bento/siteWideConfig';
import SessionTimeOutModal from '../../../../../components/sessionTimeOutModal';
import { useAuth } from '../../../../../components/Authentication';
import { fetchFileToDownload } from '../../../../../components/DocumentDownload/DocumentDownloadView';

const DocumentDownload = ({
  classes,
  fileFormat = '',
  toolTipTextUnauthenticated = 'You must be logged in and must already have been granted access to download a copy of this file',
  toolTipTextFileDownload = 'Download a copy of this file',
  iconFileDownload = '',
  iconUnauthenticated = '',
  fileLocation = '',
  fileName,
  toolTipIcon,
}) => {
  const { signInWithGoogle, signOut } = useAuth();
  const { isSignedIn } = useSelector((state) => state.login);
  const [showModal, setShowModal] = React.useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  // Can be more than isSignedIn by checking if currect user has the required ACLs
  const hasAccess = () => {
    return isSignedIn;
  };

  return (
    <>
      <div>
        <>
          {(enableAuthentication && isSignedIn && hasAccess()) ? (
            /* ** Case 1: Logged in and granted access ** */
            <div className={classes.downloadAllBtnContainer}>
              <Button
                variant="contained"
                classes={{ root: classes.downloadAllBtn }}
                onClick={() => fetchFileToDownload(fileLocation, signOut, setShowModal, fileName, fileFormat)}
              >
                ZIP&nbsp;FILE
                <img src={iconFileDownload} alt="download icon" className={classes.downloadIcon} />
              </Button>
              <ToolTip classes={{ tooltip: classes.customTooltip }} title={toolTipTextFileDownload} placement="right">
                <img src={toolTipIcon} alt="tooltip" className={classes.tooltipIcon}/>
              </ToolTip>
            </div>
          /* ** Case 2: Not logged in or access not granted ** */
          ) : (
            <div className={classes.downloadAllBtnContainer}>
              <Button classes={{ root: classes.disabledDownloadAllBtn }}>
                ZIP&nbsp;FILE
                <img src={iconUnauthenticated} alt="download icon" className={classes.downloadIcon} />
              </Button>
              <ToolTip classes={{ tooltip: classes.customTooltip }} title={toolTipTextUnauthenticated} placement="right">
                <img src={toolTipIcon} alt="tooltip" className={classes.tooltipIcon}/>
              </ToolTip>
            </div>
          )}
        </>

        <SessionTimeOutModal
          open={showModal}
          closeModal={closeModal}
          handleClose={closeModal}
          submit={signInWithGoogle}
          message="Please login to access files!"
        />
      </div>
    </>
  );
};

const commonStyles = {
  buttonBase: {
    width: '126px',
    height: '46px',
    fontSize: '14px',
    lineHeight: '14px',
    fontWeight: 500,
    fontStyle: 'normal',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    borderRadius: '10px',
    textAlign: 'center',
  }
}

const styles = () => ({
  downloadAllBtnContainer: {
    marginTop: '16px',
  },
  downloadAllBtn: {
    ...commonStyles.buttonBase,
    background: '#004D73',
    '&:hover': {
      border: '1px solid #004D73',
    },
  },
  disabledDownloadAllBtn: {
    ...commonStyles.buttonBase,
    background: '#004D7380',
    '&:hover': {
      background: '#004D7380',
    },
  },
  downloadIcon: {
    width: '24.71px',
    height: '24.72px',
    marginLeft: '10px',
  },
  customTooltip: {
    maxWidth: '208px',
    borderRadius: '5px',
    border: '.2px solid #C3C3C3',
    boxShadow: '0px 4px 10px 0px #00000040',
    fontFamily: 'Open Sans',
    color: '#223D4C',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '19px',
    letterSpacing: '0em',
    textAlign: 'left',
    padding: '10px 15px',
    position: 'relative',
    top: '30px',
  },
  tooltipIcon: {
    position: 'relative',
    left: '4px',
    bottom: '13px',
  },
});

export default withStyles(styles)(DocumentDownload);
