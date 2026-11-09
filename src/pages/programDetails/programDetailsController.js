import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProgramDetailsView from './programDetailsView';
import { Typography } from '../../components/Wrappers/Wrappers';
import {
  GET_PROGRAM_DETAIL_QUERY,
  GET_PROGRAM_STUDY_TABLE_QUERY,
  unaffiliatedProgramLabel,
} from '../../bento/programDetailsData';
import { GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY } from '../../bento/portfolioData';
import { GET_STUDY_DATA_INTEROPS_QUERY } from '../../bento/studiesData';
import { mergeInteropData } from '../studies/studyRows';

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
  const {
    loading: isTableLoading, error: tableError, data: tableData,
  } = useQuery(GET_PROGRAM_STUDY_TABLE_QUERY);
  const {
    loading: isInterOpLoading, error: interOpError, data: interOpData,
  } = useQuery(GET_STUDY_DATA_INTEROPS_QUERY);

  if (isProgramLoading || isUnaffiliatedLoading || isTableLoading || isInterOpLoading) {
    return <CircularProgress />;
  }

  const error = programError || unaffiliatedError || tableError || interOpError;
  if (error) {
    return (
      <Typography variant="headline" color="error" size="sm">
        {`An error has occurred in loading the Program Details page: ${error.message}`}
      </Typography>
    );
  }

  const program = isInitiatives ? undefined : programData?.getAllPrograms?.[0];
  const unaffiliatedStudies = unaffiliatedData?.getAllPrograms?.[0]?.studies || [];
  const studies = (isInitiatives ? unaffiliatedStudies : program?.studies) || [];

  // Joins the program's studies (ids only) with the full per-study table fields; falls back to the bare study
  // fields if a study isn't in the full list.
  const rowsById = mergeInteropData(tableData?.getAllStudies, interOpData).reduce((acc, row) => {
    acc[row.study_id] = row;
    return acc;
  }, {});
  const programLabel = isInitiatives ? unaffiliatedProgramLabel : program?.program_short_name;
  const studyRows = studies.map((study) => ({
    ...study,
    ...rowsById[study.study_id],
    program_short_name: programLabel,
  }));

  if (isInitiatives) {
    return (
      <ProgramDetailsView
        isInitiatives
        unaffiliatedStudies={unaffiliatedStudies}
        studyRows={studyRows}
      />
    );
  }

  return (
    <ProgramDetailsView program={program} notFound={!program} studyRows={studyRows} />
  );
};

export default ProgramDetailsController;
