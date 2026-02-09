import { Button, withStyles } from "@material-ui/core";
import React from "react";
import { ToolTip as Tooltip } from "../../../../../bento-core";
import toolTipIcon from "../../../../../assets/study/questionMarkTooltip.svg";


const DownloadBtn = ({ classes, handleCSVDownload }) => (
  <div className={classes.downloadAllBtnContainer}>
    <Button
      variant="contained"
      classes={{ root: classes.downloadAllBtn }}
      onClick={handleCSVDownload}
    >
      {"Download All"}
    </Button>
    <Tooltip
      title="Click to download all available clinical data in the form of multiple csv files"
      placement="top"
      classes={{ tooltip: classes.tooltipText }}
    >
      <img
        src={toolTipIcon}
        alt="tooltip"
        className={classes.headerCellTooltip}
      />
    </Tooltip>
  </div>
);

const styles = {
  downloadAllBtn: {
    width: "177px",
    height: "46px",
    borderRadius: "10px",
    padding: '16px 20px 16px 20px',
    background: "#004D73",
    color: "#FFFFFF",
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '14px',
    letterSpacing: 0,
    textAlign: "center",
    verticalAlign: "middle",
    textTransform: "uppercase",
  },
  tooltipText: {

    maxWidth: "auto",
    padding: "10px 15px",

    fontFamily: "Open Sans",
    fontWeight: 600,
    fontSize: "13px",
    lineHeight: "19px",
    color: '#223D4C',
    border: "1px solid #C3C3C3",
    boxShadow: "0px 4px 10px 0px #00000040",
    borderRadius: "5px",
    backgroundColor: "#FFFFFF",

  },
  downloadAllBtnContainer: {
    margin: "0px 0 18px 0",
  },
  headerCellTooltip: {
    width: "12px",
    marginBottom: "5px",
    position: "relative",
    left: "6px",
    bottom: "10px",
  },
};
export default withStyles(styles)(DownloadBtn);
