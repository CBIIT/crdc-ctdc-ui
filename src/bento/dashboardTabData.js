/* eslint-disable */
import gql from 'graphql-tag';
import { cellTypes, dataFormatTypes, headerTypes } from '@bento-core/table';
// import { customCasesTabDownloadCSV, customFilesTabDownloadCSV, customSamplesTabDownloadCSV } from './tableDownloadCSV';
import downloadSuccess from '../assets/dash/downloadSuccess.svg'
import downloadLock from '../assets/dash/downloadLock.svg'
import previewLarge from '../assets/dash/previewLarge.svg'

// --------------- Tooltip configuration --------------
export const tooltipContent = {
  //  use as aletrative
  icon: 'https://raw.githubusercontent.com/google/material-design-icons/master/src/action/help/materialicons/24px.svg',
  alt: 'tooltipIcon',
  arrow: false,
  Participants: 'Add filtered files associated with selected participants(s) to My Files',
  Biospecimens: 'Add filtered files associated with selected biospecimen(s) to My Files',
  Files: 'Add selected files to My Files',
};

  export const tooltipContentAllFile = {
  icon: 'https://raw.githubusercontent.com/google/material-design-icons/master/src/action/help/materialicons/24px.svg',
  alt: 'tooltipIcon',
  arrow: false,
  Participants: 'Add filtered files associated with all participants in the current results set to My Files',
  Biospecimens: 'Add filtered files associated with all biospecimens in the current results set to My Files',
  Files: 'Add all filtered files to My Files',
};

// --------------- Dahboard Table external link configuration --------------
// Ideal size for externalLinkIcon is 16x16 px
export const externalLinkIcon = {
  src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/externalLinkIcon.svg',
  alt: 'External link icon',
};


// --------------- Tabs Header Data configuration --------------
export const tabs = [
  {
    id: 'participants_tab',
    title: 'Participants',
    dataField: 'dataCase',
    count: 'numberOfParticipants',
  },
  {
    id: 'biospecimens_tab',
    title: 'Biospecimens',
    dataField: 'dataSample',
    count: 'numberOfSamples',
  },
  {
    id: 'file_tab',
    title: 'Files',
    dataField: 'dataFile',
    count: 'numberOfFiles',
  },
];

export const multiStudyData = {
  icon: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/icdc/images/svgs/icon-multiStudy.svg',
  alt: 'Multi-study icon',
  toolTipText: 'Multi-study participant also enrolled as:',
};
// --------------- Tabs Header Style configuration --------------
export const tabIndex = [
  {
    title: 'Cases',
    primaryColor: '#D6F2EA',
    secondaryColor: '#FFDFB8',
    selectedColor: '#10A075',
  },
  {
    title: 'Samples',
    primaryColor: '#CFEDF9',
    secondaryColor: '#C9F1F1',
    selectedColor: '#0DAFEC',
  },
  {
    title: 'Files',
    primaryColor: '#F7D7F7',
    secondaryColor: '#86D6F0',
    selectedColor: '#C92EC7',
  },
];

// First Dash Query used for Targeted Therapy
export const TARGETED_THERAPY_QUERY = gql`
query search_for_targeted_therapy (
  $participant_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String], 
  $sex: [String], 
  $race: [String], 
  $ethnicity: [String],
  $carcinogen_exposure: [String], 
  # $targeted_therapy: [String],
  $targeted_therapy_string: [String],

  $anatomical_collection_site: [String],
  $tissue_category: [String],
  $assessment_timepoint: [String],

  $data_file_type: [String],
  $data_file_format: [String]
) {
  searchParticipants(
    participant_id: $participant_id
    ctep_disease_term: $ctep_disease_term
    stage_of_disease: $stage_of_disease
    tumor_grade: $tumor_grade
    sex: $sex
    race: $race
    ethnicity: $ethnicity
    carcinogen_exposure: $carcinogen_exposure
    # targeted_therapy: $targeted_therapy
    targeted_therapy_string: $targeted_therapy_string
    
    anatomical_collection_site: $anatomical_collection_site
    tissue_category: $tissue_category
    assessment_timepoint: $assessment_timepoint

    data_file_type: $data_file_type
    data_file_format: $data_file_format
  ) {
    # Used to help create/compare valid TargetedTherapy combinations under generateValidCombinations()
    filterParticipantCountBySingleTargetedTherapyCombinationForFacet {
      group
      subjects
    }
    participantCountBySingleTargetedTherapyCombinationForFacet {
      group
      subjects
    }

    participantCountByTargetedTherapy {
      group
      subjects
    }
    filterParticipantCountByTargetedTherapy {
        group
  subjects
    }

    participantCountBySingleTargetedTherapyCombination  {
      group
      subjects
    }
    filterParticipantCountBySingleTargetedTherapyCombination  {
      group
      subjects
    }
  }
}
`;

