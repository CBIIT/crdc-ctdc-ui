import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core";
import axios from "axios";
import yaml from "js-yaml";
import { useQuery } from "@apollo/client";
import ClinicalDataView from "./ClinicalDataView";
import styles from "./ClinicalDataStyle";
import env from "../../../../utils/env";
import { studyClinicalDataQuery, table} from "../../../../bento/studyDetailData";
// import { SkeletonLoader } from "../../../../components/Skeleton";

const ClinicalDataController = ({ study_short_name, classes, dataCount }) => {
  /**
   * Set node description from ymal files
   */
  const [description, setDescription] = useState(null);
  const DATA_MODEL = env.REACT_APP_DATA_MODEL;
  const getNodeDescription = async () => {
    const response = await axios.get(DATA_MODEL);
    const dictionary = yaml.load(response.data);
    const { Nodes: allNodes } = dictionary;
    const nodeDescription = Object.keys(allNodes || []).reduce((acc, node) => {
      acc[node] = allNodes[node].Desc;
      return acc;
    }, {});
    setDescription(nodeDescription);
  };

  useEffect(() => {
    getNodeDescription();
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

  const nodeData = {...clinicalData, ...clinicalTrialData}

  
  if (loading || !description) {
    return <div className={classes.container}>{/* <SkeletonLoader /> */}</div>;
  }

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

  const { caseCount, nodeCount } = dataCount;

  const getFileName = (title) =>
    `CTDC_Clinical_Data-${study_short_name}-${title.toUpperCase()}`.replace(" ", "_");

  /**
   * prepare data for table row and download CVS File download
   */

    console.log("|| Data:", nodeData);

  const rows = table.rows.map((row) => {
    console.log("|| Row dataKey:", row.dataKey);
    
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
