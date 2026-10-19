import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProgramDetailsView from './programDetailsView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_PROGRAM_DETAIL_QUERY } from '../../bento/programDetailsData';
import { GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY } from '../../bento/portfolioData';
import { mockPrograms, mockUnaffiliatedStudies } from '../../bento/portfolioMockData';

// TEMPORARY scaffolding-preview flag - mirrors Portfolio's (CTDC-2064) approach while the live CTDC-2069
// program-detail query 404s. Flip to false (and drop the portfolioMockData import) once the backend ships -
// see /memories/repo/program-details-ctdc-2065.md.
const USE_PROGRAM_DETAILS_MOCK_DATA = true;

const ProgramDetailsController = ({ match }) => {
  const { programShortName } = match.params;
  const isInitiatives = !programShortName;

  const {
    loading: isProgramLoading, error: programError, data: programData,
  } = useQuery(GET_PROGRAM_DETAIL_QUERY, {
    variables: { programShortName },
    skip: USE_PROGRAM_DETAILS_MOCK_DATA || isInitiatives,
  });
  const {
    loading: isUnaffiliatedLoading, error: unaffiliatedError, data: unaffiliatedData,
  } = useQuery(GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY, {
    skip: USE_PROGRAM_DETAILS_MOCK_DATA || !isInitiatives,
  });

  if (USE_PROGRAM_DETAILS_MOCK_DATA) {
    if (isInitiatives) {
      return <ProgramDetailsView isInitiatives unaffiliatedStudies={mockUnaffiliatedStudies} />;
    }
    const program = mockPrograms.find((p) => p.program_short_name === programShortName);
    return <ProgramDetailsView program={program} notFound={!program} />;
  }

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
      <ProgramDetailsView isInitiatives unaffiliatedStudies={unaffiliatedData?.unaffiliatedStudies || []} />
    );
  }

  return (
    <ProgramDetailsView program={programData?.program} notFound={!programData?.program} />
  );
};

export default ProgramDetailsController;
