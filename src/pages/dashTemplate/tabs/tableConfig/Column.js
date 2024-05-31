import React from 'react';
import { Typography } from '@material-ui/core';
import { cellTypes, headerTypes } from '@bento-core/table';
import DocumentDownloadView from '../../../../components/DocumentDownload/DocumentDownloadView';
import { removeSquareBracketsFromString } from '../../../../utils/utils';

export const CustomCellView = (props) => {
  const {
    downloadDocument, documentDownloadProps,
    displayEmpty, dataField, removeSquareBrackets
  } = props;
  if (downloadDocument) {
    return (
      <DocumentDownloadView
        // fileSize={props.file_size}
        fileSize={props[documentDownloadProps.fileSizeColumn]}

        caseId={props[documentDownloadProps.caseIdColumn]}
        fileFormat={props[documentDownloadProps.fileFormatColumn]}
        fileLocation={props[documentDownloadProps.fileLocationColumn]}
        {...documentDownloadProps}
        {...props}
        requiredACLs={props[dataField]}
        fileName={props[documentDownloadProps.fileName]}
      />
    );
  }else if (removeSquareBrackets) { 
    return (
      // If removeSquareBrackets flag is true, remove square brackets
      <Typography>
        {displayEmpty || props[dataField] ? removeSquareBracketsFromString(props[dataField]) : ""}
      </Typography>
    );
  } else if (typeof displayEmpty === "boolean") {
    return (<Typography>{displayEmpty || props[dataField] ? props[dataField] : ""}</Typography>);
  }

  // other custom elem
  return (<></>);
};

export const CustomHeaderCellView = (props) => {
 
  if (props.dataField === "reported_gender") {
    return (
      <>
      <span style={{fontSize: '14px',width: '130px',textAlign: 'center'}}>
       Gender <p style={{fontSize: '10px', lineHeight: '0px', margin: 0, textAlign: 'center',fontWeight: '700'}}>(if different than sex)</p>
      </span>
      </>
    )
  }
  else if (props.dataField === "stage_of_disease") {
    return (
      <>
      <span style={{fontSize: '14px',width: '130px',textAlign: 'center'}}>
      Disease Stage
      </span>
      </>
    )
  }
  else if (props.dataField === "subject_id") {
    return (
      <>
      <span style={{fontSize: '14px',width: '170px',textAlign: 'left'}}>
      Participant ID
      </span>
      </>
    )
  }
  else if (props.dataField === "carcinogen_exposure") {
    return (
      <>
      <span style={{fontSize: '14px',width: '200px',textAlign: 'center'}}>
      Carcinogen Exposure
      </span>
      </>
    )
  
  }
  else if (props.dataField === "targeted_therapy") {
    return (
      <>
      <span style={{fontSize: '14px',width: '170px',textAlign: 'left'}}>
      Targeted Therapy
      </span>
      </>
    )
  
  }
  else if (props.dataField === "tumor_grade") {
    return (
      <>
      <span style={{fontSize: '14px',width: '100px',textAlign: 'center'}}>
      Tumor Grade
      </span>
      </>
    )
  }
  else if (props.dataField === "specimen_id") {
    return (
      <>
      <span style={{fontSize: '14px',width: '150px',textAlign: 'left'}}>
      Biospecimen ID
      </span>
      </>
    )
  }
  else if (props.dataField === "parent_specimen_id") {
    return (
      <>
      <span style={{fontSize: '14px',width: '200px',textAlign: 'left'}}>
      Parent Biospecimen ID
      </span>
      </>
    )
  }
  else if (props.dataField === "anatomical_collection_site") {
    return (
      <>
      <span style={{fontSize: '14px',width: '225px',textAlign: 'left'}}>
      Anatomical Collection Site
      </span>
      </>
    )
  }
  
  else if (props.dataField === "tissue_category") {
    return (
      <>
      <span style={{fontSize: '14px',width: '150px',textAlign: 'left'}}>
      Tissue Category
      </span>
      </>
    )
  }
  else if (props.dataField === "assessment_timepoint") {
    return (
      <>
      <span style={{fontSize: '14px',width: '200px',textAlign: 'left'}}>
      Collection Timepoint
      </span>
      </>
    )
  }
  else if (props.dataField === "data_file_type") {
    return (
      <>
      <span style={{fontSize: '14px',width: '150px',textAlign: 'left'}}>
      File Type
      </span>
      </>
    )
  }
  else if (props.dataField === "data_file_name") {
    return (
      <>
      <span style={{fontSize: '14px',width: '150px',textAlign: 'left'}}>
      File Name
      </span>
      </>
    )
  }
  else if (props.dataField === "primary_disease_site") {
    return (
      <>
      <span style={{fontSize: '14px',width: '150px',textAlign: 'left'}}>
      Primary Site
      </span>
      </>
    )
  }
    return <> {props.header}</>
}


/**
* set column configuration
* @param {*} columns
* @returns config columns
*/
export const configColumn = (columns) => {
  /**
  * display columns as configuration
  * set custom cell render for column
  */
  const displayColumns = columns.filter((col) => col.display);
  const displayCustomView = [...displayColumns].map((column) => {
    if (column.cellType === cellTypes.CUSTOM_ELEM) {
      return {
        ...column,
        customCellRender: (props) => <CustomCellView {...props} />,
      };
    }
    return column;
  });

  /**
  * custom header view configuration
  */
  const displayCustomHeader = [...displayCustomView].map((column) => {
    if (column.headerType === headerTypes.CUSTOM_ELEM) {
      return {
        ...column,
        customColHeaderRender: (props) => <CustomHeaderCellView {...props} />,
      };
    }
    return column;
  });
  return displayCustomHeader;
};
