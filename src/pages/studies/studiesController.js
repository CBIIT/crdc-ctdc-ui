import React from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Studies from './studiesView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_STUDY_DATA_QUERY } from '../../bento/studiesData';
import { enrichStudyRows, useRepositoryLookup } from './studyRows';

const studiesContainer = () => {
  // Portfolio's Associated Studies links pass affiliated study_short_name values via ?studyIds= (CTDC-2064)
  const location = useLocation();

  // Fetch study data
  const { loading: isDataLoading, error: dataError, data } = useQuery(GET_STUDY_DATA_QUERY);
  const repositoryLookup = useRepositoryLookup();

  // Handle loading state
  if (isDataLoading) {
    return <CircularProgress />;
  }
  if (dataError || !Array.isArray(data?.getAllStudies)) {
    const errorMessage = dataError
      ? `An error has occurred in loading studies: ${dataError.message}`
      : 'Study data is unavailable.';
    return (
      <Typography variant="headline" color="error" size="sm">
        {errorMessage}
      </Typography>
    );
  }

  const updatedData = {
    ...data,
    getAllStudies: enrichStudyRows(data.getAllStudies, repositoryLookup),
  };

  const studyIdsParam = new URLSearchParams(location.search).get('studyIds');
  if (studyIdsParam) {
    const studyIds = new Set(studyIdsParam.split(','));
    updatedData.getAllStudies = (updatedData.getAllStudies || []).filter(
      (study) => studyIds.has(study.study_short_name),
    );
  }

  // Render the Studies component
  return <Studies data={updatedData}/>;
};

export default studiesContainer;
