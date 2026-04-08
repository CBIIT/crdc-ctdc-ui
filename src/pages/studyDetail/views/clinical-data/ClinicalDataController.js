import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core";
import { useQuery } from "@apollo/client";
import ClinicalDataView from "./ClinicalDataView";
import styles from "./ClinicalDataStyle";
import { fetchNodeDescriptions } from "./services/nodeDescriptionService";
import { prepareTableRows } from "./clinicalDataTableUtils";
import {
  studyClinicalDataQuery,
  table,
} from "../../../../bento/studyDetailData";
// import { SkeletonLoader } from "../../../../components/Skeleton";

/**
 * ClinicalDataController
 * Orchestrates data fetching and preparation for the clinical data table
 *
 * Responsibilities:
 * - Fetch node descriptions (delegated to service)
 * - Fetch clinical data via GraphQL
 * - Coordinate loading/error states
 * - Transform data for view (delegated to utils)
 *
 * @param {Object} props
 * @param {string} props.study_id - Study identifier
 * @param {string} props.study_short_name - Study short name
 * @param {Object} props.classes - Material-UI styles
 * @param {Object} props.dataCount - Counts for participants and records
 */
const ClinicalDataController = ({ study_id, study_short_name, classes, dataCount }) => {
  const [description, setDescription] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);

  // Fetch node descriptions from YAML data model
  useEffect(() => {
    fetchNodeDescriptions()
      .then(setDescription)
      .catch((error) => {
        setDescriptionError(error);
        // Set empty object to unblock rendering (graceful degradation)
        setDescription({});
      });
  }, []);

  // Fetch clinical data via GraphQL
  const { data, loading, error } = useQuery(studyClinicalDataQuery, {
    variables: { study_id: [study_id]},
  });

  // Loading state - wait for both data sources
  if (loading || !description) {
    return <div className={classes.container}>{/* <SkeletonLoader /> */}</div>;
  }

  // Error state - handle GraphQL errors
  if (error || !data) {
    console.error("Clinical data query error:", error);
    return (
      <div className={classes.container}>
        <p>
          Error loading clinical data: {error?.message || "No data returned"}
        </p>
      </div>
    );
  }

  // Warning for description fetch failure (non-blocking)
  if (descriptionError) {
    console.warn(
      "Node descriptions could not be loaded. Displaying without descriptions.",
      descriptionError,
    );
  }

  // Combine clinical and trial data
  const clinicalData = data?.clinicalData?.at(0);
  const clinicalTrialData = data?.clinicalTrialData?.at(0);
  const nodeData = { ...clinicalData, ...clinicalTrialData };

  const { caseCount, nodeCount } = dataCount;

  // Prepare table rows using pure function (easy to test)
  const rows = prepareTableRows({
    tableRows: table.rows,
    descriptions: description,
    nodeData,
    caseCount,
    nodeCount,
    studyShortName: study_short_name,
  });

  return (
    <ClinicalDataView tblRows={rows} study_short_name={study_short_name} />
  );
};

export default withStyles(styles)(ClinicalDataController);