// Main Query used to populate Facet, Widget components
export const DASHBOARD_QUERY_NEW = gql`
query search(
  $participant_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  $race: [String],
  $ethnicity: [String],
  $carcinogen_exposure: [String],
  # $targeted_therapy: [String],
  $targeted_therapy_string: [String],

  $anatomical_collection_site: [String],
  $tissue_category: [String],
  $assessment_timepoint: [String],

  $data_file_type: [String],
  $data_file_format: [String]
) {
  searchParticipants(
    participant_id: $participant_id
    ctep_disease_term: $ctep_disease_term
    stage_of_disease: $stage_of_disease
    tumor_grade: $tumor_grade
    sex: $sex
    race: $race
    ethnicity: $ethnicity
    carcinogen_exposure: $carcinogen_exposure
    # targeted_therapy: $targeted_therapy
    targeted_therapy_string: $targeted_therapy_string

    anatomical_collection_site: $anatomical_collection_site
    tissue_category: $tissue_category
    assessment_timepoint: $assessment_timepoint

    data_file_type: $data_file_type
    data_file_format: $data_file_format
  ) {
    numberOfStudies
    numberOfParticipants
    numberOfDiagnoses
    numberOfTargetedTherapies
    numberOfSpecimens
    numberOfFiles
    
    diagnosesAndStageOfDiseases {
      program
      caseSize
      children {
        arm
        caseSize
        size
        __typename
      }
      __typename
    }
    racesAndEthnicities {
      program
      caseSize
      children {
        arm
        caseSize
        size
        __typename
      }
      __typename
    }
    timepointsAndBiospecimensTypes {
      program
      caseSize
      children {
        arm
        caseSize
        size
        __typename
      }
      __typename
    }
    participantCountByStageOfDisease {
      group
      subjects
    }
    filterParticipantCountByStageOfDisease {
      group
      subjects
    }
    participantCountByCtepDiseaseTerm {
      group
      subjects
    }
    filterParticipantCountByCtepDiseaseTerm {
      group
      subjects
    }
    participantCountBySnomedDiseaseCode{
      group
      subjects
    }
    filterParticipantCountBySnomedDiseaseCode{
      group
      subjects
    }
    participantCountByTumorGrade {
      group
      subjects
    }
    filterParticipantCountByTumorGrade {
      group
      subjects
    }
    participantCountBySex {
      group
      subjects
    }
    filterParticipantCountBySex {
      group
      subjects
    }
    participantCountByRace {
      group
      subjects
    }
    filterParticipantCountByRace {
      group
      subjects
    }
    participantCountByEthnicity {
      group
      subjects
    }
    filterParticipantCountByEthnicity {
      group
      subjects
    }
    participantCountByCarcinogenExposure {
      group
      subjects
    }
    filterParticipantCountByCarcinogenExposure {
      group
      subjects
    }
    participantCountByTargetedTherapy {
      group
      subjects
    }
    filterParticipantCountByTargetedTherapy {
      group
      subjects
    }
    participantCountBySingleTargetedTherapyCombination {
      group
      subjects
    }
    participantCountBySingleTargetedTherapyCombinationForFacet {
      group
      subjects
    }
    filterParticipantCountBySingleTargetedTherapyCombinationForFacet {
      group
      subjects
    }
    filterParticipantCountBySingleTargetedTherapyCombination {
      group
      subjects
    }
    specimenCountByAnatomicalCollectionSite {
      group
      subjects
    }
    filterSpecimenCountByAnatomicalCollectionSite {
      group
      subjects
    }
    specimenCountByTissueCategory {
      group
      subjects
    }
    filterSpecimenCountByTissueCategory {
      group
      subjects
    }
    specimenCountBySpecimenType {
      group
      subjects
    }
    filterSpecimenCountBySpecimenType {
      group
      subjects
    }
    participantCountByAssessmentTimepoint {
      group
      subjects
    }
    filterParticipantCountByAssessmentTimepoint {
      group
      subjects
    }
    dataFileCountByDataFileType {
      group
      subjects
    }
    filterDataFileCountByDataFileType {
      group
      subjects
    }
    dataFileCountByDataFileFormat {
      group
      subjects
    }
    filterDataFileCountByDataFileFormat {
      group
      subjects
    }
  }
}
`;

