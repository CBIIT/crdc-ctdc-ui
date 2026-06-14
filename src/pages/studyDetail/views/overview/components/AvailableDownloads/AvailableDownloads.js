import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import ZipDownloadView from "./ZipDownloadView";
import downloadSuccess from "../../../../../../assets/study/zipDownloadIcon.svg";
import toolTipIcon from "../../../../../../assets/study/questionMarkTooltip.svg";

const documentDownloadProps = {
  // datafield where file file id exists in the table which is used to get file location
  fileLocationColumn: "data_file_uuid",
  // datafield where file format exists in the table
  fileFormatColumn: "data_file_format",
  // datafield where file name exists
  fileNameColumn: "data_file_name",

  // Case 1: Logged in and granted access
  toolTipTextFileDownload:
    "Click to download a copy of this file if you have been approved by dbGaP",
  iconFileDownload: downloadSuccess,

  // Case 2: Not logged in or access not granted
  iconUnauthenticated: downloadSuccess,
  toolTipTextUnauthenticated:
    "You must be logged in and must already have been granted access to download a copy of this file",

  toolTipIcon,
};

// Config for download buttons mapped to backend data_file_type values
const downloadButtons = [
  {
    buttonText: "Variant Call Files",
    dataFileType: "Variant Call File",
    tooltip: "Download all variant call files (VCF) for this study",
  },
  {
    buttonText: "Variant Reports",
    dataFileType: "Variant Report",
    tooltip: "Download all variant reports (pdf) for this study",
  },
  {
    buttonText: "Radiology Images",
    dataFileType: "Radiology Imaging",
    tooltip: "Download all radiology images (DICOM) for this study",
  },
];

const missingZipTooltip =
  "No ZIP file is available for download for this study.";

const AvailableDownloads = ({ classes, zipFileData = [] }) => {
  /**
   * Find the first zip file for a given data_file_type from the studyZipFileQuery response
   */
  const getZipFileForType = (dataFileType) => {
    const entry = zipFileData.find(
      (item) => item.data_file_type === dataFileType,
    );
    if (!entry || !entry.zip_files || entry.zip_files.length === 0) return null;
    return entry.zip_files[0];
  };

  return (
    <Grid item xs={12} className={classes.detailContainerItem}>
      <Grid item container direction="row">
        <Grid item xs={12} className={classes.title}>
          AVAILABLE DOWNLOADS
        </Grid>
        <Grid item xs={12} className={classes.content}>
          Subject to the appropriate access controls, copies of each file type
          pertaining to a study that are currently represented within the
          application can be downloaded in the form of a .zip file by selecting
          the download option(s) below.
          {downloadButtons.map((btn) => {
            const zipFile = getZipFileForType(btn.dataFileType);
            const hasZip = Boolean(zipFile);

            return (
              <ZipDownloadView
                key={btn.dataFileType}
                disabled={!hasZip}
                fileFormat={hasZip ? zipFile.data_file_format : undefined}
                fileName={hasZip ? zipFile.data_file_name : undefined}
                fileLocation={hasZip ? zipFile.data_file_uuid : undefined}
                toolTipTextFileDownload={
                  hasZip ? btn.tooltip : missingZipTooltip
                }
                iconFileDownload={documentDownloadProps.iconFileDownload}
                iconUnauthenticated={documentDownloadProps.iconUnauthenticated}
                toolTipTextUnauthenticated={
                  documentDownloadProps.toolTipTextUnauthenticated
                }
                toolTipIcon={documentDownloadProps.toolTipIcon}
                buttonText={btn.buttonText}
              />
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

const styles = (theme) => ({
  detailContainerItem: {
    paddingTop: "30px !important",
  },
  title: {
    color: "#066D93",
    fontFamily: theme.custom.fontFamilyInter,
    fontSize: "18px",
    letterSpacing: "0.017em",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  content: {
    fontSize: "16px",
    fontFamily: theme.custom.fontFamilyNunito,
    marginTop: "8px",
    fontWeight: 400,
    color: "#000",
  },
});

export default withStyles(styles, { withTheme: true })(AvailableDownloads);
