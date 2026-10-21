import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import PortfolioView from './portfolioView';
import { Typography } from '../../components/Wrappers/Wrappers';
import {
  GET_PORTFOLIO_PROGRAMS_QUERY,
  GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY,
} from '../../bento/portfolioData';

const PortfolioController = () => {
  const {
    loading: isProgramsLoading, error: programsError, data: programsData,
  } = useQuery(GET_PORTFOLIO_PROGRAMS_QUERY);
  const {
    loading: isUnaffiliatedLoading, error: unaffiliatedError, data: unaffiliatedData,
  } = useQuery(GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY);

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
      programs={programsData?.getAllPrograms || []}
      unaffiliatedStudies={unaffiliatedData?.getAllStudies || []}
    />
  );
};

export default PortfolioController;
