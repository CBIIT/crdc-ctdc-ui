import React from 'react';
import ProgramDetailsView from './programDetailsView';
import {
  mockPrograms, mockInitiative, mockCuratedContent, mockInitiativesContent,
} from '../../bento/programDetailsMockData';

// Dev-only preview of the Program Details page using the approved Figma content (registered in LayoutView only
// when NODE_ENV is not "production"). /program-details-mock/NCTN, /NCI-MATCH, or no param for Initiatives.
const ProgramDetailsMockPage = ({ match }) => {
  const { programShortName } = match.params;

  if (!programShortName) {
    return (
      <ProgramDetailsView
        isInitiatives
        unaffiliatedStudies={mockInitiative.unaffiliatedStudies}
        studyRows={mockInitiative.studyRows}
        curatedContent={mockCuratedContent}
        initiativesContent={mockInitiativesContent}
      />
    );
  }

  const program = mockPrograms[programShortName];
  return (
    <ProgramDetailsView
      program={program}
      notFound={!program}
      studyRows={program?.studyRows}
      curatedContent={mockCuratedContent}
      initiativesContent={mockInitiativesContent}
    />
  );
};

export default ProgramDetailsMockPage;
