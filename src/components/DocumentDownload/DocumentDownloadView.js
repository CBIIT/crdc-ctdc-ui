import React from 'react';
import { useSelector } from 'react-redux';
import {
  withStyles,
} from '@material-ui/core';
import ToolTip from '@bento-core/tool-tip';
import { useHistory } from 'react-router-dom';
import env from '../../utils/env';
import CustomIcon from '../CustomIcon/CustomIconView';
// import { jBrowseOptions } from '../../bento/jbrowseDetailData';

import { enableAuthentication } from '../../bento/siteWideConfig';
import SessionTimeOutModal from '../sessionTimeOutModal';
import { useAuth } from '../Authentication';

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


// NOTE: This component is getting more complex, will need to refactor at some point.
const DocumentDownload = ({
  classes,
  fileSize = 0,
  fileFormat = '',
  maxFileSize = 200000,
  toolTipTextUnauthenticated = 'Login to access this file',
  toolTipTextFileDownload = 'Download a copy of this file',
  toolTipTextFilePreview = 'Because of its size and/or format, this file is unavailable for download and must be accessed via the My Files workflow',
  toolTipTextFileViewer = 'Jbrowse file viewer',
  iconFileDownload = '',
  iconFilePreview = '',
  iconFileViewer = '',
  iconUnauthenticated = '',
  fileLocation = '',
  caseId = '',
  requiredACLs = [],
  fileName,
}) => {
  const {
    signInWithGoogle,
    signOut,
  } = useAuth();
  const history = useHistory();

  // const { isSignedIn, acl: currentUserACL = [], role } = useSelector((state) => state.login);
  const { isSignedIn } = useSelector((state) => state.login);

  const [showModal, setShowModal] = React.useState(false);

  /*
  // Related to hasAccess()
  const approvedACLs = currentUserACL.reduce(
    (results, acl) => {
      if (acl.accessStatus.toLowerCase() === 'approved') results.push(acl.armID);
      return results;
    },
    [],
  );
*/
  const closeModal = () => {
    setShowModal(false);
  };

  const hasAccess = () => {
    /*
    if (role === 'admin') return true;

    return requiredACLs.reduce(
      (status, rACL) => approvedACLs.includes(rACL) || status, false,
    );
    */
    return isSignedIn;
  };

  return (
    <>
      <div>
        {fileSize < maxFileSize && (
          <>
            {(enableAuthentication && isSignedIn && hasAccess()) ? (
              /* ** Case 1: Logged in and granted access, file size below 10MB ** */
              <ToolTip classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} title={toolTipTextFileDownload} placement="bottom">
                <div
                  style={{ textAlign: 'center' }}
                  onClick={() => fetchFileToDownload(fileLocation, signOut, setShowModal, fileName, fileFormat)}
                >
                  <CustomIcon imgSrc={iconFileDownload} />
                </div>
              </ToolTip>
            /* ** Case 2: Not logged in or access not granted, file size below 10MB ** */
            ) : (!isSignedIn) ? (
              // Case 2.1 Not logged in
              <ToolTip classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} title={toolTipTextUnauthenticated} placement="bottom">
                <div
                  style={{ textAlign: 'center' }}
                  onClick={() => history.push('/user/login?redirect=/explore')}
                >
                  <CustomIcon imgSrc={iconUnauthenticated} />
                </div>
              </ToolTip>
            ) : (
              // Case 2.2 Access not granted
              <ToolTip classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} title={toolTipTextUnauthenticated} placement="bottom">
                <div
                  style={{ textAlign: 'center' }}
                >
                  <CustomIcon imgSrc={iconUnauthenticated} />
                </div>
              </ToolTip>
            )}
          </>
        )}
        { fileSize >= maxFileSize && (
          /* ** Case 3: Regardless of login status, file size larger than 10MB ** */
          <ToolTip classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} title={toolTipTextFilePreview} placement="bottom">
            <div
              style={{ textAlign: 'center' }}
            >
              <CustomIcon imgSrc={iconFilePreview} />
            </div>
          </ToolTip>
        )}
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
  customTooltip: {
    borderRadius: '5px',
    border: '.2px solid #C3C3C3',
    // border: 'none',
    boxShadow: '0px 4px 10px 0px #00000040',
    fontFamily: 'Open Sans',
    color: '#223D4C',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '19px',
    letterSpacing: '0em',
    textAlign: 'left',
    maxWidth: '153px',
    padding: '10px 15px'
  },
  customArrow: {
  },
});

export default withStyles(styles)(DocumentDownload);