export const GET_PARTICIPANTS_OVERVIEW_QUERY = gql`
  query participantOverview(
    $participant_id: [String],
    $ctep_disease_term: [String],
    $stage_of_disease: [String],
    $tumor_grade: [String],
    $sex: [String],
    $race: [String],
    $ethnicity: [String],
    $carcinogen_exposure: [String],
    # $targeted_therapy: [String],
    $targeted_therapy_string: [String],

    $anatomical_collection_site: [String],
    $tissue_category: [String],
    $assessment_timepoint: [String],

    $data_file_type: [String],
    $data_file_format: [String],

    $first: Int,
    $offset: Int,
    $order_by: String,
    $sort_direction: String
  ){
    participantOverview(
      participant_id: $participant_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      # targeted_therapy: $targeted_therapy
      targeted_therapy_string: $targeted_therapy_string

      anatomical_collection_site: $anatomical_collection_site
      tissue_category: $tissue_category
      assessment_timepoint: $assessment_timepoint

      data_file_type: $data_file_type
      data_file_format: $data_file_format

      first: $first
      offset: $offset
      order_by: $order_by
      sort_direction: $sort_direction
    ){
      participant_id,
      ctep_disease_term,
      stage_of_disease,
      tumor_grade,
      age_at_enrollment,
      sex,
      race,
      ethnicity,
      carcinogen_exposure,
      # targeted_therapy
      targeted_therapy_string

      data_file_uuid
    }
  }
`;

export const GET_BIOSPECIMENS_OVERVIEW_QUERY = gql`
  query biospecimenOverview(
    $participant_id: [String],
    $ctep_disease_term: [String],
    $stage_of_disease: [String],
    $tumor_grade: [String],
    $sex: [String],
    $race: [String],
    $ethnicity: [String],
    $carcinogen_exposure: [String],
    # $targeted_therapy: [String],
    $targeted_therapy_string: [String],

    $anatomical_collection_site: [String],
    $tissue_category: [String],
    $assessment_timepoint: [String],

    $data_file_type: [String],
    $data_file_format: [String],

    $first: Int,
    $offset: Int,
    $order_by: String,
    $sort_direction: String
  ){
    biospecimenOverview(
      participant_id: $participant_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      # targeted_therapy: $targeted_therapy
      targeted_therapy_string: $targeted_therapy_string

      anatomical_collection_site: $anatomical_collection_site
      tissue_category: $tissue_category
      assessment_timepoint: $assessment_timepoint

      data_file_type: $data_file_type
      data_file_format: $data_file_format

      first: $first
      offset: $offset
      order_by: $order_by
      sort_direction: $sort_direction
    ){
      participant_id,
      ctep_disease_term,
      stage_of_disease
      primary_disease_site,
      specimen_id,
      specimen_record_id,
      anatomical_collection_site,
      tissue_category,
      assessment_timepoint

      data_file_uuid
    }
  }
`;

export const GET_FILES_OVERVIEW_QUERY = gql`
  query fileOverview(
    $participant_id: [String],
    $ctep_disease_term: [String],
    $stage_of_disease: [String],
    $tumor_grade: [String],
    $sex: [String],
    $race: [String],
    $ethnicity: [String],
    $carcinogen_exposure: [String],
    # $targeted_therapy: [String],
    $targeted_therapy_string: [String],

    $anatomical_collection_site: [String],
    $tissue_category: [String],
    $assessment_timepoint: [String],

    $data_file_type: [String],
    $data_file_format: [String],

    $first: Int,
    $offset: Int,
    $order_by: String,
    $sort_direction: String
  ){
    fileOverview(
      participant_id: $participant_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      # targeted_therapy: $targeted_therapy
      targeted_therapy_string: $targeted_therapy_string

      anatomical_collection_site: $anatomical_collection_site
      tissue_category: $tissue_category
      assessment_timepoint: $assessment_timepoint

      data_file_type: $data_file_type
      data_file_format: $data_file_format

      first: $first
      offset: $offset
      order_by: $order_by
      sort_direction: $sort_direction
    ){
      participant_id,
      data_file_name,
      data_file_format,
      data_file_type,
      data_file_size,
      data_file_description,
      specimen_id,
      ctep_disease_term
      specimen_record_id
      data_file_uuid
    }
  }
`;

