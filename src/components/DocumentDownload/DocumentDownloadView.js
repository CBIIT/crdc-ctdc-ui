import React from 'react';
import { useSelector } from 'react-redux';
import {
  withStyles,
} from '@material-ui/core';
import ToolTip from '@bento-core/tool-tip';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import env from '../../utils/env';
import CustomIcon from '../CustomIcon/CustomIconView';
import { enableAuthentication } from '../../bento/siteWideConfig';
import SessionTimeOutModal from '../sessionTimeOutModal';
import { useAuth } from '../Authentication';

const FILE_SERVICE_API = env.REACT_APP_FILE_SERVICE_API;

// Function to fetch and download a file
export const fetchFileToDownload = async (fileId = '', signOut, setShowModal, fileName, fileFormat) => {
  
  let hardcodedId = "" 
  if (fileFormat === "zip") {
    hardcodedId = 'dg.4DFC/4df75011-0149-4f1e-9f5a-e9c192618c17';
  } else if (fileFormat === "pdf") {
    hardcodedId = 'dg.4DFC/3e2333fd-81e5-4241-b4dc-3c0266a00720';
  } else {
    hardcodedId = 'dg.4DFC/9f99d2ac-7d5d-43ed-99d6-998829fad00a';
  }

  try {
    const response = await fetch(`${FILE_SERVICE_API}${hardcodedId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
    });

    // Check if response status is 403 (Forbidden)
    if (response.status === 403) {
      signOut();
      setShowModal(true);
      throw new Error('Forbidden');
    }

    // Check if response status is not 200 (OK)
    if (response.status !== 200) {
      throw new Error(`Failed to fetch the file from "${fileId}". Server responded with: ${response.status} (${response.statusText})`);
    }

    // Parse response body as JSON
    const jsonResponse = await response.json();

    // Extract file URL from the response
    const fileURL = jsonResponse.url;
    if (!fileURL) {
      throw new Error('Missing File URL');
    }

    // Download the file
    await downloadFile(fileURL, fileName, fileFormat);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Function to download the file
const downloadFile = async (signedUrl, fileName, fileFormat) => {
  try {
    const response = await axios({
      url: signedUrl,
      method: 'GET',
      responseType: 'blob',
    });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;

    if (fileFormat === "vcf") fileFormat +='.gz'
    // Set the file name
    link.setAttribute('download', `${fileName}.${fileFormat}`);
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Cleanup and remove the link
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Failed to download file:', error);
  }
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
  iconFileDownload = '',
  iconFilePreview = '',
  iconUnauthenticated = '',
  fileLocation = '',
  requiredACLs = [],
  fileName,
}) => {
  const {
    signInWithAuthURL,
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
                  onClick={() => history.push('/user/login')}
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
          submit={signInWithAuthURL}
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
