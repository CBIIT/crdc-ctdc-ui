import gql from 'graphql-tag';
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
      {
        // TEMPORARY second entry (same source video) to QA multi-video rendering/independent play state -
        // remove once a second real curated video is supplied.
        title: 'dbGaP: Apply for Controlled Access Data (test video 2)',
        description: 'Duplicate of the first video, used only to verify multiple Host Videos render and play independently.',
        thumbnail: 'https://img.youtube.com/vi/m0xp_cCO7kA/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=m0xp_cCO7kA',
      },
    ],
    materials: [
      {
        title: 'NCTN Program Overview (NCI)',
        url: 'https://www.cancer.gov/research/infrastructure/clinical-trials/nctn',
      },
    ],
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