// --------------- GraphQL Query - "ADD FILES FOR SELECTED PARTICIPANTS" under Participants tab ---------------
export const GET_FILE_IDS_FOR_SELECTED_PARTICIPANTS = gql`
query participant_data_files(
  $participant_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  $race: [String],
  $ethnicity: [String],
  $carcinogen_exposure: [String],
  # $targeted_therapy: [String],
  $targeted_therapy_string: [String],

  $anatomical_collection_site: [String],
  $tissue_category: [String],
  $assessment_timepoint: [String],

  $data_file_type: [String],
  $data_file_format: [String],

  $first: Int,
  $offset: Int,
  $order_by: String,
  $sort_direction: String
) {
  participant_data_files(
      participant_id: $participant_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      # targeted_therapy: $targeted_therapy
      targeted_therapy_string: $targeted_therapy_string

      anatomical_collection_site: $anatomical_collection_site
      tissue_category: $tissue_category
      assessment_timepoint: $assessment_timepoint

      data_file_type: $data_file_type
      data_file_format: $data_file_format

      first: $first
      offset: $offset
      order_by: $order_by
      sort_direction: $sort_direction
) {
  data_file_uuid
  __typename
}
}
  `;

// --------------- GraphQL Query - "ADD FILES FOR SELECTED BIOSPECIMENS" under Biospecimens tab ---------------
export const GET_FILE_IDS_FOR_SELECTED_BIOSPECIMENS = gql`
query biospecimenAddAllToCart(
  $specimen_record_id: [String], # Helps in adding the selected Biospecimen(s)-files to the cart

  $participant_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  $race: [String],
  $ethnicity: [String],
  $carcinogen_exposure: [String],
  # $targeted_therapy: [String],
  $targeted_therapy_string: [String],

  $anatomical_collection_site: [String],
  $tissue_category: [String],
  $assessment_timepoint: [String],

  $data_file_type: [String],
  $data_file_format: [String],

  $first: Int,
  $offset: Int= 0, 
  $order_by: String = "data_file_uuid",
  $sort_direction: String = "asc"
){
  biospecimen_data_files(
    specimen_record_id: $specimen_record_id

    participant_id: $participant_id
    ctep_disease_term: $ctep_disease_term
    stage_of_disease: $stage_of_disease
    tumor_grade: $tumor_grade
    sex: $sex
    race: $race
    ethnicity: $ethnicity
    carcinogen_exposure: $carcinogen_exposure
    # targeted_therapy: $targeted_therapy
    targeted_therapy_string: $targeted_therapy_string

    anatomical_collection_site: $anatomical_collection_site
    tissue_category: $tissue_category
    assessment_timepoint: $assessment_timepoint

    data_file_type: $data_file_type
    data_file_format: $data_file_format

    first: $first,
    offset: $offset,
    order_by: $order_by,
    sort_direction: $sort_direction
  ){
      data_file_uuid
  }
}
`;

// --------------- GraphQL Query - "ADD SELECTED FILES" under Files tab ---------------
export const GET_FILE_IDS_FOR_SELECTED_FILES = gql`
query fileAddSelectedToCart(
  $data_file_uuid: [String], # Helps in adding the selected files to the cart

  $participant_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  $race: [String],
  $ethnicity: [String],
  $carcinogen_exposure: [String],
  # $targeted_therapy: [String],
  $targeted_therapy_string: [String],

  $anatomical_collection_site: [String],
  $tissue_category: [String],
  $assessment_timepoint: [String],

  $data_file_type: [String],
  $data_file_format: [String],

  $first: Int,
  $offset: Int= 0, 
  $order_by: String = "data_file_uuid",
  $sort_direction: String = "asc"
 ){
  fileOverview(
    data_file_uuid: $data_file_uuid,
    
    participant_id: $participant_id
    ctep_disease_term: $ctep_disease_term
    stage_of_disease: $stage_of_disease
    tumor_grade: $tumor_grade
    sex: $sex
    race: $race
    ethnicity: $ethnicity
    carcinogen_exposure: $carcinogen_exposure
    # targeted_therapy: $targeted_therapy
    targeted_therapy_string: $targeted_therapy_string

    anatomical_collection_site: $anatomical_collection_site
    tissue_category: $tissue_category
    assessment_timepoint: $assessment_timepoint

    data_file_type: $data_file_type
    data_file_format: $data_file_format

    first: $first
    offset: $offset
    order_by: $order_by
    sort_direction: $sort_direction
  ){
      data_file_uuid,
  }
}
`;

