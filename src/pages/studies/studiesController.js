import React from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Studies from './studiesView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_STUDY_DATA_INTEROPS_QUERY, GET_STUDY_DATA_QUERY } from '../../bento/studiesData';

// TODO(CTDC-2175): Temporary fallback interop data for studies not yet loaded into OpenSearch. Remove once the missing studies are indexed.
const INTEROP_FALLBACK = {
  NCT00980460: {
    unique_repository: ['TCIA']
  },
};

const studiesContainer = () => {
  // Portfolio's Associated Studies links pass affiliated study_short_name values via ?studyIds= (CTDC-2064)
  const location = useLocation();

  // Fetch study data
  const { loading: isDataLoading, error: dataError, data } = useQuery(GET_STUDY_DATA_QUERY);

  // Fetch interOp data
  const { loading: isInterOpLoading, error: interOpError, data: interOpData } = useQuery(GET_STUDY_DATA_INTEROPS_QUERY);

  // Handle loading state
  if (isDataLoading || isInterOpLoading) {
    return <CircularProgress />;
  }
  // Ensure data and interOpData are available
  if (!data || !interOpData) {
    console.warn("Data or interOpData is missing.");
    return (
      <CircularProgress />
    );
  }

  // Handle error state
  if (dataError || interOpError) {
    const errorMessage = `An error has occurred in loading stats component: ${dataError.message}`
    return (
      <Typography variant="headline" color="error" size="sm">
        {errorMessage}
      </Typography>
    );
  }

  // Transform and combine data
  const interOpStudiesMap = (interOpData?.getInteropData || []).reduce((acc, entry) => {
    const s = entry?.data?.getAllStudies;
    if (s?.study_id) acc[s.study_id] = s;
    return acc;
  }, {});
  const updatedData = {
    ...data,
    getAllStudies: data?.getAllStudies?.map((study) => {
      const interOpStudy = interOpStudiesMap[study.study_id] || INTEROP_FALLBACK[study.study_id];
      return {
        ...study,
        numberOfPublications: 0, // TODO: Fetch this value from the backend API when it's implemented
        unique_repository: interOpStudy?.unique_repository || [],
      };
    }),
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
