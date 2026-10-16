import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import PortfolioView from './portfolioView';
import { Typography } from '../../components/Wrappers/Wrappers';
import {
  GET_PORTFOLIO_PROGRAMS_QUERY,
  GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY,
} from '../../bento/portfolioData';
import { mockPrograms, mockUnaffiliatedStudies } from '../../bento/portfolioMockData';

// TEMPORARY scaffolding-preview flag - the live queries 404 until CTDC-2066/2067 ship. Flip to false (and
// delete portfolioMockData.js) once the backend program/Initiatives queries are live.
const USE_PORTFOLIO_MOCK_DATA = true;

const PortfolioController = () => {
  const {
    loading: isProgramsLoading, error: programsError, data: programsData,
  } = useQuery(GET_PORTFOLIO_PROGRAMS_QUERY, { skip: USE_PORTFOLIO_MOCK_DATA });
  const {
    loading: isUnaffiliatedLoading, error: unaffiliatedError, data: unaffiliatedData,
  } = useQuery(GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY, { skip: USE_PORTFOLIO_MOCK_DATA });

  if (USE_PORTFOLIO_MOCK_DATA) {
    return <PortfolioView programs={mockPrograms} unaffiliatedStudies={mockUnaffiliatedStudies} />;
  }

  if (isProgramsLoading || isUnaffiliatedLoading) {
    return <CircularProgress />;
  }

  const error = programsError || unaffiliatedError;
  if (error) {
    return (
      <Typography variant="headline" color="error" size="sm">
        {`An error has occurred in loading the Portfolio page: ${error.message}`}
      </Typography>
    );
  }

  return (
    <PortfolioView
      programs={programsData?.program || []}
      unaffiliatedStudies={unaffiliatedData?.unaffiliatedStudies || []}
    />
  );
};

export default PortfolioController;
