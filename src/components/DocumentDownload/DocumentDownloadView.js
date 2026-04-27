import React from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core';
import ToolTip from '@bento-core/tool-tip';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import env from '../../utils/env';
import CustomIcon from '../CustomIcon/CustomIconView';
import { enableAuthentication } from '../../bento/siteWideConfig';
import SessionTimeOutModal from '../sessionTimeOutModal';
import { useAuth } from '../Authentication';
import { useGlobal } from '../Global/GlobalProvider';

const FILE_SERVICE_API = env.REACT_APP_FILE_SERVICE_API;

// Function to fetch and download a file
export const fetchFileToDownload = async (fileId = '', signOut, setShowModal, fileName, fileFormat, showUnauthorizedNotification) => {
  try {
    const response = await fetch(`${FILE_SERVICE_API}${fileId}`, {
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

    // Check if response status is not 401 (Unauthorized)
    if (response.status === 401) {
      showUnauthorizedNotification()
      throw new Error(`Failed to fetch the file from "${fileId}". Server responded with: ${response.status} (${response.statusText})`);
    }
    // Check if response status is not 200 (Not OK)
    if (response.status !== 200) {
      showUnauthorizedNotification()
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

    // Optionally append fileFormat to fileName
    let downloadName = fileName;
    if (fileFormat && !fileName.endsWith(`.${fileFormat}`)) {
      downloadName += `.${fileFormat}`;
    }

    // Create a URL for the blob
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', downloadName);
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
  }
};

/**
 * Renders a download icon with tooltip based on user auth state and file size.
 *
 * Cases:
 *  1. Authenticated + access granted + file < maxFileSize → clickable download icon
 *  2. Not signed in + file < maxFileSize → greyed icon, click redirects to login
 *  3. Signed in but no access + file < maxFileSize → greyed icon, no action
 *  4. File >= maxFileSize → preview icon (must use My Files workflow)
 */
const DocumentDownload = ({
  classes,
  fileSize = 0,
  fileFormat = '',
  maxFileSize = 200000,
  toolTipTextUnauthenticated = 'Login to access this file',
  toolTipTextFileDownload = 'Click to download a copy of this file if you have been approved by dbGaP',
  toolTipTextFilePreview = 'Because of its size and/or format, this file is unavailable for download and must be accessed via the My Files workflow',
  iconFileDownload = '',
  iconFilePreview = '',
  iconUnauthenticated = '',
  fileLocation = '',
  fileName,
}) => {
  const { signInWithAuthURL, signOut } = useAuth();
  const history = useHistory();
  const { isSignedIn } = useSelector((state) => state.login);
  const [showModal, setShowModal] = React.useState(false);
  const { Notification } = useGlobal();

  // TODO: Implement real ACL checking when backend supports it
  const hasAccess = true;

  const showUnauthorizedNotification = () => {
    const customElem = (
      <span>
        You must be logged in and must already have been granted access to download a copy of this file.{' '}
        <a className={classes.requestAccessLink} href="/#/request-access">Request access</a>{' '}
        through dbGaP to download this file.
      </span>
    );
    Notification.show(customElem, 6000, classes.alertStyles);
  };

  const handleDownload = () => {
    fetchFileToDownload(fileLocation, signOut, setShowModal, fileName, fileFormat, showUnauthorizedNotification);
  };

  const isLargeFile = fileSize >= maxFileSize;
  const canDownload = enableAuthentication && isSignedIn && hasAccess;

  const renderIcon = (icon, tooltip, style = {}, onClick) => (
    <ToolTip classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} title={tooltip} placement="bottom">
      <div style={{ textAlign: 'center', ...style }} onClick={onClick}>
        <CustomIcon imgSrc={icon} />
      </div>
    </ToolTip>
  );

  const inactiveStyle = { filter: 'grayscale(100%)', opacity: 0.5, cursor: 'pointer' };
  const disabledStyle = { filter: 'grayscale(100%)', opacity: 0.5 };

  return (
    <div>
      {isLargeFile
        ? renderIcon(iconFilePreview, toolTipTextFilePreview)
        : canDownload
          ? renderIcon(iconFileDownload, toolTipTextFileDownload, {}, handleDownload)
          : !isSignedIn
            ? renderIcon(iconUnauthenticated, toolTipTextUnauthenticated, inactiveStyle, () => history.push('/user/login'))
            : renderIcon(iconUnauthenticated, toolTipTextUnauthenticated, disabledStyle)
      }
      <SessionTimeOutModal
        open={showModal}
        closeModal={() => setShowModal(false)}
        handleClose={() => setShowModal(false)}
        submit={signInWithAuthURL}
        message="Please login to access files!"
      />
    </div>
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
  alertStyles: {
    backgroundColor: '#155E6F !important',
  },
  requestAccessLink: {
    fontWeight: 600,
    textDecoration: 'underline !important',
    color:'#FFFFFF',
    fontSize: '16px',
    '&:hover': {
      textDecoration: 'none',
      color: '#FFFFFF'
    },
  },
});

export default withStyles(styles)(DocumentDownload);
