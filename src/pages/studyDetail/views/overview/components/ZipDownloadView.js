import React from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  withStyles,
} from '@material-ui/core';
import ToolTip from '@bento-core/tool-tip';
import { useHistory } from 'react-router-dom';
import env from '../../../../../utils/env';

import { enableAuthentication } from '../../../../../bento/siteWideConfig';
import SessionTimeOutModal from '../../../../../components/sessionTimeOutModal';
import { useAuth } from '../../../../../components/Authentication';

const FILE_SERVICE_API = env.REACT_APP_FILE_SERVICE_API;

// Function to fetch and download a file
const fetchFileToDownload = (fileId = '', signOut, setShowModal, fileName, fileFormat) => {
  fetch(`${FILE_SERVICE_API}${fileId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/pdf',
    },
  })
  .then((response) => {
    // Check if response status is 403 (Forbidden)
    if (response.status === 403) {
      // Trigger sign out and show modal
      signOut();
      setShowModal(true);
      // Throw an error to stop the execution of the promise chain
      throw new Error('Forbidden');
    } 
    // Check if response status is not 200 (OK)
    else if (response.status !== 200) {
      // Throw an error with detailed message
      throw new Error(`Failed to fetch the file from "${fileId}". Server responded with: ${response.status} (${response.statusText})`);
    }
    // If response status is 200, parse response body as JSON
    return response.json();
  })
  .then((response) => {
    // Extract file path from the response
    const fileURL = response.url;

    // Check if file path exists
    if (!fileURL) {
      // If file path is missing, throw an error
      throw new Error('Missing File URL');
    }
    
    // Call function to download the file
    downloadFile(fileURL, fileName, fileFormat);
  })
  .catch((error) => {
    // Catch and log any errors occurred during the process
    console.error('Error:', error.message);
  });
};

// Function to download a file
const downloadFile = (fileURL, fileName, fileFormat) => {
  // Create a link element
  const link = document.createElement('a');
  // Set the href attribute to the file path
  link.href = fileURL;
  // Set the download attribute to specify the file name
  link.setAttribute('download', `${fileName}.${fileFormat}`);
  
  // Append the link to the document body and trigger the download
  document.body.appendChild(link);
  link.click();
  // Clean up: Remove the link element from the document body
  link.parentNode.removeChild(link);
};

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

const styles = () => ({
  downloadAllBtnContainer: {
    marginTop: '16px',
  },
  downloadAllBtn: {
    background: '#004D73',
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
    '&:hover': {
      border: '1px solid #004D73',
    },
  },
  disabledDownloadAllBtn: {
    background: '#004D7380',
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
