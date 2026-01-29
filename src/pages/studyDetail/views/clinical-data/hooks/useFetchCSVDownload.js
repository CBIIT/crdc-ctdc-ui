import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_ADVERSE_EVENT_CLINICAL_DATA,
  GET_AGENT_ADMINISTRATION_CLINICAL_DATA,
  GET_AGENT_CLINICAL_DATA,
  GET_CYCLE_CLINICAL_DATA,
  GET_DISEASE_EXTENT_CLINICAL_DATA,
  GET_FOLLOW_UP_CLINICAL_DATA,
  GET_OFF_STUDY_CLINICAL_DATA,
  GET_OFF_TREATMENT_CLINICAL_DATA,
  GET_PHYSICAL_EXAM_CLINICAL_DATA,
  GET_PRIOR_SURGERY_CLINICAL_DATA,
  GET_PRIOR_THERAPY_CLINICAL_DATA,
  GET_VISIT_CLINICAL_DATA,
  GET_VITAL_SIGNS_CLINICAL_DATA,
} from "../../../../../bento/ICDC_studyDetailsData";

const useFetchCSVDownload = (csvDownloadFlags, study_code) => {
  const [agentNodeCSV, setAgentNodeCSV] = useState([]);
  const [cycleNodeCSV, setCycleNodeCSV] = useState([]);
  const [visitNodeCSV, setVisitNodeCSV] = useState([]);
  const [priorTherapyNodeCSV, setPriorTherapyNodeCSV] = useState([]);
  const [priorSurgeryNodeCSV, setPriorSurgeryNodeCSV] = useState([]);
  const [agentAdministrationNodeCSV, setAgentAdministrationNodeCSV] = useState(
    []
  );
  const [physicalExamNodeCSV, setPhysicalExamNodeCSV] = useState([]);
  const [vitalSignsNodeCSV, setVitalSignsNodeCSV] = useState([]);
  const [adverseEventNodeCSV, setAdverseEventNodeCSV] = useState([]);
  const [diseaseExtentNodeCSV, setDiseaseExtentNodeCSV] = useState([]);
  const [followUpNodeCSV, setFollowUpNodeCSV] = useState([]);
  const [offStudyNodeCSV, setOffStudyNodeCSV] = useState([]);
  const [offTreatmentNodeCSV, setOffTreatmentNodeCSV] = useState([]);

  const { data: agentNodeData, isLoading: agentLoading } = useQuery(
    GET_AGENT_CLINICAL_DATA,
    {
      variables: {
        study_code,
      },
      onCompleted: () => setAgentNodeCSV(agentNodeData?.agentNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    }
  );

  const { data: cycleNodeData, isLoading: cycleLoading } = useQuery(
    GET_CYCLE_CLINICAL_DATA,
    {
      variables: {
        study_code,
      },
      onCompleted: () => setCycleNodeCSV(cycleNodeData?.cycleNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    }
  );

  const { data: visitNodeData, isLoading: visitLoading } = useQuery(
    GET_VISIT_CLINICAL_DATA,
    {
      variables: {
        study_code,
      },
      onCompleted: () => setVisitNodeCSV(visitNodeData?.visitNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    }
  );

  const { data: priorTherapyNodeData, isLoading: priorTherapyLoading } =
    useQuery(GET_PRIOR_THERAPY_CLINICAL_DATA, {
      variables: {
        study_code,
      },
      onCompleted: () =>
        setPriorTherapyNodeCSV(priorTherapyNodeData?.priorTherapyNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    });

  const { data: priorSurgeryNodeData, isLoading: priorSurgeryLoading } =
    useQuery(GET_PRIOR_SURGERY_CLINICAL_DATA, {
      variables: {
        study_code,
      },
      onCompleted: () =>
        setPriorSurgeryNodeCSV(priorSurgeryNodeData?.priorSurgeryNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    });

  const {
    data: agentAdministrationNodeData,
    isLoading: agentAdministrationLoading,
  } = useQuery(GET_AGENT_ADMINISTRATION_CLINICAL_DATA, {
    variables: {
      study_code,
    },
    onCompleted: () =>
      setAgentAdministrationNodeCSV(
        agentAdministrationNodeData?.agentAdministrationNodeData
      ),
    context: {
      uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
    },
  });

  const { data: physicalExamNodeData, isLoading: physicalExamLoading } =
    useQuery(GET_PHYSICAL_EXAM_CLINICAL_DATA, {
      variables: {
        study_code,
      },
      onCompleted: () =>
        setPhysicalExamNodeCSV(physicalExamNodeData?.physicalExamNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    });

  const { data: vitalSignsNodeData, isLoading: vitalSignsLoading } = useQuery(
    GET_VITAL_SIGNS_CLINICAL_DATA,
    {
      variables: {
        study_code,
      },
      onCompleted: () =>
        setVitalSignsNodeCSV(vitalSignsNodeData?.vitalSignsNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    }
  );

  const { data: adverseEventNodeData, isLoading: adverseEventLoading } =
    useQuery(GET_ADVERSE_EVENT_CLINICAL_DATA, {
      variables: {
        study_code,
      },
      onCompleted: () =>
        setAdverseEventNodeCSV(adverseEventNodeData?.adverseEventNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    });

  const { data: diseaseExtentNodeData, isLoading: diseaseExtentLoading } =
    useQuery(GET_DISEASE_EXTENT_CLINICAL_DATA, {
      variables: {
        study_code,
      },
      onCompleted: () =>
        setDiseaseExtentNodeCSV(diseaseExtentNodeData?.diseaseExtentNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    });

  const { data: followUpNodeData, isLoading: followUpLoading } = useQuery(
    GET_FOLLOW_UP_CLINICAL_DATA,
    {
      variables: {
        study_code,
      },
      onCompleted: () => setFollowUpNodeCSV(followUpNodeData?.followUpNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    }
  );

  const { data: offStudyNodeData, isLoading: offStudyLoading } = useQuery(
    GET_OFF_STUDY_CLINICAL_DATA,
    {
      variables: {
        study_code,
      },
      onCompleted: () => setOffStudyNodeCSV(offStudyNodeData?.offStudyNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    }
  );

  const { data: offTreatmentNodeData, isLoading: offTreatmentLoading } =
    useQuery(GET_OFF_TREATMENT_CLINICAL_DATA, {
      variables: {
        study_code,
      },
      onCompleted: () =>
        setOffTreatmentNodeCSV(offTreatmentNodeData?.offTreatmentNodeData),
      context: {
        uri: "https://caninecommons-qa.cancer.gov/v1/graphql/",
      },
    });

  const isLoading =
    agentLoading ||
    cycleLoading ||
    visitLoading ||
    priorTherapyLoading ||
    priorSurgeryLoading ||
    agentAdministrationLoading ||
    vitalSignsLoading ||
    adverseEventLoading ||
    diseaseExtentLoading ||
    followUpLoading ||
    offStudyLoading ||
    offTreatmentLoading ||
    physicalExamLoading;

  return [
    agentNodeCSV,
    cycleNodeCSV,
    visitNodeCSV,
    priorTherapyNodeCSV,
    priorSurgeryNodeCSV,
    agentAdministrationNodeCSV,
    physicalExamNodeCSV,
    vitalSignsNodeCSV,
    adverseEventNodeCSV,
    diseaseExtentNodeCSV,
    followUpNodeCSV,
    offStudyNodeCSV,
    offTreatmentNodeCSV,
    isLoading,
  ];
};

export default useFetchCSVDownload;
