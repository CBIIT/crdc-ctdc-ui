import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import Studies from './studiesView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_STUDY_DATA_INTEROPS_QUERY, GET_STUDY_DATA_QUERY } from '../../bento/studiesData';

const studiesContainer = () => {
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
  const updatedData = {
    ...data,
    getAllStudies: data?.getAllStudies?.map((study) => ({
      ...study,
      numberOfPublications: 0, // TODO: Fetch this value from the backend API when it's implemented
      image_collection:
        interOpData?.getInteropData?.[0]?.data?.getAllStudies?.image_collection || [],
      unique_repository:
        interOpData?.getInteropData?.[0]?.data?.getAllStudies?.unique_repository || [],
    })),
  };
  
  // Render the Studies component
  return <Studies data={updatedData}/>;
};

export default studiesContainer;
