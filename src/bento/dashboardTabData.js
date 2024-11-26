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
  $subject_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String], 
  $sex: [String], 
  # $reported_gender: [String], 
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
    subject_id: $subject_id
    ctep_disease_term: $ctep_disease_term
    stage_of_disease: $stage_of_disease
    tumor_grade: $tumor_grade
    sex: $sex
    # reported_gender: $reported_gender
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
  $subject_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  # $reported_gender: [String],
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
    subject_id: $subject_id
    ctep_disease_term: $ctep_disease_term
    stage_of_disease: $stage_of_disease
    tumor_grade: $tumor_grade
    sex: $sex
    # reported_gender: $reported_gender
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
    sexesAndGenders {
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
      __typename
    }
    filterParticipantCountByStageOfDisease {
      group
      subjects
      __typename
    }
    participantCountByCtepDiseaseTerm {
      group
      subjects
      __typename
    }
    filterParticipantCountByCtepDiseaseTerm {
      group
      subjects
      __typename
    }
    participantCountBySnomedDiseaseCode{
      group
      subjects
      __typename
    }
    filterParticipantCountBySnomedDiseaseCode{
      group
      subjects
      __typename
    }
    participantCountByTumorGrade {
      group
      subjects
    #   __typename
    }
    filterParticipantCountByTumorGrade {
      group
      subjects
    #   __typename
    }
    participantCountBySex {
      group
      subjects
      __typename
    }
    filterParticipantCountBySex {
      group
      subjects
      __typename
    }
    participantCountByReportedGender {
      group
      subjects
      __typename
    }
    filterParticipantCountByReportedGender {
      group
      subjects
      __typename
    }
    participantCountByRace {
      group
      subjects
      __typename
    }
    filterParticipantCountByRace {
      group
      subjects
      __typename
    }
    participantCountByEthnicity {
      group
      subjects
      __typename
    }
    filterParticipantCountByEthnicity {
      group
      subjects
      __typename
    }
    participantCountByCarcinogenExposure {
      group
      subjects
      __typename
    }
    filterParticipantCountByCarcinogenExposure {
      group
      subjects
      __typename
    }
    participantCountByTargetedTherapy {
      group
      subjects
      __typename
    }
    filterParticipantCountByTargetedTherapy {
      group
      subjects
      __typename
    }
    participantCountBySingleTargetedTherapyCombination {
      group
      subjects
      __typename
    }
    participantCountBySingleTargetedTherapyCombinationForFacet {
      group
      subjects
      __typename
    }
    filterParticipantCountBySingleTargetedTherapyCombinationForFacet {
      group
      subjects
      __typename
    }
    filterParticipantCountBySingleTargetedTherapyCombination {
      group
      subjects
      __typename
    }
    specimenCountByAnatomicalCollectionSite {
      group
      subjects
      __typename
    }
    filterSpecimenCountByAnatomicalCollectionSite {
      group
      subjects
      __typename
    }
    specimenCountByTissueCategory {
      group
      subjects
      __typename
    }
    filterSpecimenCountByTissueCategory {
      group
      subjects
      __typename
    }
    specimenCountBySpecimenType {
      group
      subjects
      __typename
    }
    filterSpecimenCountBySpecimenType {
      group
      subjects
      __typename
    }
    participantCountByAssessmentTimepoint {
      group
      subjects
      __typename
    }
    filterParticipantCountByAssessmentTimepoint {
      group
      subjects
      __typename
    }
    dataFileCountByDataFileType {
      group
      subjects
      __typename
    }
    filterDataFileCountByDataFileType {
      group
      subjects
      __typename
    }
    dataFileCountByDataFileFormat {
      group
      subjects
      __typename
    }
    filterDataFileCountByDataFileFormat {
      group
      subjects
      __typename
    }
    __typename
  }
}
`;

export const GET_PARTICIPANTS_OVERVIEW_QUERY = gql`
  query participantOverview(
    $subject_id: [String],
    $ctep_disease_term: [String],
    $stage_of_disease: [String],
    $tumor_grade: [String],
    $sex: [String],
    # $reported_gender: [String],
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
      subject_id: $subject_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      # reported_gender: $reported_gender
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
      subject_id,
      ctep_disease_term,
      stage_of_disease,
      tumor_grade,
      age_at_enrollment,
      sex,
      reported_gender,
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
    $subject_id: [String],
    $ctep_disease_term: [String],
    $stage_of_disease: [String],
    $tumor_grade: [String],
    $sex: [String],
    # $reported_gender: [String],
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
      subject_id: $subject_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      # reported_gender: $reported_gender
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
      subject_id,
      ctep_disease_term,
      stage_of_disease
      primary_disease_site,
      specimen_id,
      parent_specimen_id,
      anatomical_collection_site,
      tissue_category,
      assessment_timepoint

      data_file_uuid
    }
  }
