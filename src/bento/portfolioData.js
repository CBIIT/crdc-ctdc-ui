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
  name: 'Initiatives',
  description: '',
  primaryImage: '',
  primaryImageAlt: 'Initiatives',
  externalUrl: '',
};

// --------------- GraphQL query - Retrieve program list (CTDC-2067) --------------
// PLACEHOLDER shape modeled on the agreed CTDC-2067 contract (see /memories/repo/portfolio-page-ctdc-2064.md):
// program_name, program_short_name, crdc_id, program_short_description, program_sort_order,
// program_external_url, plus the per-program studies list (used for both the study count and the
// identifiers needed by the Associated Studies filter). Field/root-name confirmed against CTDC-2067 AC#8's
// published query contract once backend delivers it.
export const GET_PORTFOLIO_PROGRAMS_QUERY = gql`
  query getPortfolioProgramsQuery {
    program {
      program_name
      program_short_name
      crdc_id
      program_short_description
      program_sort_order
      program_external_url
      studies {
        study_short_name
        study_name
      }
    }
  }
`;

// --------------- GraphQL query - Retrieve unaffiliated studies (CTDC-2067 orphan-study query) --------------
// PLACEHOLDER shape - reuses the same orphan-study query CTDC-2069 reuses for the no-program detail variant.
export const GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY = gql`
  query getPortfolioUnaffiliatedStudiesQuery {
    unaffiliatedStudies {
      study_short_name
      study_name
    }
  }
`;
