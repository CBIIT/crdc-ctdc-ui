import gql from 'graphql-tag';
import { portfolioHeaderIcon, portfolioColors } from './portfolioData';

// --------------- Icon / colors (reused from the Portfolio page - CTDC-2064) --------------
export const programDetailsHeaderIcon = portfolioHeaderIcon;
export const programDetailsColors = {
  ...portfolioColors,
  sectionTitle: '#066D93',
};

// --------------- GraphQL query - Retrieve a single program's details (CTDC-2069) --------------
// PLACEHOLDER shape modeled on the agreed CTDC-2069 contract (see
// /memories/repo/program-details-ctdc-2065.md): program_name (full descriptive name), program_short_name
// (short code used in the route and as the bold header text), crdc_id, program_full_description,
// program_external_url, plus the per-program studies list (each row links to Study Details). Returns a null
// `program` for an unknown program_short_name (not an error) so the page can render a not-found state.
export const GET_PROGRAM_DETAIL_QUERY = gql`
  query getProgramDetailQuery($programShortName: String!) {
    program(program_short_name: $programShortName) {
      program_name
      program_short_name
      crdc_id
      program_full_description
      program_external_url
      studies {
        study_short_name
        study_name
      }
    }
  }
`;

// --------------- Curated Host Videos / Program-related Materials content --------------
// Neither section is modeled in the graph (CTDC-2069 is explicit these are curated outside the data model -
// mechanism TBD at implementation), so both are static config here, keyed by program_short_name. Populate as
// real curated content is supplied.
// Shape: { hostVideos: [{ title, description, thumbnail, videoUrl }], materials: [{ title, url }] }
export const curatedProgramDetailContent = {
  NCTN: {
    hostVideos: [
      {
        title: 'dbGaP: Apply for Controlled Access Data',
        description: 'How to request access to controlled-access data through dbGaP.',
        thumbnail: 'https://img.youtube.com/vi/m0xp_cCO7kA/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=m0xp_cCO7kA',
      },
    ],
    materials: [],
  },
};

// --------------- Curated Initiatives (no-program variant) content --------------
export const initiativesDetailContent = {
  name: 'Initiatives',
  hostVideos: [],
  materials: [],
};

// --------------- Empty-state copy --------------
export const noVideosText = (label) => `No videos are currently available for this ${label}.`;
export const noMaterialsText = (label) => `No materials are currently available for this ${label}.`;
