/**
*
*/
import React from 'react';
import { withStyles, Tooltip } from '@material-ui/core';
import { FiberManualRecordRounded } from '@material-ui/icons';
import Styles from './CellStyle';
import CustomThemeProvider from './CustomTheme';
import { customizeColumn, customizeLandScapeView} from '../Types';

// Utility function to determine study disposition
export function studyDisposition(value) {
  const embargo = 'under embargo';
  const pending = 'pending';
  if (value.toString().toLowerCase() === embargo) {
    return 'embargo';
  }
  if (value.toString().toLowerCase() === pending) {
    return 'pending';
  }
  return undefined;
}

const REPO_LINKS = {
  IDC: 'https://portal.imaging.datacommons.cancer.gov/',
  TCIA: 'https://nbia.cancerimagingarchive.net/',
};

const generateCRDCLinks = (reposArray, classes) => {
  if (!Array.isArray(reposArray)) {
    console.warn('generateCRDCLinks: reposArray is not an array', reposArray);
    return <div>No repositories available</div>;
  }

  return (
    <ul className={classes.crdcLinks}>
      {reposArray.map((repo) => (
        <li key={repo} className={classes.crdcLinksLi}>
          <a
            className={classes.crdcLinkStyle}
            target="_blank"
            rel="noreferrer"
            href={REPO_LINKS[repo] || '#'}
          >
            {repo}
          </a>
          <img
            style={{
              width: '15px',
              marginLeft: '5px',
            }}
            src="https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExternalLinkIcon.svg"
            alt="External link icon"
          />
        </li>
      ))}
    </ul>
  );
};

// Main component
const DataAvailabilityCellView = (props) => {
  const {
    classes,
    dataField,
    participant_file_count = 0,
    study_file_count = 0,
    numberOfPublications = 0,
    image_collection_count = 0,
  } = props;
  
  const value = props[dataField];

  // Generate tooltip title based on the data field
  const generateIndicatorTooltipTitle = () => {
    switch (dataField) {
      case customizeLandScapeView.PARTICIPANT_FILES:
        return `${participant_file_count} Participant File(s)`;
      case customizeLandScapeView.STUDY_FILES:
        return `${study_file_count} Study File(s)`;
      case customizeLandScapeView.IMAGE_COLLECTION_COUNT:
        return `${image_collection_count} Image Collection(s)`;
      case customizeLandScapeView.PUBLICATIONS:
        return `${numberOfPublications} Publication(s)`;
      case customizeLandScapeView.ADDITIONAL_CRDC_NODES:
        return generateCRDCLinks(value, classes);
      default:
        return '';
    }
  };

// Determine if the indicator should be displayed
  const shouldDisplayIndicator = Array.isArray(value)
    ? value.length > 0
    : value > 0;

  const title = generateIndicatorTooltipTitle();

  return (
    <CustomThemeProvider>
      {shouldDisplayIndicator && (
        <div className={classes.dataAvailIndicator}>
          <Tooltip
            classes={{
              tooltip: classes.defaultDalTooltip,
            }}
            title={title}
            interactive={dataField === customizeColumn.ADDITIONAL_CRDC_NODES}
            placement="right"
          >
            <FiberManualRecordRounded className={classes.dataAvailIndicatorIcon} />
          </Tooltip>
        </div>
      )}
    </CustomThemeProvider>
  );
};

export default withStyles(Styles)(DataAvailabilityCellView);
