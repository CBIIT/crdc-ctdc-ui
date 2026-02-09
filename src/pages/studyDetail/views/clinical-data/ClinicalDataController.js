import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core";
import axios from "axios";
import yaml from "js-yaml";
import { useQuery } from "@apollo/client";
import ClinicalDataView from "./ClinicalDataView";
import styles from "./ClinicalDataStyle";
import env from "../../../../utils/env";
import {
  studyClinicalDataQuery,
  table,
} from "../../../../bento/studyDetailData";
// import { SkeletonLoader } from "../../../../components/Skeleton";

// Module-level cache to avoid re-fetching YAML on every mount
let nodeDescriptionCache = null;
let nodeDescriptionPromise = null;

/**
 * Fetches and parses node descriptions from YAML data model
 * Uses module-level cache to fetch only once per app session
 * @returns {Promise<Object>} Node descriptions keyed by node name
 */
const fetchNodeDescriptions = async () => {
  // Return cached value if available
  if (nodeDescriptionCache) {
    return nodeDescriptionCache;
  }

  // Return existing promise if fetch is in progress
  if (nodeDescriptionPromise) {
    return nodeDescriptionPromise;
  }

  // Start new fetch
  nodeDescriptionPromise = (async () => {
    try {
      const DATA_MODEL = env.REACT_APP_DATA_MODEL;
      const response = await axios.get(DATA_MODEL);
      const dictionary = yaml.load(response.data);
      const { Nodes: allNodes } = dictionary;

      const descriptions = Object.keys(allNodes || []).reduce((acc, node) => {
        acc[node] = allNodes[node].Desc;
        return acc;
      }, {});

      // Cache the result
      nodeDescriptionCache = descriptions;
      return descriptions;
    } catch (error) {
      console.error("Failed to fetch node descriptions:", error);
      // Reset promise so retry is possible
      nodeDescriptionPromise = null;
      throw error;
    }
  })();

  return nodeDescriptionPromise;
};

const ClinicalDataController = ({ study_short_name, classes, dataCount }) => {
  const [description, setDescription] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);

  useEffect(() => {
    fetchNodeDescriptions()
      .then((descriptions) => setDescription(descriptions))
      .catch((error) => {
        setDescriptionError(error);
        // Set empty description object to unblock rendering
        setDescription({});
      });
  }, []);
  /**
   * table CSV download data
   */
  const { data, loading, error } = useQuery(studyClinicalDataQuery, {
    variables: {
      study_short_name: study_short_name,
    },
  });

  const clinicalData = data?.clinicalData?.at(0);
  const clinicalTrialData = data?.clinicalTrialData?.at(0);

  const nodeData = { ...clinicalData, ...clinicalTrialData };

  // Loading state - wait for both data and descriptions
  if (loading || !description) {
    return <div className={classes.container}>{/* <SkeletonLoader /> */}</div>;
  }

  // Error state - handle both query errors and description errors
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

  const { caseCount, nodeCount } = dataCount;

  const getFileName = (title) =>
    `CTDC_Clinical_Data-${study_short_name}-${title.toUpperCase()}`.replace(
      " ",
      "_",
    );

  /**
   * prepare data for table row and download CSV File download
   */
  const rows = table.rows.map((row) => {
    return {
      ...row,

      clinicalDataNode: row.title,
      clinicalDataDescription: description[row.countKey] || "",

      recordCount: nodeCount[row.countKey] || 0,
      caseCount: caseCount[row.countKey] || 0,

      csvDataRow: nodeData ? nodeData[row.csvDownload] : [],
      fileName: getFileName(row.title),
      node: nodeData[row.csvDownload] || [],
      metadata: row.manifest,
    };
  });

  return <ClinicalDataView tblRows={rows} study_short_name />;
};

export default withStyles(styles)(ClinicalDataController);
