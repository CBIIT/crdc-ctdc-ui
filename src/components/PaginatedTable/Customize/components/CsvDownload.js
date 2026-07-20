import React from "react";
import { withStyles } from "@material-ui/styles";
import downloadIcon from "../../../../assets/icons/clinical_data_csv_icon.svg";
import { downloadJson } from "../../../../pages/fileCentricCart/utils";
import { ToolTip } from "../../../../bento-core";

const CsvDownload = ({
  classes,
  csvDataRow = [],
  isCsvDisabled = false,
  manifest,
  fileName,
}) => {
  const handleCSVDownload = () => {
    downloadJson(csvDataRow, "", fileName, manifest);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault();
      handleCSVDownload();
    }
  };

  if (isCsvDisabled) {
    return (
      <div className={classes.disabledIconWrapper} aria-disabled="true">
        <img
          src={downloadIcon}
          alt="csv download icon disabled"
          className={classes.disabledIcon}
        />
      </div>
    );
  }

  return (
    <>
      {csvDataRow?.length > 0 && (
        <ToolTip
          classes={{ tooltip: classes.tooltipText }}
          title="Click to download the contents of this node"
        >
          <div
            className={classes.tooltipImageWrapper}
            role="button"
            tabIndex={0}
            aria-label="Download CSV for this clinical data node"
            onClick={handleCSVDownload}
            onKeyDown={handleKeyDown}
          >
            <img
              src={downloadIcon}
              alt="csv download icon"
              className={classes.icon}
            />
          </div>
        </ToolTip>
      )}
    </>
  );
};

const styles = {
  tooltipText: {
    maxWidth: "175px",
    padding: "10px 15px",

    fontFamily: "Open Sans",
    fontWeight: 600,
    fontSize: "13px",
    lineHeight: "19px",
    color: "#223D4C",
    border: "1px solid #C3C3C3",
    boxShadow: "0px 4px 10px 0px #00000040",
    borderRadius: "5px",
    backgroundColor: "#FFFFFF",
  },
  icon: {
    width: "24.71px",
    height: "24.72px",
  },
  tooltipImageWrapper: {
    cursor: "pointer",
  },
  disabledIconWrapper: {
    cursor: "not-allowed",
  },
  disabledIcon: {
    width: "24.71px",
    height: "24.72px",
    opacity: 0.35,
    filter: "grayscale(100%)",
  },
};

export default withStyles(styles)(CsvDownload);
