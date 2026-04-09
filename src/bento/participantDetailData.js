import gql from 'graphql-tag';
import participantIcon from '../assets/participant/Frame 1.png';

// --------------- Page Header Icon --------------
export const headerIcon = participantIcon;

// --------------- Tooltip icons used on cart buttons --------------
export const tooltipIcon = {
  src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/icdc/images/svgs/Tooltip.SpeechBubble.svg',
  alt: 'tooltip',
};

// --------------- Cart button tooltip text --------------
export const BIOSPECIMEN_BUTTON_TOOLTIP =
  'Add files associated with selected biospecimen(s) to cart';
export const FILES_BUTTON_TOOLTIP = 'Add selected file(s) to cart';

// --------------- GraphQL stub query - participant header & info panel --------------
// TODO: Sync with backend once participantDetail query is implemented
export const GET_PARTICIPANT_DETAIL_DATA_QUERY = gql`
  query participantDetail($participant_id: String) {
    participantDetail(participant_id: $participant_id) {
      participant_id
      study_short_name
      study_id
      program_acronym
      age_at_enrollment
      race
      ethnicity
      sex
      primary_diagnosis_disease_group
      primary_disease_site
      stage_of_disease
      targeted_therapy
      best_response_to_targeted_therapy
    }
  }
`;

// --------------- GraphQL stub query - associated biospecimens --------------
// TODO: Replace with a participant-scoped biospecimen query once backend exposes it.
// When live, filter by participant_id: [$participant_id]
export const GET_PARTICIPANT_BIOSPECIMENS_QUERY = gql`
  query participantBiospecimens($participant_id: [String], $first: Int, $offset: Int, $order_by: String, $sort_direction: String) {
    biospecimenOverview(
      participant_id: $participant_id
      first: $first
      offset: $offset
      order_by: $order_by
      sort_direction: $sort_direction
    ) {
      participant_id
      age_at_enrollment
      sex
      race
      surgical_procedure
      specimen_type
      diagnosis
      stage_of_disease
      tumor_grade
      targeted_therapy
      specimen_record_id
      data_file_uuid
    }
  }
`;

// --------------- GraphQL stub query - associated files --------------
// TODO: Replace with a participant-scoped file query once backend exposes it.
// When live, filter by participant_id: [$participant_id]
export const GET_PARTICIPANT_FILES_QUERY = gql`
  query participantFiles($participant_id: [String], $first: Int, $offset: Int, $order_by: String, $sort_direction: String) {
    fileOverview(
      participant_id: $participant_id
      first: $first
      offset: $offset
      order_by: $order_by
      sort_direction: $sort_direction
    ) {
      participant_id
      file_name
      file_type
      file_format
      file_size
      file_description
      data_file_uuid
    }
  }
`;

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
