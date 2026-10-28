import React, { useEffect, useMemo, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { connect } from 'react-redux';
import { Button, CircularProgress, LinearProgress } from '@material-ui/core';
import { getFilters } from '@bento-core/facet-filter';
import DashTemplateView from './DashTemplateView';
import { DASHBOARD_QUERY_NEW, THERAPY_QUERY } from '../../bento/dashboardTabData';
import { generateValidTherapyCombinations, updateTherapyFacetData } from './utils';

export const buildParticipantIdFilter = (localFindUpload, localFindAutocomplete) => [...new Set([
  ...(localFindUpload || []).map((obj) => obj.subject_id),
  ...(localFindAutocomplete || []).map((obj) => obj.title),
])];

const THERAPY_FILTER = 'therapy_string';
const VOCABULARY_FIELD = 'filterParticipantCountBySingleTherapyCombinationForFacet';

const useDashData = ({ filterState, localFindUpload, localFindAutocomplete }) => {
  const client = useApolloClient();
  const [vocabulary, setVocabulary] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const baseFilters = useMemo(() => ({
    ...getFilters(filterState),
    participant_id: buildParticipantIdFilter(localFindUpload, localFindAutocomplete),
  }), [filterState, localFindUpload, localFindAutocomplete]);
  const requestKey = JSON.stringify(baseFilters);
  // This aggregation excludes the name filter itself. Other filters change its vocabulary.
  const vocabularyKey = JSON.stringify(Object.fromEntries(
    Object.entries(baseFilters).filter(([key]) => key !== THERAPY_FILTER),
  ));
  const vocabularyReady = vocabulary?.key === vocabularyKey;

  useEffect(() => {
    if (vocabularyReady) return undefined;
    let active = true;
    setError(null);
    client.query({ query: THERAPY_QUERY, variables: baseFilters })
      .then(({ data }) => {
        const buckets = data?.searchParticipants?.[VOCABULARY_FIELD];
        if (!Array.isArray(buckets)) throw new Error('Missing Therapy combination vocabulary');
        if (active) setVocabulary({ key: vocabularyKey, buckets });
      })
      .catch(() => {
        if (active) setError({ key: requestKey, message: 'Unable to load Therapy filters.' });
      });
    return () => { active = false; };
  }, [client, baseFilters, vocabularyKey, vocabularyReady, requestKey, retryCount]);

  // Type/Category use backend any-value matching and pass through unchanged.
  // Only selected names need expansion into complete therapy_string combinations.
  const activeFilters = useMemo(() => {
    if (!vocabularyReady || !baseFilters[THERAPY_FILTER]) return baseFilters;
    return {
      ...baseFilters,
      [THERAPY_FILTER]: generateValidTherapyCombinations(
        baseFilters, THERAPY_FILTER, vocabulary.buckets,
      ),
    };
  }, [baseFilters, vocabulary, vocabularyReady]);

  // Restored names are expanded only after the current vocabulary is available.
  useEffect(() => {
    if (!vocabularyReady) return undefined;
    let active = true;
    setError(null);
    client.query({
      query: DASHBOARD_QUERY_NEW,
      variables: {
        ...activeFilters,
        files_association: ['biospecimen', 'participant'],
        study_association: ['study'],
      },
    }).then(({ data }) => {
      const search = data?.searchParticipants;
      if (!search || !Array.isArray(search.participantCountBySingleTherapyCombination)
        || !Array.isArray(search.filterParticipantCountBySingleTherapyCombination)) {
        throw new Error('Missing Therapy dashboard data');
      }
      if (active) {
        setDashboard({
          key: requestKey,
          filters: activeFilters,
          data: {
            ...search,
            numberOfFiles: data.filesTabCount?.numberOfFiles ?? search.numberOfFiles,
            numberOfStudyFiles: data.studyFilesTabCount?.numberOfStudyFiles ?? search.numberOfStudyFiles,
            ...updateTherapyFacetData(search, 'participantCountBySingleTherapyCombination'),
            ...updateTherapyFacetData(search, 'filterParticipantCountBySingleTherapyCombination'),
          },
        });
      }
    }).catch(() => {
      if (active) setError({ key: requestKey, message: 'Unable to load Explore results.' });
    });
    return () => { active = false; };
  }, [client, activeFilters, vocabularyReady, requestKey, retryCount]);

  return {
    dashData: dashboard?.data,
    // Keep table requests and counts on the last completed cohort during refresh.
    activeFilters: dashboard?.filters || activeFilters,
    loading: !vocabularyReady || dashboard?.key !== requestKey,
    error: error?.key === requestKey ? error.message : null,
    retry: () => setRetryCount((count) => count + 1),
  };
};

const DashTemplateController = (props) => {
  const { dashData, activeFilters, loading, error, retry } = useDashData(props);
  const errorBanner = error && (
    <div role="alert">
      <p>{error}</p>
      <Button onClick={retry}>Retry</Button>
    </div>
  );
  if (!dashData) return errorBanner || <CircularProgress />;
  return (
    <>
      {errorBanner}
      {loading && !error && <LinearProgress aria-label="Updating Explore results" />}
      <DashTemplateView {...props} dashData={dashData} activeFilters={activeFilters} />
    </>
  );
};

const mapStateToProps = (state) => ({
  filterState: state.statusReducer.filterState,
  localFindUpload: state.localFind.upload,
  localFindAutocomplete: state.localFind.autocomplete,
});

export default connect(mapStateToProps, null)(DashTemplateController);
