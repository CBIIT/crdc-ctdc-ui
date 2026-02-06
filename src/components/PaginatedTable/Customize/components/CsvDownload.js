import React from 'react';
import { withStyles } from '@material-ui/styles';
import downloadIcon from '../../../../assets/icons/clinical_data_csv_icon.svg';
import { downloadJson } from '../../../../pages/fileCentricCart/utils';
import { ToolTip } from '../../../../bento-core';

const CsvDownlaod = ({
  classes,
  csvDataRow = [],
  manifest,
  fileName,
}) => {
  const handleCSVDownload = () => {
    downloadJson(csvDataRow, '', fileName, manifest);
  };
  return (
    <>
      {
        (csvDataRow.length > 0) && (
          <ToolTip
            classes={{ tooltip: classes.tooltipText }}
            title="Click to download the contents of this node"
          >
            <div
              className={classes.tooltipImageWrapper}
              onClick={() => handleCSVDownload()}
            >
              <img
                src={downloadIcon}
                alt="csv download icon"
                className={classes.icon}
              />
            </div>
          </ToolTip>
        )
      }
    </>
  );
};

const styles = {
  tooltipText:{
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
  icon: {
    width: '24.71px',
    height: '24.72px',
  },
  tooltipImageWrapper: {
    cursor: 'pointer',
  },
};

export default withStyles(styles)(CsvDownlaod);
