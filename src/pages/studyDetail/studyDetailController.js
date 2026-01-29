import React from "react";
import { useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import StudyView from "./studyDetailView";
import { Typography } from "../../components/Wrappers/Wrappers";
import { GET_STUDY_DETAIL_DATA_QUERY } from "../../bento/studyDetailData";
import { STUDY_DETAIL_MAIN_QUERY } from "../../bento/ICDC_studyDetailsData";

const StudyDetailController = ({ match }) => {
  const { loading, error, data } = useQuery(GET_STUDY_DETAIL_DATA_QUERY, {
    variables: { study_short_name: ["CMB"] },
  });
  console.log("StudyDetailController data:", data);

  const { data: clinicalData } = {
    data: {
      "clinicalDataNodeCaseCounts": {
        "agent": 0,
        "cycle": 0,
        "visit": 84,
        "follow_up": 0,
        "adverse_event": 0,
        "off_treatment": 0,
        "off_study": 0,
        "prior_therapy": 0,
        "prior_surgery": 28,
        "agent_administration": 0,
        "physical_exam": 0,
        "vital_signs": 0,
        "disease_extent": 0,
        "lab_exam": 0,
        "__typename": "ClinicalDataNodeCounts"
      },
      "clinicalDataNodeCounts": {
        "agent": 0,
        "cycle": 87,
        "physical_exam": 10016,
        "__typename": "ClinicalDataNodeCounts",
        "visit": 862,
        "follow_up": 0,
        "adverse_event": 0,
        "off_treatment": 0,
        "off_study": 0,
        "prior_therapy": 0,
        "prior_surgery": 28,
        "agent_administration": 0,
        "vital_signs": 836,
        "disease_extent": 1878,
        "lab_exam": 0
      },
      "clinicalDataNodeNames": [
        "AGENT",
        "CYCLE",
        "VISIT",
        "PRIOR THERAPY",
        "PRIOR SURGERY",
        "AGENT ADMINISTRATION",
        "PHYSICAL EXAM",
        "VITAL SIGNS",
        "LAB EXAM",
        "ADVERSE EVENT",
        "DISEASE EXTENT",
        "FOLLOW UP",
        "OFF STUDY",
        "OFF TREATMENT"
      ],
    }
  }

  console.log("StudyDetailController clinicalData:", clinicalData);

  if (loading) return <CircularProgress />;
  if (error || !data) {
    return (
      <Typography variant="headline" color="error" size="sm">
        {error ? `An error has occurred in loading stats component: ${error}` : 'Recieved wrong data'}
      </Typography>
    );
  }
  return <StudyView data={data} clinicalData={clinicalData} studyCode="CMB" />;
};

export default StudyDetailController;
