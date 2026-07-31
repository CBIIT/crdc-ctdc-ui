import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import CircularProgress from '@material-ui/core/CircularProgress';
import StatsView from './StatsView';

const STUDY_DETAIL_STATS_QUERY = gql`
  query search(
    $study_short_name: [String],
    $files_association: [String],
    $study_association: [String]
  ) {
    searchParticipants(study_short_name: $study_short_name) {
      numberOfStudies
      numberOfParticipants
      numberOfDiagnoses
      numberOfTargetedTherapies
      numberOfSpecimens
      numberOfFiles
    }
    filesTabCount: searchParticipants(
      study_short_name: $study_short_name
      association: $files_association
    ) {
      numberOfFiles
    }
    studyFilesTabCount: searchParticipants(
      study_short_name: $study_short_name
      association: $study_association
    ) {
      numberOfStudyFiles
    }
  }
`;

const PageSpecificStatsController = ({ studyShortName }) => {
  const variables = React.useMemo(
    () => (studyShortName ? {
      study_short_name: [studyShortName],
      files_association: ['biospecimen', 'participant'],
      study_association: ['study'],
    } : {}),
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
    return <div role="alert">Failed to load stats for this study.</div>;
  }

  const statsData = {
    ...data?.searchParticipants,
    numberOfFiles: data?.filesTabCount?.numberOfFiles ?? data?.searchParticipants?.numberOfFiles,
    numberOfStudyFiles: data?.studyFilesTabCount?.numberOfStudyFiles ?? data?.searchParticipants?.numberOfStudyFiles,
  };

  return <StatsView data={statsData} />;
};

export default PageSpecificStatsController;
