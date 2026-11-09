import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProgramDetailsView from './programDetailsView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_PROGRAM_DETAIL_QUERY } from '../../bento/programDetailsData';
import { GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY } from '../../bento/portfolioData';

const ProgramDetailsController = ({ match }) => {
  const { programShortName } = match.params;
  const isInitiatives = !programShortName;

  const {
    loading: isProgramLoading, error: programError, data: programData,
  } = useQuery(GET_PROGRAM_DETAIL_QUERY, {
    variables: { programShortName: programShortName ? [programShortName] : [] },
    skip: isInitiatives,
  });
  const {
    loading: isUnaffiliatedLoading, error: unaffiliatedError, data: unaffiliatedData,
  } = useQuery(GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY, {
    skip: !isInitiatives,
  });

  if (isProgramLoading || isUnaffiliatedLoading) {
    return <CircularProgress />;
  }

  const error = programError || unaffiliatedError;
  if (error) {
    return (
      <Typography variant="headline" color="error" size="sm">
        {`An error has occurred in loading the Program Details page: ${error.message}`}
      </Typography>
    );
  }

  if (isInitiatives) {
    return (
      <ProgramDetailsView
        isInitiatives
        unaffiliatedStudies={unaffiliatedData?.getAllPrograms?.[0]?.studies || []}
      />
    );
  }

  const program = programData?.getAllPrograms?.[0];
  return (
    <ProgramDetailsView program={program} notFound={!program} />
  );
};

export default ProgramDetailsController;
