import participantIcon from '../assets/participant/participant_id_icon.png';

// --------------- Page Header Icon --------------
export const headerIcon = participantIcon;

// --------------- Cart button tooltip text --------------
export const BIOSPECIMEN_BUTTON_TOOLTIP =
  'Add files associated with selected biospecimen(s) to cart';
export const FILES_BUTTON_TOOLTIP = 'Add selected file(s) to cart';

// --------------- JBrowse feature flag (set to true when JBrowse is implemented) --------------
export const showJBrowseButton = false;

// --------------- Associated Biospecimens table column definitions --------------
// Column format: MUI DataTable column objects
export const biospecimenColumns = [
  { cellType: 'CHECKBOX', role: 'CHECKBOX', display: true },
  { dataField: 'specimen_record_id', header: 'Specimen ID', display: true, role: 'DISPLAY' },
  { dataField: 'specimen_type', header: 'Specimen Type', display: true, role: 'DISPLAY' },
  { dataField: 'specimen_category', header: 'Specimen Category', display: true, role: 'DISPLAY' },
  { dataField: 'anatomical_collection_site', header: 'Collection Site', display: true, role: 'DISPLAY' },
  { dataField: 'assessment_timepoint', header: 'Assessment Timepoint', display: true, role: 'DISPLAY' },
];

// --------------- Associated Files table column definitions --------------
export const filesColumns = [
  { cellType: 'CHECKBOX', role: 'CHECKBOX', display: true },
  { dataField: 'data_file_name', header: 'File Name', display: true, role: 'DISPLAY' },
  { dataField: 'data_file_type', header: 'File Type', display: true, role: 'DISPLAY' },
  { dataField: 'data_file_format', header: 'File Format', display: true, role: 'DISPLAY' },
  { dataField: 'data_file_size', header: 'File Size', display: true, role: 'DISPLAY' },
  { dataField: 'data_file_description', header: 'File Description', display: true, role: 'DISPLAY' },
];
