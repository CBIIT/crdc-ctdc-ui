import gql from 'graphql-tag';
import { pageData as studiesPageData } from './studiesData';
import { portfolioHeaderIcon, portfolioColors } from './portfolioData';

// --------------- Icon / colors (reused from the Portfolio page - CTDC-2064) --------------
export const programDetailsHeaderIcon = portfolioHeaderIcon;
export const programDetailsColors = {
  ...portfolioColors,
  sectionTitle: '#066D93',
};

// --------------- GraphQL query - Retrieve a single program's details (CTDC-2069) --------------
// Shape matches the backend contract delivered in crdc-ctdc-backend PR #204 (not yet merged - see
// /memories/repo/program-details-ctdc-2065.md): there is no singular by-name lookup field, only the list field
// `getAllPrograms(program_short_name: [String])` - pass a 1-element array and read index 0 client-side. An
// unknown program_short_name returns an empty array (not an error), which the controller still surfaces as
// its existing not-found state.
export const GET_PROGRAM_DETAIL_QUERY = gql`
  query getProgramDetailQuery($programShortName: [String!]) {
    getAllPrograms(program_short_name: $programShortName) {
      program_name
      program_short_name
      crdc_id
      program_full_description
      program_external_url
      studies {
        study_id
        study_accession
        study_short_name
        study_name
      }
    }
  }
`;

// --------------- Curated Host Videos content --------------
// Host videos are not modeled in the graph (CTDC-2069 is explicit these are curated outside the data model),
// so they are static config here, keyed by program_short_name. Populate as real curated content is supplied.
// Shape: { hostVideos: [{ title, thumbnail, videoUrl }] } - title is not displayed; it is the thumbnail's alt text and
// the player's accessible name.
export const curatedProgramDetailContent = {
  NCTN: {
    hostVideos: [],
  },
};

// --------------- Curated Initiatives (no-program variant) content --------------
export const initiativesDetailContent = {
  name: 'Initiatives',
  hostVideos: [],
};

// --------------- Associated Studies table --------------
// Per-study table fields (study type, accession, counts) are not on the program's `studies` sub-list, so they come
// from getAllStudies and are joined to the program's studies by study_id in programDetailsController.
export const GET_PROGRAM_STUDY_TABLE_QUERY = gql`
  query getProgramStudyTableQuery {
    getAllStudies {
      study_id
      study_short_name
      study_name
      study_type
      study_accession
      participant_file_count
      study_file_count
      image_collection_count
    }
  }
`;

// Reuses the Studies page table (sorting, pagination, data-availability icons) with the approved Program Details
// column order: Program, Study Name, Study Type, Accession ID, Study Code, Data Availability (5 icons).
const studiesColumns = studiesPageData.table.columns;
const studyColumn = (field) => studiesColumns.find((column) => column.dataField === field);

export const programStudiesTable = {
  ...studiesPageData.table,
  title: 'Associated Studies',
  defaultSortField: 'study_id',
  columns: [
    { dataField: 'program_short_name', header: 'Program', display: true, tooltipText: 'sort' },
    studyColumn('study_name'),
    studyColumn('study_type'),
    { dataField: 'study_accession', header: 'Accession ID', display: true, tooltipText: 'sort' },
    studyColumn('study_id'),
    studyColumn('participant_file_count'),
    studyColumn('study_file_count'),
    studyColumn('image_collection_count'),
    studyColumn('numberOfPublications'),
    studyColumn('unique_repository'),
  ],
  columnGroups: [
    { clsName: 'other_columns_left', columnIndexes: [0, 4] },
    { clsName: 'data_availability', custom: true, columnIndexes: [5, 9] },
  ],
};

export const unaffiliatedProgramLabel = 'Not Applicable';
