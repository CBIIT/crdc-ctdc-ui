import gql from 'graphql-tag';
import client from '../utils/graphqlClient';

// --------------- Icons configuration --------------
// Ideal size for programListingIcon is 100x100 px
// Ideal size for externalLinkIcon is 16x16 px
export const programListingIcon = {
  src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/programIcon.svg',
  alt: 'Bento program logo',
};

/** certain search data items */
/** used by the Global Search header autocomplete */
export const SEARCH_KEYS = {
  public: [],
  private: ['gs_list'],
};

export const SEARCH_DATAFIELDS = {
  public: [],
  private: ['autocomplete_list'],
};

/** used by the Global Search page results */
export const SEARCH_PAGE_KEYS = {
  private: [...SEARCH_KEYS.private, 'model_search'],
  public: [],
};

export const SEARCH_PAGE_DATAFIELDS = {
  public: [],
  private: [...SEARCH_DATAFIELDS.private, 'node'],
};

/** Public search queries */
export const SEARCH_PUBLIC = gql`
    query publicGlobalSearchQuery($input: String) {
        publicGlobalSearch(input: $input) {
            model_count
            about_count
            program_count
            study_count
            subject_count
            sample_count
            file_count
            about_page{
                page
                title
                type
                text
            }
        }
    }
`;

export const SEARCH_PAGE_RESULT_PROGRAM_PUBLIC = gql`
    query publicGlobalSearchQuery($input: String, $first: Int, $offset: Int) {
        publicGlobalSearchQuery(
            input: $input
            first: $first
            offset: $offset) {
            programs{
                type
                program_id
                program_name
                program_code
            }
        }
    }
`;

export const SEARCH_PAGE_RESULT_ABOUT_PUBLIC = gql`
    query publicGlobalSearch($input: String, $first: Int, $offset: Int){
        publicGlobalSearch(
            input: $input
            first: $first
            offset: $offset
        ) {
            about_page {
                type
                text
                page
                title
            }
        }
    }`;

export const SEARCH_PAGE_RESULTS_PUBLIC = gql`
    query publicGlobalSearch($input: String, $first: Int, $offset: Int){
        publicGlobalSearch(
            input: $input
            first: $first
            offset: $offset
        ) {
            program_count
            model_count
            about_count
            study_count
            subject_count
            sample_count
            file_count
        }
    }
`;

export const SEARCH_PAGE_RESULT_MODEL_PUBLIC = gql`
    query publicGlobalSearch($input: String, $first: Int, $offset: Int){
        publicGlobalSearch(
            input: $input
            first: $first
            offset: $offset
        ) {
            model {
                type
                node_name
                property_name
                property_description
                property_required
                property_type
                value
                highlight
            }
        }
    }
`;

// AutoComplete main Query
export const SEARCH = gql`
  query globalSearch($input: String){
    globalSearch(input: $input) {
      participants {
        subject_id
      }
      biospecimens {
        parent_specimen_id
      }
      gs_list {
        autocomplete_list
      }
      model_search {
        node
      }
    }
  }
`;

export const SEARCH_PAGE_RESULT_PARTICIPANTS = gql`
  query globalSearch($input: String, $first: Int, $offset: Int){
    globalSearch(
      input: $input
      first: $first
      offset: $offset
    ) {
      participants {
        type
        study_short_name
        ctep_disease_term
        stage_of_disease
        sex
        reported_gender
        race
        targeted_therapy
        ethnicity
        subject_id
        age_at_enrollment
      }
    }
  }
`;

export const SEARCH_PAGE_RESULT_BIOSPECIMENS = gql`
  query globalSearch($input: String, $first: Int, $offset: Int){
    globalSearch(
      input: $input
      first: $first
      offset: $offset
    ) {
      biospecimens {
        type
        study_short_name
        parent_specimen_id
        subject_id
        ctep_disease_term
        parent_specimen_type
        tissue_category
        anatomical_collection_site
        assessment_timepoint
      }
    }
  }
`;

export const SEARCH_PAGE_RESULT_MODEL = gql`
    query globalSearch($input: String, $first: Int, $offset: Int){
        globalSearch(
            input: $input
            first: $first
            offset: $offset
        ) {
            model {
                type
                node_name
                property_name
                property_description
                property_required
                property_type
                value
                highlight
            }
        }
    }
`;

export const SEARCH_PAGE_RESULT_ABOUT = gql`
  query globalSearch($input: String, $first: Int, $offset: Int){
    globalSearch(
      input: $input
      first: $first
      offset: $offset
    ) {
        about_page {
          type
          text
          page
          title
        }
    }
  }
`;

export const SEARCH_PAGE_RESULTS = gql`
  query globalSearch($input: String, $first: Int, $offset: Int){
    globalSearch(
      input: $input
      first: $first
      offset: $offset
    ) {
        participant_count
        biospecimen_count
        model_count
        about_count
    }
  }
`;

/**
 * Maps a datafield to the correct search query
 *
 * @param {string} field datatable field name
 * @param {boolean} isPublic whether the search is public or not
 */
export function getResultQueryByField(field, isPublic) {
  switch (field) {
    case 'all':
      return isPublic ? SEARCH_PUBLIC : SEARCH_PAGE_RESULT_PARTICIPANTS;
    case 'participants':
      return SEARCH_PAGE_RESULT_PARTICIPANTS;
    case 'biospecimens':
      return SEARCH_PAGE_RESULT_BIOSPECIMENS;
    case 'model':
      return SEARCH_PAGE_RESULT_MODEL;
    case 'about_page':
      return isPublic ? SEARCH_PAGE_RESULT_ABOUT_PUBLIC : SEARCH_PAGE_RESULT_ABOUT;
    default:
      return SEARCH_PAGE_RESULT_PARTICIPANTS;
  }
}

/**
 * Query the backend API for autocomplete results
 *
 * @param {object} inputValue search text
 * @param {boolean} isPublic is the search public or private
 */
export async function queryAutocompleteAPI(inputValue, isPublic) {
  const data = await client.query({
    query: isPublic ? SEARCH_PUBLIC : SEARCH,
    variables: {
      input: inputValue,
    },
    context: {
      clientName: isPublic ? 'publicService' : '',
    },
  })
    .then((result) => (isPublic ? result.data.publicGlobalSearch : result.data.globalSearch))
    .catch(() => []);

  return data;
}

/**
 * Query the backend API for the search result counts by search string
 *
 * @param {string} inputValue search text
 * @param {boolean} isPublic whether to use the public service or not
 */
export async function queryCountAPI(inputValue, isPublic) {
  const data = await client.query({
    query: isPublic ? SEARCH_PAGE_RESULTS_PUBLIC : SEARCH_PAGE_RESULTS,
    variables: {
      input: inputValue,
    },
    context: {
      clientName: isPublic ? 'publicService' : '',
    },
  })
    .then((result) => (isPublic ? result.data.publicGlobalSearch : result.data.globalSearch))
    .catch(() => {});

  return data;
}

/**
 * Query the backend API for the search results by datafield
 *
 * @param {string} datafield
 * @param {object} input search query variable input
 * @param {boolean} isPublic is the search public or private
 */
export async function queryResultAPI(datafield, input, isPublic) {
  const data = await client.query({
    query: getResultQueryByField(datafield, isPublic),
    variables: input,
    context: {
      clientName: isPublic ? 'publicService' : '',
    },
  })
    .then((result) => (isPublic ? result.data.publicGlobalSearch : result.data.globalSearch))
    .catch(() => []);

  return data[datafield] || [];
}
