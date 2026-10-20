import React from "react";
import { useSelector } from "react-redux";
import { withStyles } from "@material-ui/core";
import ToolTip from "@bento-core/tool-tip";
import { useHistory } from "react-router-dom";

import CustomIcon from "../CustomIcon/CustomIconView";
import { enableAuthentication } from "../../bento/siteWideConfig";
import SessionTimeOutModal from "../sessionTimeOutModal";
import { useAuth } from "../Authentication";
import { useGlobal } from "../Global/GlobalProvider";
import { getFileDownloadIdp } from "../../utils/authUtil";
import { fetchFileToDownload } from "./downloadUtils";

const DocumentDownload = ({
  classes,
  fileFormat = "",
  fileSize,
  toolTipTextUnauthenticated = "Login to access this file",
  toolTipTextFileDownload = "Click to download a copy of this file if you have been approved by dbGaP",
  iconFileDownload = "",
  iconUnauthenticated = "",
  fileLocation = "",
  requiredACLs = [],
  fileName,
  studyAccession = "",
  idp: propIdp,
}) => {
  const { signInWithAuthURL, signOut } = useAuth();
  const history = useHistory();

  // const { isSignedIn, acl: currentUserACL = [], role } = useSelector((state) => state.login);
  const authData = useSelector((state) => state.login);
  const { isSignedIn } = authData;
  const idp = propIdp || getFileDownloadIdp(authData);

  const [showModal, setShowModal] = React.useState(false);
  const [hasAccess] = React.useState(true);

  const { Notification } = useGlobal();
  const showUnauthorizedNotification = () => {
    const requestAccessLinkStyle = {
      color: "#FFFFFF",
      fontWeight: 600,
      textDecoration: "underline",
      fontSize: "16px",
    };
    const customElem = (
      <span>
        You must be logged in and must already have been granted access to
        download a copy of this file.{" "}
        <a
          className={classes.requestAccessLink}
          href="/#/request-access"
          style={requestAccessLinkStyle}
        >
          Request access
        </a>{" "}
        through dbGaP to download this file.
      </span>
    );

    Notification.show(customElem, 6000, classes.alertStyles);
  };

  const showDownloadErrorNotification = () => {
    const customElem = (
      <span>
        Unable to download this file. Please try again.
        If the problem continues, contact support.
      </span>
    );

    Notification.show(customElem, 6000, classes.alertStyles);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div>
        {enableAuthentication && isSignedIn && hasAccess ? (
          /* ** Case 1: Logged in and granted access ** */
          <ToolTip
            classes={{
              tooltip: classes.customTooltip,
              arrow: classes.customArrow,
            }}
            title={toolTipTextFileDownload}
            placement="bottom"
          >
            <div
              onClick={() =>
                fetchFileToDownload({
                  fileId: fileLocation,
                  signOut,
                  setShowModal,
                  fileName,
                  fileFormat,
                  fileSize,
                  showUnauthorizedNotification,
                  showDownloadErrorNotification,
                  studyAccession,
                  idp,
                })
              }
              style={{ textAlign: "center" }}
            >
              <CustomIcon imgSrc={iconFileDownload} />
            </div>
          </ToolTip>
        ) : /* ** Case 2: Not logged in or access not granted ** */
        !isSignedIn ? (
          // Case 2.1 Not logged in
          <ToolTip
            classes={{
              tooltip: classes.customTooltip,
              arrow: classes.customArrow,
            }}
            title={toolTipTextUnauthenticated}
            placement="bottom"
          >
            <div
              style={{ textAlign: "center" }}
              onClick={() => history.push("/user/login")}
            >
              <CustomIcon imgSrc={iconUnauthenticated} />
            </div>
          </ToolTip>
        ) : (
          // Case 2.2 Access not granted
          <ToolTip
            classes={{
              tooltip: classes.customTooltip,
              arrow: classes.customArrow,
            }}
            title={toolTipTextUnauthenticated}
            placement="bottom"
          >
            <div style={{ textAlign: "center" }}>
              <CustomIcon imgSrc={iconUnauthenticated} />
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
    borderRadius: "5px",
    border: ".2px solid #C3C3C3",
    // border: 'none',
    boxShadow: "0px 4px 10px 0px #00000040",
    fontFamily: "Open Sans",
    color: "#223D4C",
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: "19px",
    letterSpacing: "0em",
    textAlign: "left",
    maxWidth: "153px",
    padding: "10px 15px",
  },
  customArrow: {},
  alertStyles: {
    backgroundColor: "#155E6F !important",
  },
  requestAccessLink: {
    fontWeight: 600,
    textDecoration: "underline !important",
    color: "#FFFFFF",
    fontSize: "16px",
    "&:hover": {
      textDecoration: "none",
      color: "#FFFFFF",
    },
  },
});

export default withStyles(styles)(DocumentDownload);
