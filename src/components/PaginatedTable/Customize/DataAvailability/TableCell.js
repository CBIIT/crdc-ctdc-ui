/**
*
*/
import React from 'react';
import { withStyles, Tooltip } from '@material-ui/core';
import { FiberManualRecordRounded } from '@material-ui/icons';
import Styles from './CellStyle';
import CustomThemeProvider from './CustomTheme';
import { customizeColumn } from '../Types';

// Utility function to format collection IDs
function getFormattedCollectionId(collection_id) {
  return collection_id
    ? collection_id.toUpperCase().replace(/_/g, '-')
    : collection_id;
}

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

const generateCRDCLinks = (linksArray, classes) => {
  if (!Array.isArray(linksArray)) {
    console.warn('generateCRDCLinks: linksArray is not an array', linksArray);
    return <div>No links available</div>;
  }
  
  return (
    <ul className={classes.crdcLinks}>
      {linksArray
        .filter((link) => link.associated_link_name && link.associated_link_url) // Exclude null values
        .map((link) => (
          <li key={link.associated_link_name} className={classes.crdcLinksLi}>
            {link.associated_link_url.toLowerCase() !== 'api failed' ? (
              <>
                <a
                  className={classes.crdcLinkStyle}
                  target="_blank"
                  rel="noreferrer"
                  href={link.associated_link_url}
                >
                  {
                    link?.metadataIDC?.collection_id ?  `${link?.associated_link_name} | ${getFormattedCollectionId(link?.metadataIDC?.collection_id)}` : `${link?.associated_link_name} | ${getFormattedCollectionId(link?.metadataTCIA?.collection)}`
                  }
                </a>
                <img
                  style={{
                    width: '15px',
                    marginLeft: '5px',
                  }}
                  src="https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExternalLinkIcon.svg"
                  alt="External link icon"
                />
              </>
            ) : (
              <div className={classes.crdcApiFailed}>
                {`${link?.metadata?.collection_id || link.image_collection_name} | ${link.associated_link_url}`}
              </div>
            )}
          </li>
        ))}
    </ul>
  )
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
    image_collection,
  } = props;
  
  const value = props[dataField];

  // Generate tooltip title based on the data field
  const generateIndicatorTooltipTitle = () => {
    switch (dataField) {
      case 'participant_file_count':
        return `${participant_file_count} Participant File(s)`;
      case 'study_file_count':
        return `${study_file_count} Study File(s)`;
      case 'image_collection_count':
        return `${image_collection_count} Image Collection(s)`;
      case 'numberOfPublications':
        return `${numberOfPublications} Publication(s)`;
      case 'image_collection':
        return image_collection.length > 0 && generateCRDCLinks(image_collection, classes);
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
