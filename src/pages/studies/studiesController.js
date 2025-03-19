import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import Studies from './studiesView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_STUDY_DATA_QUERY } from '../../bento/studiesData';

const studiesContainer = () => {
  const { loading, error, data } = useQuery(GET_STUDY_DATA_QUERY);
  
  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="headline" color="error" size="sm">{error ? `An error has occurred in loading stats component: ${error}` : 'Recieved wrong data'}</Typography>;

  const updatedData = {
    ...data,
    getAllStudies: data?.getAllStudies?.map(study => ({
      ...study,
      numberOfPublication: 0, // TODO: Fetch this value from the backend API when it's implemented
    })),
  };

  return <Studies data={updatedData} />;
};

export default studiesContainer;
