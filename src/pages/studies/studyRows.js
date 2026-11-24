import { useEffect, useState } from 'react';
import env from '../../utils/env';
import { getImageCollectionRepositories, loadRepositoryConfig } from '../../utils/repositories';

export const useRepositoryLookup = () => {
  const [repositoryLookup, setRepositoryLookup] = useState(() => new Map());

  useEffect(() => {
    let active = true;
    loadRepositoryConfig(env.REACT_APP_STATIC_CONTENT_URL)
      .then((lookup) => {
        if (active) setRepositoryLookup(lookup);
      })
      .catch((error) => {
        if (active) console.warn('Repository configuration unavailable; displaying source names.', error);
      });
    return () => { active = false; };
  }, []);

  return repositoryLookup;
};

export const enrichStudyRows = (studies, repositoryLookup) => (studies || []).map((study) => {
  const repositories = getImageCollectionRepositories(study?.image_collection, repositoryLookup);
  return {
    ...study,
    numberOfPublications: 0,
    unique_repository: repositories.map((repository) => repository.repository_name),
    repositories,
  };
});
