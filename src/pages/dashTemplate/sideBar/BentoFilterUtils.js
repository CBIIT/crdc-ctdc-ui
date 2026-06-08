
import { clearAllAndSelectFacet, clearAllFilters } from '@bento-core/facet-filter';
import {
  GET_ALL_PARTICIPANT_IDS, GET_PARTICIPANT_IDS_BY_LIST,
} from '../../../bento/localSearchData';
import store from '../../../store';
import client from '../../../utils/graphqlClient';

export const getFacetValues = (facet, facetValue) => ({[facet]: { [facetValue]: true }});

/**
* set filter item from Arm/Program details page (NUMBER OF CASES: button)
*/
export const onClearAllAndSelectFacetValue = (facet, facetValue) => {
  const filterValue = getFacetValues(facet, facetValue );
  store.dispatch(clearAllAndSelectFacet(filterValue));
}

/**
* set filter item to inital state
*/
export const onClearAllFilters = (facet, facetValue) => {
  store.dispatch(clearAllFilters());
}

/**
 * Get list of all available participant IDs for autocomplete
 *
 * @async
 * @returns {Promise<object>} object with participantIds array
 */
export async function getAllIds() {
  const result = await client
    .query({
      query: GET_ALL_PARTICIPANT_IDS,
      variables: { first: 10000, offset: 0 },
    })
    .then((res) => ({
      participantIds: (res.data.participantOverview || []).map((p) => p.participant_id),
    }))
    .catch(() => ({ participantIds: [] }));
  return result;
}

/**
 * Get list of matching participants for a list of IDs
 *
 * @param {string[]} participantIdsArray
 * @returns {Promise<object[]>} matched participants with subject_id and program_id fields
 */
export async function getAllSubjectIds(participantIdsArray) {
  const allids = await client
    .query({
      query: GET_PARTICIPANT_IDS_BY_LIST,
      variables: {
        participant_id: participantIdsArray,
        
      },
    })
    .then((result) => (result.data.participantOverview || []).map((p) => ({
      subject_id: p.participant_id,
      program_id: p.study_short_name,
    })))
    .catch(() => []);
  return allids;
}
