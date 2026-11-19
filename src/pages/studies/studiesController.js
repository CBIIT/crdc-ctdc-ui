import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import Studies from './studiesView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_STUDY_DATA_QUERY } from '../../bento/studiesData';
import env from '../../utils/env';
import { getImageCollectionRepositories, loadRepositoryConfig } from '../../utils/repositories';

const studiesContainer = () => {
  // Fetch study data
  const { loading: isDataLoading, error: dataError, data } = useQuery(GET_STUDY_DATA_QUERY);
  const [repositoryLookup, setRepositoryLookup] = useState(() => new Map());

  useEffect(() => {
    let active = true;
    loadRepositoryConfig(env.REACT_APP_STATIC_CONTENT_URL)
      .then((lookup) => {
        if (active) setRepositoryLookup(lookup);
      })
      .catch((error) => {
        // Keep the study data visible, with source repository names and no links.
        if (active) console.warn('Repository configuration unavailable; displaying source names.', error);
      });
    return () => { active = false; };
  }, []);

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

  // Resolve parent repository display names and URLs using external static content.
  const updatedData = {
    ...data,
    getAllStudies: data.getAllStudies.map((study) => {
      const repositories = getImageCollectionRepositories(study?.image_collection, repositoryLookup);
      return {
        ...study,
        numberOfPublications: 0, // TODO: Fetch this value from the backend API when it's implemented
        unique_repository: repositories.map((repository) => repository.repository_name),
        repositories,
      };
    }),
  };

  // Render the Studies component
  return <Studies data={updatedData}/>;
};

export default studiesContainer;
