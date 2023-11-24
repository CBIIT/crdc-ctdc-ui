import { sortType, InputTypes } from '@bento-core/facet-filter';

const CASES = 'Filter by Participants';
const SAMPLES = 'Filter by Biospecimens';
const FILES = 'Filter by Data Files';
const GROUP = 'group';

// --------------- Facet resetIcon link configuration --------------
// Ideal size for resetIcon is 16x16 px
export const resetIcon = {
  src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/Clear-icon.svg',
  alt: 'Reset icon',
  size: '12 px',
};

// --------------- Dashboard Sidebar Sections styling --------------
export const facetSectionVariables = {
  'Filter by Participants': {
    isExpanded: true,
    hasSearch: true,
    hasArrowDropDownIcon: false,
  },
  'Filter by Biospecimens': {
    isExpanded: true,
  },
  'Filter by Data Files': {
    isExpanded: true,
  },
};

export const facetsConfig = [
  {
    section: CASES,
    label: 'Diagnosis',
    apiPath: 'participantCountBySnomedDiseaseTerm',
    apiForFiltering: 'filterParticipantCountBySnomedDiseaseTerm',
    datafield: 'snomed_disease_term',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
    facetClasses: {
      border: '10px solid red'
    }
  },
  {
    section: CASES,
    label: 'Stage of Disease',
    apiPath: 'participantCountByStageOfDisease',
    apiForFiltering: 'filterParticipantCountByStageOfDisease',
    datafield: 'stage_of_disease',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Tumor Grade',
    apiPath: 'participantCountByTumorGrade',
    apiForFiltering: 'filterParticipantCountByTumorGrade',
    datafield: 'tumor_grade',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Sex',
    apiPath: 'participantCountBySex',
    apiForFiltering: 'filterParticipantCountBySex',
    datafield: 'sex',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.RANGE,
    show: true,
  },
  {
    section: CASES,
    label: 'Gender',
    apiPath: 'participantCountByReportedGender',
    apiForFiltering: 'filterParticipantCountByReportedGender',
    datafield: 'reported_gender',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.CUSTOM_NUMBER,
    show: true,
  },
  {
    section: CASES,
    label: 'Race',
    apiPath: 'participantCountByRace',
    apiForFiltering: 'filterParticipantCountByRace',
    datafield: 'race',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Ethnicity',
    apiPath: 'participantCountByEthnicity',
    apiForFiltering: 'filterParticipantCountByEthnicity',
    datafield: 'ethnicity',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Exposures',
    apiPath: 'participantCountByCarcinogenExposure',
    apiForFiltering: 'filterParticipantCountByCarcinogenExposure',
    datafield: 'carcinogen_exposure',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Targeted Therapy',
    apiPath: 'participantCountByTargetedTherapy',
    apiForFiltering: 'filterParticipantCountByTargetedTherapy',
    datafield: 'targeted_therapy',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: SAMPLES,
    label: 'Anatomical Collection Site',
    apiPath: 'specimenCountByAnatomicalCollectionSite',
    apiForFiltering: 'filterSpecimenCountByAnatomicalCollectionSite',
    datafield: 'anatomical_collection_site',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: SAMPLES,
    label: 'Biospecimen Type',
    apiPath: 'specimenCountBySpecimenType',
    apiForFiltering: 'filterSpecimenCountBySpecimenType',
    datafield: 'specimen_type',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: SAMPLES,
    label: 'Tissue Category',
    apiPath: 'specimenCountByTissueCategory',
    apiForFiltering: 'filterSpecimenCountByTissueCategory',
    datafield: 'tissue_category',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: SAMPLES,
    label: 'Collection Timepoint',
    apiPath: 'participantCountByAssessmentTimepoint',
    apiForFiltering: 'filterParticipantCountByAssessmentTimepoint',
    datafield: 'assessment_timepoint',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: FILES,
    label: 'File Type',
    apiPath: 'dataFileCountByDataFileType',
    apiForFiltering: 'filterDataFileCountByDataFileType',
    datafield: 'data_file_type',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: FILES,
    label: 'File Format',
    apiPath: 'dataFileCountByDataFileFormat',
    apiForFiltering: 'filterDataFileCountByDataFileFormat',
    datafield: 'data_file_format',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
];

// --------------- Dashboard Widgets configuration --------------
// Sunburst chart color scheme
export const SUNBURST_COLORS_LEVEL_1 = [
  '#C2E5DC',
  '#6AC6B6',
  '#C33B27',
  '#FDB915',
  '#381F5F',
  '#007EA5',
  '#8B5996',
];

export const SUNBURST_COLORS_LEVEL_2 = [
  '#8B5996',
  '#6AC6B6',
  '#007EA5',
  '#C33B27',
  '#FDB915',
  '#381F5F',
  '#6AC6B6',
  '#007EA5',
  '#C2E5DC',
];

// A maximum of 6 widgets are allowed
// for donuts only the following are required: type, title, dataName
//
// type: 'sunburst' | 'donut'
// title: string
// dataName: string
// datatable_level1_field: string
// datatable_level1_colors: string[]
// datatable_level2_field: string
// datatable_level2_colors: string[]
// sliceTitle: string (optional)
export const widgetConfig = [
  {
    type: 'sunburst',
    title: 'Diagnosis and Stage of Disease',
    sliceTitle: "Participants",
    dataName: 'diagnosesAndStageOfDiseases', 
    datatable_level1_field: 'program', // Inner Ring
    datatable_level1_colors: SUNBURST_COLORS_LEVEL_1,
    datatable_level2_field: 'arm', // Outer Ring
    datatable_level2_colors: SUNBURST_COLORS_LEVEL_2,
  },
  {
    type: 'sunburst',
    title: 'Sex and Gender',
    sliceTitle: "Participants",
    dataName: 'sexesAndGenders',
    datatable_level1_field: 'program', // Inner Ring
    datatable_level1_colors: SUNBURST_COLORS_LEVEL_1,
    datatable_level2_field: 'arm', // Outer Ring
    datatable_level2_colors: SUNBURST_COLORS_LEVEL_2,
  },
  {
    type: 'sunburst',
    title: 'Race and Ethnicity',
    sliceTitle: "Participants",
    dataName: 'racesAndEthnicities',
    datatable_level1_field: 'program',
    datatable_level1_colors: SUNBURST_COLORS_LEVEL_1,
    datatable_level2_field: 'arm',
    datatable_level2_colors: SUNBURST_COLORS_LEVEL_2,
  },
  {
    type: 'donut',
    title: 'Therapy',
    sliceTitle: "Participants",
    dataName: 'participantCountByTargetedTherapy',
  },
  {
    type: 'sunburst',
    title: 'Biospecimens & Timepoints',
    sliceTitle: "Biospecimens",
    dataName: 'timepointsAndBiospecimensTypes',
    datatable_level1_field: 'program',
    datatable_level1_colors: SUNBURST_COLORS_LEVEL_1,
    datatable_level2_field: 'arm',
    datatable_level2_colors: SUNBURST_COLORS_LEVEL_2,
  },
  {
    type: 'donut',
    title: 'Files',
    sliceTitle: "Files",
    dataName: 'dataFileCountByDataFileType',
  },
];
