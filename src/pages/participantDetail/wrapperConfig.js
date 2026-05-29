import React from 'react';
import { Button, Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import {
  btnTypes,
  types,
} from '@bento-core/paginated-table';
import {
  GET_FILE_IDS_FOR_SELECTED_BIOSPECIMENS,
  GET_FILE_IDS_FOR_SELECTED_FILES,
} from '../../bento/dashboardTabData';
import {
  alertMessage,
} from '../../bento/fileCentricCartWorkflowData';
import {
  BIOSPECIMEN_BUTTON_TOOLTIP,
  FILES_BUTTON_TOOLTIP,
  showJBrowseButton,
} from '../../bento/participantDetailData';
import jbrowseIcon from '../../assets/participant/jbrowse_icon.png';

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

const biospecimenTooltip = {
  icon: HELP_ICON_URL,
  alt: 'tooltipIcon',
  arrow: false,
  tooltipText: BIOSPECIMEN_BUTTON_TOOLTIP,
};

const filesTooltip = {
  icon: HELP_ICON_URL,
  alt: 'tooltipIcon',
  arrow: false,
  tooltipText: FILES_BUTTON_TOOLTIP,
};

// --------------- Biospecimens table wrapper config ---------------
const biospecimenItems = [
  {
    title: 'ADD FILES FOR SELECTED BIOSPECIMENS',
    clsName: 'add_selected_button',
    type: types.BUTTON,
    role: btnTypes.ADD_SELECTED_FILES,
    btnType: btnTypes.ADD_SELECTED_FILES,
    tooltipCofig: biospecimenTooltip,
    addFileQuery: GET_FILE_IDS_FOR_SELECTED_BIOSPECIMENS,
    dataKey: 'specimen_record_id',
    responseKeys: ['biospecimen_data_files', 'data_file_uuid'],
    alertMessage,
  },
];

if (showJBrowseButton) {
  biospecimenItems.push({
    type: types.CUSTOM_ELEM,
    customViewElem: JBrowseButton,
  });
}

export const biospecimenWrapperConfig = [
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
