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

  // Case 2: Not logged in or access not granted; Icon is the same but tooltip text is different
  iconUnauthenticated: downloadSuccess,
  toolTipTextUnauthenticated:
    "You must be logged in and must already have been granted access to download a copy of this file",

  toolTipIcon,
};

const missingZipTooltip =
  "No ZIP file is available for download for this study.";

const AvailableDownloads = ({
  classes,
  zipFileData = [],
  participantFileTypes = [],
}) => {
  /**
   * Pluralize a file type string for use in tooltips and button text.
   * Handles common English pluralization rules and special cases.
   *
   * @param {string} fileType - The data_file_type value
   * @returns {string} - Pluralized version
   */
  const pluralizeFileType = (fileType) => {
    // Get the last word to apply pluralization rules
    const words = fileType.trim().split(/\s+/);
    const lastWord = words[words.length - 1];
    const lowerLastWord = lastWord.toLowerCase();
    const prefix = words.slice(0, -1).join(" ");

    // Check if already plural (simple heuristic)
    // Exclude words ending in 'sis', 'us', 'ss' which are often singular
    if (
      (lowerLastWord.endsWith("s") &&
        !lowerLastWord.endsWith("sis") &&
        !lowerLastWord.endsWith("us") &&
        !lowerLastWord.endsWith("ss")) ||
      lowerLastWord.endsWith("ies")
    ) {
      return fileType; // Return as-is
    }

    let pluralizedLastWord;

    // Rule 0: Words ending in "ing" where plural is based on root noun
    // e.g., "Imaging" → "Images" (not "Imagings")
    // Preserve case: "IMAGING" → "IMAGES", "imaging" → "images", "Imaging" → "Images"
    if (lowerLastWord === "imaging") {
      // Check if original is all uppercase
      if (lastWord === lastWord.toUpperCase()) {
        pluralizedLastWord = "IMAGES";
      } else if (lastWord === lastWord.toLowerCase()) {
        pluralizedLastWord = "images";
      } else {
        // Title case or mixed case
        pluralizedLastWord = "Images";
      }
    }
    // Rule 1: Words ending in consonant + "y" → "ies"
    // e.g., "Summary" → "Summaries", "Category" → "Categories"
    else if (
      lastWord.length >= 2 &&
      lowerLastWord.endsWith("y") &&
      !/[aeiou]y$/i.test(lowerLastWord)
    ) {
      pluralizedLastWord = lastWord.slice(0, -1) + "ies";
    }
    // Rule 2: Words ending in "s", "ss", "x", "z", "ch", "sh" → add "es"
    // e.g., "Analysis" → "Analyses", "Box" → "Boxes"
    else if (/(?:s|ss|x|z|ch|sh)$/i.test(lowerLastWord)) {
      pluralizedLastWord = lastWord + "es";
    }
    // Rule 3: Words ending in "f" or "fe" → "ves"
    // e.g., "Life" → "Lives", "Knife" → "Knives"
    else if (/f$/i.test(lowerLastWord)) {
      pluralizedLastWord = lastWord.slice(0, -1) + "ves";
    } else if (/fe$/i.test(lowerLastWord)) {
      pluralizedLastWord = lastWord.slice(0, -2) + "ves";
    }
    // Rule 4: Words ending in consonant + "o" → add "es"
    // e.g., "Tomato" → "Tomatoes", "Hero" → "Heroes"
    // BUT: "Photo" → "Photos", "Piano" → "Pianos" (exceptions)
    else if (
      lastWord.length >= 2 &&
      lowerLastWord.endsWith("o") &&
      !/[aeiou]o$/i.test(lowerLastWord) &&
      !/(photo|piano|halo|logo)$/i.test(lowerLastWord)
    ) {
      pluralizedLastWord = lastWord + "es";
    }
    // Rule 5: Default - add "s"
    // e.g., "File" → "Files", "Report" → "Reports"
    else {
      pluralizedLastWord = lastWord + "s";
    }

    return prefix ? `${prefix} ${pluralizedLastWord}` : pluralizedLastWord;
  };

  /**
   * Check if a file type should have a download button:
   * 1. The study must have this file type (in participantFileTypes)
   * 2. A megazip file must exist for this type in zipFileData with valid data
   */
  const hasValidDownloadForType = (dataFileType) => {
    // Check 1: Study must have this file type
    const studyHasFileType = participantFileTypes.includes(dataFileType);
    if (!studyHasFileType) return false;

    // Check 2: Megazip must exist with valid required fields
    // getZipFileForType already validates required fields
    const zipFile = getZipFileForType(dataFileType);
    return zipFile !== null;
  };

  /**
   * Find the first zip file for a given data_file_type from the studyZipFileQuery response
   * Validates that required fields exist before returning
   */
  const getZipFileForType = (dataFileType) => {
    const entry = zipFileData.find(
      (item) => item.data_file_type === dataFileType,
    );
    if (!entry || !entry.zip_files || entry.zip_files.length === 0) return null;

    const zipFile = entry.zip_files[0];

    // Validate required field exists and is not null/undefined
    if (!zipFile.data_file_uuid) {
      return null;
    }

    return zipFile;
  };

  // Generate buttons dynamically for all valid file types
  const allButtons = participantFileTypes
    .filter((fileType) => hasValidDownloadForType(fileType))
    .map((fileType) => {
      const zipFile = getZipFileForType(fileType);
      const pluralizedType = pluralizeFileType(fileType);
      const fileFormat = zipFile?.data_file_format
        ? `(${zipFile.data_file_format.toUpperCase()})`
        : "";

      return {
        buttonText: pluralizedType,
        dataFileType: fileType,
        tooltip:
          `Download all ${pluralizedType} ${fileFormat} for this study`.trim(),
      };
    })
    .sort((a, b) => a.dataFileType.localeCompare(b.dataFileType));

  // Hide entire section if no valid downloads
  if (allButtons.length === 0) {
    return null;
  }

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
          {allButtons.map((btn) => {
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
