import gql from 'graphql-tag';
import headerIconAsset from '../assets/portfolio/portfolio-header-icon.svg';
import externalLinkIconAsset from '../assets/portfolio/external-link-icon.svg';
import nctnImage from '../assets/landing/LP_Cases.png';
import nciMatchImage from '../assets/about/About_CTDC_Model.png';
import cimacCidcImage from '../assets/landing/Studies-image.jpg';
import initiativesImage from '../assets/landing/LP_Studies.png';

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
// program_short_name. TEMPORARY: images below are reused from other existing site assets (landing/about
// pages) purely to preview card layout with mock data - replace with real curated program images.
export const curatedProgramContent = {
  NCTN: { primaryImage: nctnImage, primaryImageAlt: 'NCI National Clinical Trials Network' },
  'NCI-MATCH': { primaryImage: nciMatchImage, primaryImageAlt: 'NCI Molecular Analysis for Therapy Choice Trial' },
  'CIMAC-CIDC': { primaryImage: cimacCidcImage, primaryImageAlt: 'Cancer Immune Monitoring and Analysis Centers, Cancer Immunologic Data Center Network' },
};

// --------------- Curated Initiatives card content --------------
// Initiatives is not a graph entity (CTDC-2067/2069 only provide the orphan-study list/count for it), so every
// display field below is curated here rather than coming from a query.
export const initiativesCardContent = {
  name: 'Cancer Moonshot Biobank',
  description: '"Cancer Moonshot Biobank" is a longitudinal study. This means it collects and stores samples and information over time, throughout the course of a patient\'s cancer treatment. By looking at samples and information collected from the same people over time, researchers hope to better understand how cancer changes over time and over the course of medical treatments.',
  primaryImage: initiativesImage,
  primaryImageAlt: 'Initiatives',
  externalUrl: '',
};

// Where the Initiatives card renders among the program cards (0 = first, 1 = second, etc). Change this single
// value to reposition it - portfolioView.js splices it into the card list at this index.
export const initiativesCardPosition = 1;

// --------------- GraphQL query - Retrieve program list (CTDC-2067) --------------
// Shape matches the current backend contract on crdc-ctdc-backend PR #204 (not yet merged - see
// /memories/repo/portfolio-page-ctdc-2064.md): root field is `getAllPrograms`. `study_has_program:
// ["has program"]` is required here - without it, getAllPrograms also mixes in a synthetic "no program"
// grouping (per the schema's own doc comment: "an empty list includes both"), which would duplicate the
// Initiatives data this page fetches separately below. program_sort_order now exists on ProgramNode (added
// after our initial integration) - used by portfolioView.js for curated card ordering.
export const GET_PORTFOLIO_PROGRAMS_QUERY = gql`
  query getPortfolioProgramsQuery {
    getAllPrograms(study_has_program: ["has program"]) {
      program_name
      program_short_name
      crdc_id
      program_short_description
      program_external_url
      program_sort_order
      study_count
      studies {
        study_short_name
        study_name
      }
    }
  }
`;

// --------------- GraphQL query - Retrieve unaffiliated studies (CTDC-2067 orphan-study query) --------------
// `getAllStudies` no longer accepts a study_has_program arg (removed in PR #204) - the orphan/Initiatives
// bucket is now reached through `getAllPrograms(study_has_program: ["has no program"])` instead, which
// returns a synthetic no-program grouping whose `studies` sub-list is the unaffiliated studies. Reused
// verbatim by CTDC-2069's no-program detail variant. The controller reads result[0]?.studies.
export const GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY = gql`
  query getPortfolioUnaffiliatedStudiesQuery {
    getAllPrograms(study_has_program: ["has no program"]) {
      studies {
        study_short_name
        study_name
      }
    }
  }
`;