// --------------- GraphQL Query - "ADD FILES FOR ALL PARTICIPANTS" under Participants tab ---------------
export const GET_ALL_FILE_IDS_FOR_PARTICIPANTS = gql`
query participant_data_files(
  $participant_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  $race: [String],
  $ethnicity: [String],
  $carcinogen_exposure: [String],
  # $targeted_therapy: [String],
  $targeted_therapy_string: [String],

  $anatomical_collection_site: [String],
  $tissue_category: [String],
  $assessment_timepoint: [String],

  $data_file_type: [String],
  $data_file_format: [String],

  $first: Int,
  $offset: Int,
  $order_by: String,
  $sort_direction: String
) {
  participant_data_files(
      participant_id: $participant_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      # targeted_therapy: $targeted_therapy
      targeted_therapy_string: $targeted_therapy_string

      anatomical_collection_site: $anatomical_collection_site
      tissue_category: $tissue_category
      assessment_timepoint: $assessment_timepoint

      data_file_type: $data_file_type
      data_file_format: $data_file_format

      first: $first
      offset: $offset
      order_by: $order_by
      sort_direction: $sort_direction
) {
  data_file_uuid
  __typename
}
}`;

// --------------- GraphQL Query - "ADD FILES FOR ALL BIOSPECIMENS" under Biospecimens tab ---------------
export const GET_ALL_FILE_IDS_FOR_BIOSPECIMENS = gql`
  query biospecimenAddAllToCart(
    $participant_id: [String],
    $ctep_disease_term: [String],
    $stage_of_disease: [String],
    $tumor_grade: [String],
    $sex: [String],
    $race: [String],
    $ethnicity: [String],
    $carcinogen_exposure: [String],
    # $targeted_therapy: [String],
    $targeted_therapy_string: [String],

    $anatomical_collection_site: [String],
    $tissue_category: [String],
    $assessment_timepoint: [String],

    $data_file_type: [String],
    $data_file_format: [String],

    $first: Int,
    $offset: Int= 0, 
    $order_by: String = "data_file_uuid",
    $sort_direction: String = "asc"
  ){
    biospecimen_data_files(
      participant_id: $participant_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      # targeted_therapy: $targeted_therapy
      targeted_therapy_string: $targeted_therapy_string

      anatomical_collection_site: $anatomical_collection_site
      tissue_category: $tissue_category
      assessment_timepoint: $assessment_timepoint

      data_file_type: $data_file_type
      data_file_format: $data_file_format

      first: $first,
      offset: $offset,
      order_by: $order_by,
      sort_direction: $sort_direction
    ){
        data_file_uuid
    }
  }
`;

// --------------- GraphQL Query - "ADD ALL FILES" under Files tab ---------------
export const GET_ALL_FILE_IDS_FOR_FILES = gql`
query fileAddAllToCart(
  $participant_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  $race: [String],
  $ethnicity: [String],
  $carcinogen_exposure: [String],
  # $targeted_therapy: [String],
  $targeted_therapy_string: [String],

  $anatomical_collection_site: [String],
  $tissue_category: [String],
  $assessment_timepoint: [String],

  $data_file_type: [String],
  $data_file_format: [String],
  
  $first: Int,
  $offset: Int= 0, 
  $order_by: String = "data_file_uuid",
  $sort_direction: String = "asc"
 ){
  fileOverview(
    participant_id: $participant_id
    ctep_disease_term: $ctep_disease_term
    stage_of_disease: $stage_of_disease
    tumor_grade: $tumor_grade
    sex: $sex
    race: $race
    ethnicity: $ethnicity
    carcinogen_exposure: $carcinogen_exposure
    # targeted_therapy: $targeted_therapy
    targeted_therapy_string: $targeted_therapy_string

    anatomical_collection_site: $anatomical_collection_site
    tissue_category: $tissue_category
    assessment_timepoint: $assessment_timepoint

    data_file_type: $data_file_type
    data_file_format: $data_file_format

    first: $first
    offset: $offset
    order_by: $order_by
    sort_direction: $sort_direction
  ){
      data_file_uuid,
  }
}
`;

