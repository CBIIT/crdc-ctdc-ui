import gql from 'graphql-tag';
import headerIconAsset from '../assets/portfolio/portfolio-header-icon.svg';
import externalLinkIconAsset from '../assets/portfolio/external-link-icon.svg';

// --------------- Icons configuration --------------
export const portfolioHeaderIcon = {
  src: headerIconAsset,
  alt: 'Programs and Initiatives header icon',
};

export const externalLinkIcon = {
  src: externalLinkIconAsset,
  alt: 'External link icon',
};

// --------------- Design tokens (from Figma design, node-id 1597-38231) --------------
export const portfolioColors = {
  heading: '#0D6F94',
  programAccent: '#0F4778',
  initiativeAccent: '#05838F',
  buttonPrimary: '#285D89',
  cardBorder: '#D5D5D5',
};

// --------------- Page configuration --------------
export const pageData = {
  headerTitle: 'Portfolio of CTDC Programs and Initiatives',
};

// --------------- Curated program content --------------
// program_short_description/program_external_url come from the backend (CTDC-2067); image/alt text are not
// modeled in the graph (confirmed out of scope in CTDC-2067/2069), so they're curated here, keyed by
// program_short_name. Populate as real program images/alt text are supplied.
export const curatedProgramContent = {
  // PROGRAM_SHORT_NAME: { primaryImage: require('../assets/portfolio/example.png'), primaryImageAlt: '...' },
};

// --------------- Curated Initiatives card content --------------
// Initiatives is not a graph entity (CTDC-2067/2069 only provide the orphan-study list/count for it), so every
// display field below is curated here rather than coming from a query.
export const initiativesCardContent = {
  name: 'Cancer Moonshot Biobank',
  description: '"Cancer Moonshot Biobank" is a longitudinal study. This means it collects and stores samples and information over time, throughout the course of a patient\'s cancer treatment. By looking at samples and information collected from the same people over time, researchers hope to better understand how cancer changes over time and over the course of medical treatments.',
  primaryImage: '',
  primaryImageAlt: 'Initiatives',
  externalUrl: '',
};

// Where the Initiatives card renders among the program cards (0 = first, 1 = second, etc). Change this single
// value to reposition it - portfolioView.js splices it into the card list at this index.
export const initiativesCardPosition = 1;

// --------------- GraphQL query - Retrieve program list (CTDC-2067) --------------
// Shape matches the backend contract delivered in crdc-ctdc-backend PR #204 (not yet merged - see
// /memories/repo/portfolio-page-ctdc-2064.md): root field is `getAllPrograms`, not `program`. There is no
// program_sort_order field - server-side order comes from order_by/sort_direction (defaults to alphabetical
// by program_short_name). study_count is also available directly if the `studies` sub-list ever becomes
// unnecessary to fetch in full.
export const GET_PORTFOLIO_PROGRAMS_QUERY = gql`
  query getPortfolioProgramsQuery {
    getAllPrograms {
      program_name
      program_short_name
      crdc_id
      program_short_description
      program_external_url
      study_count
      studies {
        study_short_name
        study_name
      }
    }
  }
`;

// --------------- GraphQL query - Retrieve unaffiliated studies (CTDC-2067 orphan-study query) --------------
// Shape matches PR #204: there is no dedicated `unaffiliatedStudies` query - orphan studies are the existing
// `getAllStudies` query filtered by the new `study_has_program` arg. Reused verbatim by CTDC-2069's no-program
// detail variant.
export const GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY = gql`
  query getPortfolioUnaffiliatedStudiesQuery {
    getAllStudies(study_has_program: ["has no program"]) {
      study_short_name
      study_name
    }
  }
`;
