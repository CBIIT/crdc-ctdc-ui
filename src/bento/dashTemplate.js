import { sortType, InputTypes } from '@bento-core/facet-filter';

const CASES = 'Cases';
const SAMPLES = 'Samples';
const FILES = 'Files';
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
  Cases: {
    isExpanded: true,
    hasSearch: true,
  },
  Samples: {
    isExpanded: true,
  },
  Files: {
    isExpanded: true,
  },
};

export const facetsConfig = [
  {
    section: CASES,
    label: 'Program',
    apiPath: 'subjectCountByProgram',
    apiForFiltering: 'filterSubjectCountByProgram',
    datafield: 'programs',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Arm',
    apiPath: 'subjectCountByStudy',
    apiForFiltering: 'filterSubjectCountByStudy',
    datafield: 'studies',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Diagnosis',
    apiPath: 'subjectCountByDiagnoses',
    apiForFiltering: 'filterSubjectCountByDiagnoses',
    datafield: 'diagnoses',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Recurrence Score',
    apiPath: 'subjectCountByRecurrenceScore',
    apiForFiltering: 'filterSubjectCountByRecurrenceScore',
    datafield: 'rc_scores',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.RANGE,
    show: true,
  },
  {
    section: CASES,
    label: 'Tumor Size',
    apiPath: 'subjectCountByTumorSize',
    apiForFiltering: 'filterSubjectCountByTumorSize',
    datafield: 'tumor_sizes',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.CUSTOM_NUMBER,
    show: true,
  },
  {
    section: CASES,
    label: 'Chemotherapy',
    apiPath: 'subjectCountByChemotherapyRegimen',
    apiForFiltering: 'filterSubjectCountByChemotherapyRegimen',
    datafield: 'chemo_regimen',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Tumor Grade',
    apiPath: 'subjectCountByTumorGrade',
    apiForFiltering: 'filterSubjectCountByTumorGrade',
    datafield: 'tumor_grades',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'ER Status',
    apiPath: 'subjectCountByErStatus',
    apiForFiltering: 'filterSubjectCountByErStatus',
    datafield: 'er_status',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'PR Status',
    apiPath: 'subjectCountByPrStatus',
    apiForFiltering: 'filterSubjectCountByPrStatus',
    datafield: 'pr_status',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Endocrine Therapy',
    apiPath: 'subjectCountByEndocrineTherapy',
    apiForFiltering: 'filterSubjectCountByEndocrineTherapy',
    datafield: 'endo_therapies',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Menopause Status',
    apiPath: 'subjectCountByMenopauseStatus',
    apiForFiltering: 'filterSubjectCountByMenopauseStatus',
    datafield: 'meno_status',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: CASES,
    label: 'Age',
    apiPath: 'filterSubjectCountByAge',
    apiForFiltering: 'filterSubjectCountByAge',
    datafield: 'age_at_index',
    ApiLowerBoundName: 'lowerBound',
    ApiUpperBoundName: 'upperBound',
    show: true,
    slider: true,
    type: InputTypes.SLIDER,
    sort_type: 'none',
    minLowerBound: 0,
    maxUpperBound: 100,
    quantifier: 'Years',
  },
  {
    section: SAMPLES,
    label: 'Tissue Type',
    apiPath: 'subjectCountByTissueType',
    apiForFiltering: 'filterSubjectCountByTissueType',
    datafield: 'tissue_type',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: SAMPLES,
    label: 'Tissue Composition',
    apiPath: 'subjectCountByTissueComposition',
    apiForFiltering: 'filterSubjectCountByTissueComposition',
    datafield: 'composition',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: FILES,
    label: 'File Association',
    apiPath: 'subjectCountByFileAssociation',
    apiForFiltering: 'filterSubjectCountByFileAssociation',
    datafield: 'association',
    field: GROUP,
    type: InputTypes.CHECKBOX,
    sort_type: sortType.ALPHABET,
    show: true,
  },
  {
    section: FILES,
    label: 'File Type',
    apiPath: 'subjectCountByFileType',
    apiForFiltering: 'filterSubjectCountByFileType',
    datafield: 'file_type',
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
    datatable_level1_field: 'ctepDiseaseCode', // Inner Ring
    datatable_level1_colors: SUNBURST_COLORS_LEVEL_1,
    datatable_level2_field: 'snomedDiseaseCode', // Outer Ring
    datatable_level2_colors: SUNBURST_COLORS_LEVEL_2,
  },
  {
    type: 'sunburst',
    title: 'Sex and Gender',
    sliceTitle: "Participants",
    dataName: 'sexesAndGenders',
    datatable_level1_field: 'sex', // Inner Ring
    datatable_level1_colors: SUNBURST_COLORS_LEVEL_1,
    datatable_level2_field: 'reportedGender', // Outer Ring
    datatable_level2_colors: SUNBURST_COLORS_LEVEL_2,
  },
  {
    type: 'sunburst',
    title: 'Race and Ethnicity',
    sliceTitle: "Participants",
    dataName: 'racesAndEthnicities',
    datatable_level1_field: 'race',
    datatable_level1_colors: SUNBURST_COLORS_LEVEL_1,
    datatable_level2_field: 'ethnicity',
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
    datatable_level1_field: 'assessmentTimepoint',
    datatable_level1_colors: SUNBURST_COLORS_LEVEL_1,
    datatable_level2_field: 'biospecimensType',
    datatable_level2_colors: SUNBURST_COLORS_LEVEL_2,
  },
  {
    type: 'donut',
    title: 'Files',
    sliceTitle: "Files",
    dataName: 'participantCountByDataFileType',
  },
];