// --------------- GraphQL query - Retrieve files tab details --------------
export const GET_FILES_NAME_QUERY = gql`
query fileOverview($file_ids: [String], $offset: Int = 0, $first: Int = 100000, $order_by:String ="file_name"){
  fileOverview(file_ids: $file_ids, offset: $offset,first: $first, order_by: $order_by) {
    file_name
  }
}
  `;

export const GET_FILE_IDS_FROM_FILE_NAME = gql`
  query (
      $file_name: [String],
      $offset: Int,
      $first: Int,
      $order_by: String
  )
  {
      fileIdsFromFileNameDesc(
          file_name:$file_name, 
          offset:$offset,
          first:$first,
          order_by:$order_by
      )
      {
          file_id
      }
  }`;

// --------------- Tabs Table configuration --------------
export const tabContainers = [
  {
    name: 'Participants',
    dataField: 'participant_data_files',
    api: GET_PARTICIPANTS_OVERVIEW_QUERY,
    paginationAPIField: 'participantOverview',
    count: 'numberOfParticipants',
    dataKey: 'participant_id',
    defaultSortField: 'participant_id',
    defaultSortDirection: 'asc',
    tableID: 'participants_tab_table',
    addAllButtonText: 'ADD FILES FOR ALL PARTICIPANTS',
    buttonText: 'ADD FILES FOR SELECTED PARTICIPANTS',
    cartWillFull: true,
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: "View Columns"
      },
      download: {
        downloadCsv: "Download Table Contents As CSV",
        downloadFileName: "CTDC_Participants_download",
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'ctep_disease_term',
        header: 'Diagnosis',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'stage_of_disease',
        header: 'Stage of Disease',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'tumor_grade',
        header: 'Tumor Grade',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'age_at_enrollment',
        header: 'Age',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'sex',
        header: 'Sex',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'race',
        header: 'Race',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'ethnicity',
        header: 'Ethnicity',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'carcinogen_exposure',
        header: 'Carcinogen Exposure',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
        removeSquareBrackets: true, // Flag to indicate if square brackets should be removed
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'targeted_therapy_string',
        header: 'Targeted Therapy',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
        headerType: headerTypes.CUSTOM_ELEM,
        substitutionRules: [ { replace: "|", with: ", " }] // Defines character replacements
      },
    ],
    id: 'participants_tab',
    tableID: 'participants_tab_table',
    // tableDownloadCSV: customCasesTabDownloadCSV,
    tabIndex: '0',
    // downloadFileName: 'Bento_Dashboard_cases_download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'participant_id',
    addFilesResponseKeys: ['participant_data_files', 'data_file_uuid'],
    addAllFilesResponseKeys: ['participant_data_files', 'data_file_uuid'],
    addAllFileQuery: GET_ALL_FILE_IDS_FOR_PARTICIPANTS,
    addSelectedFilesQuery: GET_FILE_IDS_FOR_SELECTED_PARTICIPANTS,
  },
  {
    name: 'Biospecimens',
    dataField: 'dataSample',
    api: GET_BIOSPECIMENS_OVERVIEW_QUERY,
    count: 'numberOfSpecimens',
    paginationAPIField: 'biospecimenOverview',
    dataKey: 'specimen_record_id',
    defaultSortField: 'specimen_record_id',
    defaultSortDirection: 'asc',
    tableID: 'biospecimens_tab_table',
    addAllButtonText: 'ADD FILES FOR ALL BIOSPECIMENS',
    buttonText: 'ADD FILES FOR SELECTED BIOSPECIMENS',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: "View Columns"
      },
      download: {
        downloadCsv: "Download Table Contents As CSV",
        downloadFileName: "CTDC_Biospecimens_download",
      },
    },
    saveButtonDefaultStyle: {
      color: '#fff',
      backgroundColor: '#00AEEF',
      opacity: '1',
      border: '0px',
      cursor: 'pointer',
    },
    DeactiveSaveButtonDefaultStyle: {
      opacity: '0.3',
      cursor: 'auto',
    },
    ActiveSaveButtonDefaultStyle: {
      cursor: 'pointer',
      opacity: 'unset',
      border: 'unset',
    },

    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'ctep_disease_term',
        header: 'Diagnosis',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'stage_of_disease',
        header: 'Stage of Disease',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'primary_disease_site',
        header: 'Primary Site',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM
      },
      // Hidden: Using specimen_record_id instead
      {
        dataField: 'specimen_id',
        header: 'Biospecimen ID',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'specimen_record_id',
        header: 'Specimen Record ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'anatomical_collection_site',
        header: 'Anatomical Collection Site',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'tissue_category',
        header: 'Tissue Category',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'assessment_timepoint',
        header: 'Collection Timepoint',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
    ],
    id: 'biospecimens_tab',
    tableID: 'biospecimens_tab_table',
    tabIndex: '1',
    // tableDownloadCSV: customSamplesTabDownloadCSV,
    // downloadFileName: 'Bento_Dashboard_cases_download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'specimen_record_id',

    addFilesResponseKeys: ['biospecimen_data_files', 'data_file_uuid'],
    addSelectedFilesQuery: GET_FILE_IDS_FOR_SELECTED_BIOSPECIMENS,

    addAllFilesResponseKeys: ['biospecimen_data_files', 'data_file_uuid'],
    addAllFileQuery: GET_ALL_FILE_IDS_FOR_BIOSPECIMENS,
  },
  {
    name: 'Files',
    dataField: 'dataFile',
    api: GET_FILES_OVERVIEW_QUERY,
    paginationAPIField: 'fileOverview',
    defaultSortField: 'data_file_name',
    defaultSortDirection: 'asc',
    count: 'numberOfFiles',
    dataKey: 'data_file_uuid',
    tableID: 'file_tab_table',
    addAllButtonText: 'ADD ALL FILES',
    buttonText: 'ADD SELECTED FILES',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: "View Columns"
      },
      download: {
        downloadCsv: "Download Table Contents As CSV",
        downloadFileName: "CTDC_Data_Files_download",
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'data_file_name',
        header: 'File Name',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM
      },
      {
        dataField: 'data_file_format',
        header: 'Format',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'data_file_type',
        header: 'File Type',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'data_file_size',
        header: 'Size',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        dataFormatType: dataFormatTypes.FORMAT_BYTES,
        cellType: cellTypes.FORMAT_DATA,
      },
      {
        dataField: 'data_file_description',
        header: 'Description',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'data_file_uuid', // This need to left empty if no data need to be displayed before file download icon
        header: 'Access',
        display: true,
        cellType: cellTypes.CUSTOM_ELEM,
        downloadDocument: true, // To indicate that column is document donwload
        documentDownloadProps: {
          // Max file size needs to bin Bytes to seperate two support file preview and download
          maxFileSize: 80000000, // 10MB => 80,000,000 bits
          // datafield where file file column exists in the table
          fileSizeColumn: 'data_file_size',
          // datafield where file file id exists in the table which is used to get file location
          fileLocationColumn: 'data_file_uuid',
          // datafield where file format exists in the table
          fileFormatColumn: 'data_file_format',
          // datafield where file case id exists in the table which is used to get file information
          caseIdColumn: 'participant_id',
          // datafield where file name exists
          fileName: 'data_file_name',

          // Case 1: Logged in and granted access, file size below {maxFileSize}
          toolTipTextFileDownload: 'Click to download a copy of this file if you have been approved by dbGaP',
          iconFileDownload: downloadSuccess,
          
          // Case 2: Not logged in or access not granted, file size below {maxFileSize}
          iconUnauthenticated: downloadLock,
          toolTipTextUnauthenticated: 'You must be logged in and must already have been granted access to download a copy of this file',

          // Case 3: Regardless of login status, file size larger than {maxFileSize}
          iconFilePreview: previewLarge,
          toolTipTextFilePreview: 'Because of its size and/or format, this file must be accessed via the My Files workflow',
        },
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      // Hidden: Using specimen_record_id instead
      {
        dataField: 'specimen_id',
        header: 'Biospecimen ID',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'specimen_record_id',
        header: 'Specimen Record ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'ctep_disease_term',
        header: 'Diagnosis',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
    ],
    id: 'file_tab',
    tableID: 'file_tab_table',
    selectableRows: true,
    // tableDownloadCSV: customFilesTabDownloadCSV,
    // downloadFileName: 'Bento_Dashboard_cases_download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },

    addFilesRequestVariableKey: 'data_file_uuid',
    
    addFilesResponseKeys: ['fileOverview','data_file_uuid'],
    addSelectedFilesQuery: GET_FILE_IDS_FOR_SELECTED_FILES,

    addAllFilesResponseKeys: ['fileOverview', 'data_file_uuid'],
    addAllFileQuery: GET_ALL_FILE_IDS_FOR_FILES,
  },
];

  