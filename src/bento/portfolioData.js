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
  buttonPrimary: '#285D89',
  cardBorder: '#D5D5D5',
};

// --------------- Page configuration --------------
export const pageData = {
  headerTitle: 'CTDC Programs and Initiatives',
  searchPlaceholder: 'CTDC Portfolio',
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

// TEMP FIX: dev's backend returns a placeholder "Not Applicable" program node (0 studies, no crdc_id) flagged
// "has program" (backend PR #212 now classifies it as "is not program", so this should be redundant once that is
// deployed everywhere), which would render as an empty card. Hide it on the Portfolio page until the data is cleaned up
// or the backend stops returning it, then delete this list and the filter in portfolioView.js.
export const TEMP_HIDDEN_PROGRAM_SHORT_NAMES = ['Not Applicable'];

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

// --------------- GraphQL query - Retrieve program list (CTDC-2067) --------------
// Shape matches the backend contract on crdc-ctdc-backend (PR #204, filter renamed in PR #212): root field is
// `getAllPrograms`. `is_program: ["is program"]` is required here - without it, getAllPrograms also mixes in a
// synthetic no-program grouping (per the schema's doc comment: "an empty list includes both"), which would
// duplicate the Initiatives data this page fetches separately below. Cards are ordered alphabetically by name in
// portfolioView.js, so program_sort_order is not used for ordering.
export const GET_PORTFOLIO_PROGRAMS_QUERY = gql`
  query getPortfolioProgramsQuery {
    getAllPrograms(is_program: ["is program"]) {
      program_name
      program_short_name
      crdc_id
      program_short_description
      program_external_url
      program_sort_order
      study_count
      studies {
        study_id
        study_accession
        study_short_name
        study_name
      }
    }
  }
`;

// --------------- GraphQL query - Retrieve unaffiliated studies (CTDC-2067 orphan-study query) --------------
// `getAllStudies` no longer accepts a program filter (removed in PR #204) - the orphan/Initiatives bucket is
// reached through `getAllPrograms(is_program: ["is not program"])` instead (arg renamed from study_has_program
// in backend PR #212), which returns a synthetic no-program grouping whose `studies` sub-list is the unaffiliated studies. Reused
// verbatim by CTDC-2069's no-program detail variant. The controller reads result[0]?.studies.
export const GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY = gql`
  query getPortfolioUnaffiliatedStudiesQuery {
    getAllPrograms(is_program: ["is not program"]) {
      studies {
        study_id
        study_accession
        study_short_name
        study_name
      }
    }
  }
`;
