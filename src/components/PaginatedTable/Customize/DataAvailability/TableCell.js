/**
*
*/
import React from 'react';
import { withStyles, Tooltip } from '@material-ui/core';
import { FiberManualRecordRounded } from '@material-ui/icons';
import Styles from './CellStyle';
import CustomThemeProvider from './CustomTheme';
import { customizeColumn, customizeHeader } from '../Types';

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
function getFormattedCollectionId(collection_id) {
  if(collection_id)
    return collection_id.toUpperCase().replace(/_/g, '-');
  return collection_id
}

const DataAvailabilityCellView = (props) => {
  const {
    classes,
    column,
    interOpData,
    study_id,
    dataField,

    participant_file_count = 0,
    study_file_count = 0,
    numberOfPublications = 0,
  } = props;
  const generateCRDCLinks = (linksArray, clinicalStudyDesignation) => (
    <ul className={classes.crdcLinks}>
      {linksArray
        .filter((link) => link.image_collection_name && link.image_collection_url) // Exclude null values
        .map((link) => (
          <li key={link.image_collection_name} className={classes.crdcLinksLi}>
            {link.image_collection_url.toLowerCase() !== 'api failed' ? (
              <>
                <a
                  className={classes.crdcLinkStyle}
                  target="_blank"
                  rel="noreferrer"
                  href={link.image_collection_url}
                >
                  {
                    link?.metadata?.collection_id
                      ? `${link?.image_collection_name } | ${getFormattedCollectionId(link?.metadata?.collection_id)}`
                      : `${link?.repository_name || ""} | ${link?.image_collection_name}`
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
                {`${link?.metadata?.collection_id || link.image_collection_name} | ${link.image_collection_url}`}
              </div>
            )}
          </li>
        ))}
    </ul>
  );
  const studyData = interOpData?.getAllStudies;
  const generateIndicatorTooltipTitle = () => {
    switch (dataField) {
      case 'participant_file_count':
        return `${participant_file_count} Participant File(s)`;
      case 'study_file_count':
        return `${study_file_count} Study File(s)`;
      case 'image_collection_count':
        return `${studyData?.length && studyData[0]?.image_collection_count} Image Collection(s)`;
      case 'numberOfPublications':
        return `${numberOfPublications} Publication(s)`;
      default: {
        return studyData.length && generateCRDCLinks(studyData[0]?.image_collection);
      }
    }
  };

  const value = props[dataField];
  
  const currentStudyData = interOpData?.getAllStudies
    .filter((study) => study.study_id === study_id); 
  // const currentStudyData = image_collection;
  let flag;
  if (dataField === customizeHeader.ADDITIONAL_CRDC_NODES && currentStudyData?.[0]?.image_collection.length) {
    flag = true;
  } else {
    flag = Array.isArray(value) ? value.length > 0 : value > 0;
  }
  const title = generateIndicatorTooltipTitle(column, value);
  return (
    <CustomThemeProvider>
      {
      flag && (
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
      )
    }
    </CustomThemeProvider>
  );
};

export default withStyles(Styles)(DataAvailabilityCellView);
