import React from 'react';
import StudyFilesView from './StudyFilesView';

const StudyFilesController = ({ studyDataFiles = [] }) => (
  <StudyFilesView studyDataFiles={studyDataFiles} />
);

export default StudyFilesController;
