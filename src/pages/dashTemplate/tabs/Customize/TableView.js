import React from 'react';
import {
  btnTypes,
} from '@bento-core/all';
// import ViewJBrowseButton from '../../../pages/JbrowseDetail/components/JBrowseViewBtn';

export const DisplayCustomText = ({
  tab,
  totalRowCount = 0,
}) => {
  console.log("||| DisplayCustomText: ")
  const {
    id,
  } = tab;
  let text = '';
  switch (id) {
    case 'participants_tab':
      text = `Add all filtered Files for the ${totalRowCount} selected Participants to My Files?`;
      break;
    case 'biospecimens_tab':
      text = `Add all filtered Files for the ${totalRowCount} selected Biospecimens to My Files?`;
      break;
    case 'file_tab':
      text = `Add all ${totalRowCount} to My Files?`;
      break;
    case 'study_file_tab':
      text = `Add all ${totalRowCount} files to My Files?`;
      break;
    default:
      break;
  }
  return (
    <>
      {text}
    </>
  );
};

/**
* Return title that will be displayed in wrapper buttons
*/
const getButtonTitle = (tab, item) => {
  if (item.role === btnTypes.ADD_ALL_FILES) {
    return tab.selectAllButtonText;
  } if (item.role === btnTypes.ADD_SELECTED_FILES && tab.selectedButtonText) {
    return tab.selectedButtonText;
  }

  return item.title;
};

/**
* 1. addFileQuery - query to addAll files or add selected files on cart
* 2. responseKeys - provided respose key for addFileQuery
* 3. Configure Jbrowse
*/
export const updateWrapperConfig = (tab, configs, context, totalRowCount) => {
  // set reponse key to access file ids to add to my cart for add selected and add all files button
  const wrpConfig = configs.map((container) => ({
    ...container,
    items: (!container.paginatedTable) ? container.items.map((item) => {
      if (item.role === btnTypes.ADD_ALL_FILES
        || item.role === btnTypes.ADD_SELECTED_FILES) {
        return {
          ...item,
          title: getButtonTitle(tab, item),
          addFileQuery: (item.role === btnTypes.ADD_ALL_FILES)
            ? tab.addAllFileQuery : tab.addSelectedFilesQuery,
          dataKey: tab.addFilesRequestVariableKey,
          responseKeys: (item.role === btnTypes.ADD_ALL_FILES)
            ? tab.addAllFilesResponseKeys : tab.addFilesResponseKeys,
          DisplayCustomText: (props) => DisplayCustomText({ tab, ...props, totalRowCount }),
        };
      }
      // configure jbrowse button from Case Files tab
      // set selected files using table context
      // if (item.Jbrowse) {
      //   const selectedRows = context.selectedRows || [];
      //   return {
      //     ...item,
      //     customViewElem: () => (
      //       <ViewJBrowseButton
      //         selectedFileNames={selectedRows}
      //       />
      //     ),
      //   };
      // }
      return item;
    }) : [],
  }));
  return wrpConfig;
};
