import React from "react";
import { useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import StudyView from "./studyDetailView";
import ErrorMessage from "./ErrorMessage";
import { GET_STUDY_DETAIL_DATA_QUERY } from "../../bento/studyDetailData";

/**
 * Validates if study data exists in the query response
 */
const hasValidStudyData = (data) => {
  return (
    data && data.studyByStudyShortName && data.studyByStudyShortName.length > 0
  );
};

/**
 * StudyDetailController
 * Fetches and displays study detail information
 *
 * @param {Object} props - Component props
 * @param {Object} props.match - React Router match object containing route params
 */
const StudyDetailController = ({ match }) => {
  // TODO: Update API to use study_id from match params instead of hardcoded value
  const study_id = match.params.id;
  const study_short_name = "CMB";


  const { loading, error, data } = useQuery(GET_STUDY_DETAIL_DATA_QUERY, {
    variables: { study_short_name },
  });

  // Loading state
  if (loading) {
    return <CircularProgress />;
  }

  // Error or no data state
  if (error || !hasValidStudyData(data)) {
    return <ErrorMessage error={error} />;
  }

  // Success state - render study view
  return <StudyView data={data} study_short_name={study_short_name} study_id={study_id} />;
};

export default StudyDetailController;
