import React from 'react';
import { cellTypes, headerTypes } from '@bento-core/table';
import CustomHeaderRemover from './CustomHeaderRemover';

export const CustomCellView = () => (<></>);

export const CustomHeaderCellView = (props) => {
  const {
    dataField,
    openDialogBox,
    cellType,
  } = props;
  switch (dataField || cellType) {
    case headerTypes.DELETE:
      return (
        <CustomHeaderRemover openDialogBox={openDialogBox} />
      );
    default:
      return (<></>);
  }
};

/**
* set column configuration
* @param {*} columns
* @returns config columns
*/
export const configColumn = ({
  columns,
  deleteAllFiles,
  deleteCartFile,
  removeCheck
}) => {
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
    if (column.cellType === cellTypes.DELETE) {
      return {
        ...column,
        cellEventHandler: deleteCartFile,
        customColHeaderRender: (toggleDisplay) => (
          <CustomHeaderCellView openDialogBox={toggleDisplay} {...column} />
        ),
        customModalMessage: (count) => (
          <>
            {count} {' '} File(s) will be removed from your cart
          </>
        ),
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

    /*
    * props deleteAllFiles
    */
    if (column.headerType === headerTypes.DELETE) {
      return {
        ...column,
        headerEventHandler: ()=>{ removeCheck(); deleteAllFiles() },
      };
    }
    return column;
  });
  return displayCustomHeader;
};
