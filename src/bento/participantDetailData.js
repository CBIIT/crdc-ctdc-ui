import participantIcon from '../assets/participant/participant_id_icon.png';

// --------------- Page Header Icon --------------
export const headerIcon = participantIcon;

// --------------- Cart button tooltip text --------------
export const BIOSPECIMEN_BUTTON_TOOLTIP =
  'Add files associated with selected biospecimen(s) to cart';
export const FILES_BUTTON_TOOLTIP = 'Add selected file(s) to cart';

// --------------- Associated Biospecimens table column definitions --------------
// Column format: MUI DataTable column objects
export const biospecimenColumns = [
  { cellType: 'CHECKBOX', role: 'CHECKBOX', display: true },
  { dataField: 'participant_id', header: 'Participant ID', display: true, role: 'DISPLAY' },
  { dataField: 'age_at_enrollment', header: 'Age', display: true, role: 'DISPLAY' },
  { dataField: 'sex', header: 'Sex', display: true, role: 'DISPLAY' },
  { dataField: 'race', header: 'Race', display: true, role: 'DISPLAY' },
  { dataField: 'surgical_procedure', header: 'Surgical Procedures', display: true, role: 'DISPLAY' },
  { dataField: 'specimen_type', header: 'Specimen Type', display: true, role: 'DISPLAY' },
  { dataField: 'ctep_disease_term', header: 'Diagnosis', display: true, role: 'DISPLAY' },
  { dataField: 'stage_of_disease', header: 'Disease Stage', display: true, role: 'DISPLAY' },
  { dataField: 'tumor_grade', header: 'Tumor Grade', display: true, role: 'DISPLAY' },
  { dataField: 'targeted_therapy', header: 'Targeted Therapy', display: true, role: 'DISPLAY' },
];

// --------------- Associated Files table column definitions --------------
export const filesColumns = [
  { cellType: 'CHECKBOX', role: 'CHECKBOX', display: true },
  { dataField: 'participant_id', header: 'Participant ID', display: true, role: 'DISPLAY' },
  { dataField: 'data_file_name', header: 'File Name', display: true, role: 'DISPLAY' },
  { dataField: 'data_file_type', header: 'File Type', display: true, role: 'DISPLAY' },
  { dataField: 'data_file_format', header: 'File Format', display: true, role: 'DISPLAY' },
  { dataField: 'data_file_size', header: 'File Size', display: true, role: 'DISPLAY' },
  { dataField: 'data_file_description', header: 'File Description', display: true, role: 'DISPLAY' },
];