`;

export const GET_FILES_OVERVIEW_QUERY = gql`
  query fileOverview(
    $subject_id: [String],
    $ctep_disease_term: [String],
    $stage_of_disease: [String],
    $tumor_grade: [String],
    $sex: [String],
    # $reported_gender: [String],
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
      subject_id: $subject_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      # reported_gender: $reported_gender
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
      subject_id,
      data_file_name,
      data_file_format,
      data_file_type,
      data_file_size,
      association,
      data_file_description,
      specimen_id,
      ctep_disease_term
      parent_specimen_id
      data_file_uuid
    }
  }
`;

// --------------- GraphQL Query - "ADD FILES FOR SELECTED PARTICIPANTS" under Participants tab ---------------
export const GET_FILE_IDS_FOR_SELECTED_PARTICIPANTS = gql`
query participant_data_files(
  $subject_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  # $reported_gender: [String],
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
      subject_id: $subject_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      # reported_gender: $reported_gender
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
  $parent_specimen_id: [String], # Helps in adding the selected Biospecimen(s)-files to the cart

  $subject_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  # $reported_gender: [String],
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
    parent_specimen_id: $parent_specimen_id

    subject_id: $subject_id
    ctep_disease_term: $ctep_disease_term
    stage_of_disease: $stage_of_disease
    tumor_grade: $tumor_grade
    sex: $sex
    # reported_gender: $reported_gender
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

  $subject_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  # $reported_gender: [String],
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

    subject_id: $subject_id
    ctep_disease_term: $ctep_disease_term
    stage_of_disease: $stage_of_disease
    tumor_grade: $tumor_grade
    sex: $sex
    # reported_gender: $reported_gender
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
  $subject_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  # $reported_gender: [String],
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
      subject_id: $subject_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      # reported_gender: $reported_gender
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
    $subject_id: [String],
    $ctep_disease_term: [String],
    $stage_of_disease: [String],
    $tumor_grade: [String],
    $sex: [String],
    # $reported_gender: [String],
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
      subject_id: $subject_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      # reported_gender: $reported_gender
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
  $subject_id: [String],
  $ctep_disease_term: [String],
  $stage_of_disease: [String],
  $tumor_grade: [String],
  $sex: [String],
  # $reported_gender: [String],
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
    subject_id: $subject_id
    ctep_disease_term: $ctep_disease_term
    stage_of_disease: $stage_of_disease
    tumor_grade: $tumor_grade
    sex: $sex
    # reported_gender: $reported_gender
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
    dataKey: 'subject_id',
    defaultSortField: 'subject_id',
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
        dataField: 'subject_id',
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
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'tumor_grade',
        header: 'Tumor Grade',
        display: true,
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
        dataField: 'reported_gender',
        header: 'Gender',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
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
    addFilesRequestVariableKey: 'subject_id',
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
    dataKey: 'parent_specimen_id',
    defaultSortField: 'parent_specimen_id',
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
        dataField: 'subject_id',
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
        display: true,
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
      // Hidden: Using parent_specimen_id instead
      {
        dataField: 'specimen_id',
        header: 'Biospecimen ID',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'parent_specimen_id',
        header: 'Parent Biospecimen ID',
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
    addFilesRequestVariableKey: 'parent_specimen_id',

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
        dataField: 'association',
        header: 'Association',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
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
          caseIdColumn: 'subject_id',
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
      // Hidden: Using parent_specimen_id instead
      {
        dataField: 'specimen_id',
        header: 'Biospecimen ID',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'parent_specimen_id',
        header: 'Parent Biospecimen ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        headerType: headerTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'subject_id',
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

  