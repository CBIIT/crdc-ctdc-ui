import React from 'react';
import { Button, Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import {
  btnTypes,
  types,
} from '@bento-core/paginated-table';
import {
  GET_FILE_IDS_FOR_SELECTED_FILES,
} from '../../bento/dashboardTabData';
import {
  alertMessage,
} from '../../bento/fileCentricCartWorkflowData';
import {
  FILES_BUTTON_TOOLTIP,
  showJBrowseButton,
} from '../../bento/participantDetailData';
import jbrowseIcon from '../../assets/participant/jbrowse_icon.png';
import AddBiospecimenFilesButton from './components/AddBiospecimenFilesButton';

// --------------- JBrowse custom element ---------------
const JBrowseButton = () => (
  <>
    <span>
      <Button
        className="jbrowse_button"
        disabled
        disableElevation
      >
        View in&nbsp;
        <img src={jbrowseIcon} alt="JBrowse" className="jbrowse_icon" />
        JBrowse
      </Button>
    </span>
    <Tooltip title="View in JBrowse (coming soon)" placement="top-end">
      <button
        aria-label="Help: View in JBrowse (coming soon)"
        className="tooltip_icon_button"
        type="button"
      >
        <HelpIcon style={{ fontSize: '18px', color: '#000' }} aria-hidden="true" />
      </button>
    </Tooltip>
  </>
);

// --------------- Tooltip configs ---------------
const HELP_ICON_URL = 'https://raw.githubusercontent.com/google/material-design-icons/master/src/action/help/materialicons/24px.svg';

const filesTooltip = {
  icon: HELP_ICON_URL,
  alt: 'tooltipIcon',
  arrow: false,
  tooltipText: FILES_BUTTON_TOOLTIP,
};

// --------------- Biospecimens table wrapper config ---------------
export const getBiospecimenWrapperConfig = (files = []) => {
  const specimenIdsWithFiles = new Set(
    files.map((f) => f.specimen_record_id).filter(Boolean),
  );

  const biospecimenItems = [
    {
      type: types.CUSTOM_ELEM,
      customViewElem: () => (
        <AddBiospecimenFilesButton specimenIdsWithFiles={specimenIdsWithFiles} />
      ),
    },
  ];

  if (showJBrowseButton) {
    biospecimenItems.push({
      type: types.CUSTOM_ELEM,
      customViewElem: JBrowseButton,
    });
  }

  return [
    {
      container: 'paginatedTable',
      paginatedTable: true,
    },
    {
      container: 'buttons',
      size: 'xl',
      clsName: 'container_footer',
      items: biospecimenItems,
    },
  ];
};

// --------------- Files table wrapper config ---------------
const filesItems = [
  {
    title: 'ADD SELECTED FILES',
    clsName: 'add_selected_button',
    type: types.BUTTON,
    role: btnTypes.ADD_SELECTED_FILES,
    btnType: btnTypes.ADD_SELECTED_FILES,
    tooltipCofig: filesTooltip,
    addFileQuery: GET_FILE_IDS_FOR_SELECTED_FILES,
    dataKey: 'data_file_uuid',
    responseKeys: ['fileOverview', 'data_file_uuid'],
    alertMessage,
  },
];

if (showJBrowseButton) {
  filesItems.push({
    type: types.CUSTOM_ELEM,
    customViewElem: JBrowseButton,
  });
}

export const filesWrapperConfig = [
  {
    container: 'paginatedTable',
    paginatedTable: true,
  },
  {
    container: 'buttons',
    size: 'xl',
    clsName: 'container_footer',
    items: filesItems,
  },
];
