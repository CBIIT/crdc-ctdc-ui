import gql from "graphql-tag";

// --------------- GraphQL query - Retrieve all participant IDs for autocomplete --------------
export const GET_ALL_PARTICIPANT_IDS = gql`
  query participantOverview($first: Int, $offset: Int) {
    participantOverview(first: $first, offset: $offset) {
      participant_id
    }
  }
`;

// --------------- GraphQL query - Match participant IDs from uploaded list --------------
export const GET_PARTICIPANT_IDS_BY_LIST = gql`
  query participantOverview($participant_id: [String]) {
    participantOverview(participant_id: $participant_id) {
      participant_id
      study_short_name
    }
  }
`;




