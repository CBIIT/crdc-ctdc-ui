import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import CircularProgress from '@material-ui/core/CircularProgress';
import StatsView from './StatsView';

const STUDY_DETAIL_STATS_QUERY = gql`
  query search($study_short_name: [String]) {
    searchParticipants(study_short_name: $study_short_name) {
      numberOfStudies
      numberOfParticipants
      numberOfDiagnoses
      numberOfTargetedTherapies
      numberOfSpecimens
      numberOfFiles
    }
  }
`;

const PageSpecificStatsController = ({ studyShortName }) => {
  const variables = React.useMemo(
    () => (studyShortName ? { study_short_name: [studyShortName] } : {}),
    [studyShortName],
  );
  const { loading, error, data } = useQuery(STUDY_DETAIL_STATS_QUERY, {
    variables,
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error('Failed to load study-scoped stats.', error);
    return <CircularProgress />;
  }

  const statsData = data?.searchParticipants || {};

  return <StatsView data={statsData} />;
};

export default PageSpecificStatsController;
