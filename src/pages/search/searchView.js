import React, { useEffect, useState } from 'react';
import { withStyles, Box, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {
  SearchBarGenerator, SearchResultsGenerator, countValues,
} from '@bento-core/global-search';
import styles from './styles';
import {
  SEARCH_PAGE_DATAFIELDS, SEARCH_PAGE_KEYS,
  queryCountAPI, queryResultAPI, queryAutocompleteAPI,
} from '../../bento/search';
import { ParticipantCard, BiospecimenCard, AboutCard, ValueCard } from './Cards';

/**
 * Determine the correct datafield and offset for the All tab based
 * off of the current offset and the number of results for each datafield
 *
 * @param {string} searchText
 * @param {number} calcOffset
 * @param {number} pageSize
 * @param {boolean} isPublic
 */
async function getAllQueryField(searchText, calcOffset, pageSize, isPublic) {
  const searchResp = await queryCountAPI(searchText, isPublic);
  const custodianConfigForTabData = isPublic ? [{ countField: 'about_count', nameField: 'about_page' }]
    : [{ countField: 'participant_count', nameField: 'participants' },
      { countField: 'biospecimen_count', nameField: 'biospecimens' },
      { countField: 'model_count', nameField: 'model' },
      { countField: 'about_count', nameField: 'about_page' }];

  let acc = 0;
  const mapCountAndName = custodianConfigForTabData.map((obj) => {
    acc += searchResp[obj.countField];
    return { ...obj, value: acc };
  });

  // Create filter for next Query
  const filter = mapCountAndName.filter((obj) => obj.value > calcOffset)[0];
  const filterForOffset = mapCountAndName.filter((obj) => obj.value <= calcOffset);
  const val = filterForOffset.length === 0
    ? 0
    : filterForOffset[filterForOffset.length - 1].value;

  if (filter !== undefined) {
    return {
      datafieldValue: filter.nameField,
      offsetValue: (Math.abs(calcOffset - val) / pageSize) * pageSize,
    };
  }

  return { datafieldValue: isPublic ? 'about_page' : 'participants', offsetValue: 0 };
}

/**
 * Wrapper for the queryResultAPI function to get the All tab's data
 *
 * @param {string} search the search input value
 * @param {number} offset the offset value
 * @param {number} pageSize the pagination page size
 * @param {boolean} isPublic whether to use a public or private query
 */
async function queryAllAPI(search, offset, pageSize, isPublic) {
  const {
    datafieldValue, offsetValue,
  } = await getAllQueryField(search, offset, pageSize, isPublic);

  const input = {
    input: search,
    first: pageSize,
    offset: offsetValue,
  };

  return queryResultAPI(datafieldValue, input, isPublic);
}

function searchView(props) {
  const {
    classes, searchparam = '',
    isSignedIn, isAuthorized, publicAccessEnabled,
  } = props;

  const history = useHistory();
  const [searchText, setSearchText] = useState(searchparam);
  const [searchCounts, setSearchCounts] = useState([]);

  const authCheck = () => isAuthorized || publicAccessEnabled;

  /**
   * Handle the tab selection change event, and redirect the user
   * to the login/request page if they are not authorized.
   *
   * @param {object} event change event
   * @param {*} newTab new tab value
   * @returns void
   */
  const onTabChange = (event, newTab) => {
    const activeVal = newTab.split('-')[0];

    if (activeVal === 'inactive') {
      if (isSignedIn && !isAuthorized) {
        history.push(`/request?redirect=/search/${searchText}`);
        return;
      }
      history.push(`/login?redirect=/search/${searchText}`);
    }
  };

  /**
   * Handle the search box input change event
   *
   * @param {string} value
   * @returns void
   */
  const onSearchChange = (value) => {
    if (!value || typeof value !== 'string') { return; }
    if (value === searchText) { return; }
    if (value.trim() === '') { return; }

    queryCountAPI(value, !authCheck()).then((d) => {
      setSearchText(value);
      setSearchCounts(d);
      history.push(`/search/${value}`);
    });
  };

  /**
   * Perform the search bar auto complete search
   *
   * @param {object} _config search bar configuration
   * @param {string} value search text
   * @param {string} reason reason for the function call
   */
  const getSearchSuggestions = async (_config, value, reason) => {
    if (!value || typeof value !== 'string') {
      setSearchText('');
      setSearchCounts([]);
      if (reason === 'clear') {
        history.push('/search');
      }
      return [];
    }
    if (value.trim() === '') { return []; }

    const authed = authCheck();
    const res = await queryAutocompleteAPI(value, !authed);
    const mapOption = (authed ? SEARCH_PAGE_KEYS.private : SEARCH_PAGE_KEYS.public).map(
      (key, index) => res[key].map(
        (id) => (id[authed
          ? SEARCH_PAGE_DATAFIELDS.private[index]
          : SEARCH_PAGE_DATAFIELDS.public[index]]),
      ),
    );
    const option = mapOption.length > 0
      ? mapOption.reduce((acc = [], iterator) => [...acc, ...iterator]) : [];

    return [...[value.toUpperCase()], ...option];
  };

  /**
   * Helper function to get the data for a given tab
   *
   * @param {string} field the datafield property to search
   * @param {number} pageSize the pagination page size
   * @param {number} currentPage the current page offset
   */
  const getTabData = async (field, pageSize, currentPage) => {
    const isPublic = !authCheck();

    // Handle the 'All' tab search separately
    if (field === 'all') {
      const count = isPublic ? searchCounts.about_count : countValues(searchCounts);
      let data = await queryAllAPI(searchText, (currentPage - 1) * pageSize, pageSize, isPublic);

      // If the current set of data is less than the page size,
      // we need to query the next datafield for it's data
      if (data && (data.length !== pageSize)) {
        let apiQueries = 0;
        let calcOffset2 = (currentPage - 1) * pageSize + data.length;

        // eslint-disable-next-line max-len
        while (apiQueries < 5 && data.length !== count && calcOffset2 < count && data.length !== pageSize) {
          // eslint-disable-next-line no-await-in-loop
          const data2 = await queryAllAPI(searchText, calcOffset2, pageSize, isPublic);
          data = [...data, ...data2];
          calcOffset2 = (currentPage - 1) * pageSize + data.length;
          apiQueries += 1;
        }
      }

      return (data || []).slice(0, pageSize);
    }

    // Handle all of the other tabs
    const input = {
      input: searchText,
      first: pageSize,
      offset: (currentPage - 1) * pageSize,
    };
    const data = await queryResultAPI(field, input, isPublic);
    return (data || []).slice(0, pageSize);
  };

  const { SearchBar } = SearchBarGenerator({
    classes,
    config: {
      placeholder: 'e.g. colon, MSB-01068, panitumimab, FFPE, CMB, gender',
      iconType: 'image',
      maxSuggestions: 0,
      minimumInputLength: 0,
    },
    functions: {
      onChange: onSearchChange,
      getSuggestions: getSearchSuggestions,
    },
  });

  const { SearchResults } = SearchResultsGenerator({
    classes,
    config: {
      resultCardMap: {
        participants: ParticipantCard,
        biospecimens: BiospecimenCard,
        property: ValueCard,
        node: ValueCard,
        value: ValueCard,
        about: AboutCard,
      },
      showFilterBy: true,
    },
    functions: {
      onTabChange,
      getTabData,
    },
    tabs: [
      {
        name: 'All',
        field: 'all',
        classes: {
          root: classes.allButton,
          wrapper: classes.tabColor,
          totalResults: classes.totalResults,
          totalCount: classes.totalCount,
          subsection: classes.subsection,
          subsectionBody: classes.subsectionBody,
          paginationContainer: classes.paginationContainer,
          noData: classes.noData,
        },
        count: (!authCheck() ? searchCounts.about_count : countValues(searchCounts)) || 0,
        value: '1',
      },
      {
        name: 'Participants',
        field: 'participants',
        classes: {
          root: classes.participantButton,
          wrapper: classes.tabColor,
          totalResults: classes.totalResults,
          totalCount: classes.totalCount,
          subsection: classes.subsection,
          subsectionBody: classes.subsectionBody,
          paginationContainer: classes.paginationContainer,
          noData: classes.noData,
        },
        count: searchCounts.participant_count || 0,
        value: `${!authCheck() ? 'inactive-' : ''}2`,
      },
      {
        name: 'Biospecimens',
        field: 'biospecimens',
        classes: {
          root: classes.biospecimenButton,
          wrapper: classes.tabColor,
          totalResults: classes.totalResults,
          totalCount: classes.totalCount,
          subsection: classes.subsection,
          subsectionBody: classes.subsectionBody,
          paginationContainer: classes.paginationContainer,
          noData: classes.noData,
        },
        count: searchCounts.biospecimen_count || 0,
        value: `${!authCheck() ? 'inactive-' : ''}3`,
      },
      {
        name: 'General',
        field: 'about_page',
        classes: {
          root: classes.aboutButton,
          wrapper: classes.tabColor,
          totalResults: classes.totalResults,
          totalCount: classes.totalCount,
          subsection: classes.subsection,
          subsectionBody: classes.subsectionBody,
          paginationContainer: classes.paginationContainer,
          noData: classes.noData,
        },
        count: searchCounts.about_count || 0,
        value: '4',
      },
      {
        name: 'Model',
        field: 'model',
        classes: {
          root: classes.modelButton,
          wrapper: classes.tabColor,
          totalResults: classes.totalResults,
          totalCount: classes.totalCount,
          subsection: classes.subsection,
          subsectionBody: classes.subsectionBody,
          paginationContainer: classes.paginationContainer,
          noData: classes.noData,
        },
        count: searchCounts.model_count || 0,
        value: `${!authCheck() ? 'inactive-' : ''}5`,
      },
    ],
  });

  useEffect(() => {
    if (searchparam.trim() === '') {
      return;
    }

    queryCountAPI(searchparam, !authCheck()).then((d) => {
      setSearchCounts(d);
    });
  }, []);

  return (
    <>
      <Grid container direction="column" alignItems="center" justifyContent="center" className={classes.heroArea}>
        <Grid item>
          <h2 className={classes.searchTitle}>Search Clinical and Translational Data Commons</h2>
        </Grid>
        <Grid item>
          <SearchBar value={searchText} clearable={!false}/>
        </Grid>
      </Grid>

      <div className={classes.bodyContainer}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <SearchResults searchText={searchText} />
        </Box>
      </div>
    </>
  );
}

export default withStyles(styles)(searchView);
