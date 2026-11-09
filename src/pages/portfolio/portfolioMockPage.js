import React from 'react';
import PortfolioView from './portfolioView';
import {
  mockPrograms, mockUnaffiliatedStudies, mockCuratedContent, mockInitiativesContent,
} from '../../bento/portfolioMockData';

// Dev-only preview of the Portfolio page using the approved Figma content (registered in LayoutView only when
// NODE_ENV is not "production").
const PortfolioMockPage = () => (
  <PortfolioView
    programs={mockPrograms}
    unaffiliatedStudies={mockUnaffiliatedStudies}
    curatedContent={mockCuratedContent}
    initiativesContent={mockInitiativesContent}
  />
);

export default PortfolioMockPage;
