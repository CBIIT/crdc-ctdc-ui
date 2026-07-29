import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import StatsView from './StatsView';
import { GET_GLOBAL_STATS_DATA_QUERY as STATS_QUERY } from '../../bento/globalStatsData';

const PageSpecificStatsController = ({ studyShortName }) => {
  const variables = React.useMemo(
    () => (studyShortName ? { study_short_name: [studyShortName] } : {}),
    [studyShortName],
  );
  const { loading, error, data } = useQuery(STATS_QUERY, {
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
