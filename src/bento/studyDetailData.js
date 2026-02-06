import { cellTypes } from '@bento-core/table';
import gql from 'graphql-tag';

// --------------- Tooltip configuration --------------
export const tooltipContent = {
  src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/icdc/images/svgs/Tooltip.SpeechBubble.svg',
  alt: 'tooltipIcon',
};

export const title = {
  studyFile: '',
  armsAndCohort: '',
};



export const headerIcon = 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/Icon-TrialDetail.svg';
export const externalIcon = 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExternalLinkIcon.svg';

export const tab = {
  items: [
    {
      index: 0,
      label: 'Overview',
      value: 'overview',
    },
    {
      index: 1,
      label: 'Clinical Data',
      value: 'clinical_data',
    },
  ],
};

export const biospecimenProfile = {
  tabs: [
    {
      index: 0,
      label: 'TIMEPOINT',
      value: 'specimen_timepoints',
    },
    {
      index: 1,
      label: 'BIOSPECIMENS',
      value: 'specimen_types',
    },
  ],
};

export const palette = ['#0A8B8B', '#6AC6B6', '#C33B27', '#FDB915', '#381F5F', '#007EA5', '#8B5996', '#0A8B8B', '#6AC6B6', '#C33B27', '#FDB915', '#381F5F', '#007EA5' ];

/* * Xaxis config value */
export const argumentConfiguration = {
  field: 'group',
  visible: false,
  position: 'inside',
  size: 12,
  title: {
    text: 'Biospecimens',
    size: 13,
    color: '#444444',
    weight: 500,
    family: 'Inter',
  },
  label: {
    size: 20,
    position: 'outside',
    staggeringSpacing: 19,
  },
};

/* * Xaxis config value */
export const timePointArgumentConfiguration = {
  ...argumentConfiguration,
  title: {
    ...argumentConfiguration.title,
    text: 'Collection Timepoint',
  }
};

/* * Yaxis config value */
export const valueConfiguration = {
  field: 'count',
  size: 12,
  allowDecimals: false,
  title: {
    text: 'Biospecimen Count',
    size: 13,
    color: '#444444',
    weight: 500,
    family: 'Inter',
  },
  chartGrid: {
    visible: true,
  },
  label: {
    size: 12,
    position: 'outside',
  },
  tick: {
    visible: true,
  },
};

/** common series setting */
export const seriesSetting = {
  maxBarWidth: 200,
};

export const studyClinicalDataCountQuery = gql`
query clinicalDataTab($study_short_name: [String]) {
  # NodeCounts for Clinical Data Tab
  clinicalDataNodeCounts: clinicalData(study_short_name: $study_short_name) {
    diagnosis: diagnosisNodeCount # Clinical: diagnosis
    participant_status: participantStatusNodeCount # Clinical: participant_status
  }
  
  clinicalTrialDataNodeCounts: clinicalTrialData(study_short_name: $study_short_name) {
    targeted_therapy: targetedTherapyNodeCount # Clinical Trial: targeted_therapy
    non_targeted_therapy: nonTargetedTherapyNodeCount # Clinical Trial:non_targeted_therapy
    surgery: surgeryNodeCount # Clinical Trial: surgery
    radiotherapy: radiotherapyNodeCount # Clinical Trial: radiotherapy
  }

  # ParticipantCounts for Clinical Data Tab
  clinicalDataNodeParticipantCounts: clinicalData(study_short_name: $study_short_name) {
    diagnosis: diagnosisParticipantCount # Clinical: diagnosis
    participant_status: participantStatusParticipantCount # Clinical: participant_status
  }
  
  clinicalTrialDataNodeParticipantCounts: clinicalTrialData(study_short_name: $study_short_name) {
    targeted_therapy: targetedTherapyParticipantCount # Clinical Trial: targeted_therapy
    non_targeted_therapy: nonTargetedTherapyParticipantCount # Clinical Trial:non_targeted_therapy
    surgery: surgeryParticipantCount # Clinical Trial: surgery
    radiotherapy: radiotherapyParticipantCount # Clinical Trial: radiotherapy
  }

  # TODO: consider merging clinicalData and clinicalTrialData queries into one to optimize data fetching
  clinicalData(study_short_name: $study_short_name) {
    study_short_name
    unique_node_types
    # Clinical: diagnosis
    diagnosisParticipantCount
    diagnosisNodeCount

    # Clinical: participant_status
    participantStatusNodeCount
    participantStatusParticipantCount
      
  }
  clinicalTrialData(study_short_name: $study_short_name) {
    study_short_name

    # Clinical Trial: targeted_therapy
    targetedTherapyParticipantCount
    targetedTherapyNodeCount

    # Clinical Trial:non_targeted_therapy
    nonTargetedTherapyParticipantCount
    nonTargetedTherapyNodeCount

    # Clinical Trial: surgery
    surgeryParticipantCount
    surgeryNodeCount

    # Clinical Trial: radiotherapy
    radiotherapyParticipantCount
    radiotherapyNodeCount
  }
}`;

export const studyClinicalDataQuery = gql`
  query clinicalDataTab($study_short_name: [String]) {
    clinicalData(study_short_name: $study_short_name) {
      study_short_name
      unique_node_types

      # Clinical: diagnosis
      diagnosisParticipantCount
      diagnosisNodeCount
      diagnosisNodeData {
        participant_ids
        ctep_disease_term
        date_of_diagnosis
        date_of_diagnosis_original
        date_of_diagnosis_unit
        diagnosis_record_id
        histological_subtype
        histology
        meddra_disease_code
        primary_diagnosis_disease_group
        primary_disease_site
        snomed_disease_code
        snomed_disease_term
      }

      # Clinical: participant_status
      participantStatusNodeCount
      participantStatusParticipantCount
      participantStatusNodeData{
        participant_ids
        off_study
        off_study_reason
        participant_id
        participant_status_record_id
        survival_status
      }
    
    }
    clinicalTrialData(study_short_name: $study_short_name) {
      study_short_name

      # Clinical Trial: targeted_therapy
      targetedTherapyParticipantCount
      targetedTherapyNodeCount
      targetedTherapyNodeData {
        participant_ids
        targeted_therapy
        targeted_therapy_dose
        targeted_therapy_frequency
        targeted_therapy_record_id
      }

      # Clinical Trial:non_targeted_therapy
      nonTargetedTherapyParticipantCount
      nonTargetedTherapyNodeCount
      nonTargetedTherapyNodeData {
        participant_ids
        non_targeted_therapy_record_id
        best_response_to_non_targeted_therapy
        non_targeted_therapy
        non_targeted_therapy_dose
        non_targeted_therapy_frequency
      }

      # Clinical Trial: surgery
      surgeryParticipantCount
      surgeryNodeCount
      surgeryNodeData {
        participant_ids
        surgical_procedure_record_id
        extent_of_residual_disease
        surgical_procedure
        surgical_procedure_anatomical_location
        surgical_procedure_date
        surgical_procedure_findings
        surgical_procedure_therapeutic
      }

      # Clinical Trial: radiotherapy
      radiotherapyParticipantCount
      radiotherapyNodeCount
      radiotherapyNodeData{
        participant_ids
        radiation_dose
        radiation_extent
        radiation_frequency
        radiological_procedure
        radiological_procedure_anatomical_location
        radiological_procedure_record_id
      }
      __typename
    }
  }

`;

// --------------- GraphQL query configuration --------------
export const GET_STUDY_DETAIL_DATA_QUERY = gql`
query studyByStudyShortNameQueries($study_short_name: [String]) {
  # Clinical Data Tab: Node Counts
  clinicalDataNodeCounts: clinicalData(study_short_name: $study_short_name) {
    diagnosis: diagnosisNodeCount
    participant_status: participantStatusNodeCount
  }
  clinicalTrialDataNodeCounts: clinicalTrialData(study_short_name: $study_short_name) {
    targeted_therapy: targetedTherapyNodeCount
    non_targeted_therapy: nonTargetedTherapyNodeCount
    surgery: surgeryNodeCount
    radiotherapy: radiotherapyNodeCount
  }

  # Clinical Data Tab: Participant Counts
  clinicalDataParticipantCounts: clinicalData(study_short_name: $study_short_name) {
    diagnosis: diagnosisParticipantCount
    participant_status: participantStatusParticipantCount
  }
  clinicalTrialDataParticipantCounts: clinicalTrialData(study_short_name: $study_short_name) {
    targeted_therapy: targetedTherapyParticipantCount
    non_targeted_therapy: nonTargetedTherapyParticipantCount
    surgery: surgeryParticipantCount
    radiotherapy: radiotherapyParticipantCount
  }
 
  studyByStudyShortName(study_short_name: $study_short_name) {
    study_id
    study_name
    study_short_name
    study_description
    study_type
    dates_of_conduct
    participant_count
    associated_links {
      associated_link_name
      associated_link_url
      associated_link_record_id
    }
    image_collection {
      image_collection_name
      repository_name
      image_collection_url
      image_type_included
      collection_access
    }
  }

   studyDiagnosisByStudyShortName(study_short_name: $study_short_name) {
    ctep_disease_terms
  }

   StudyDataFileByStudyShortName(study_short_name: $study_short_name) {
    list_type
    study_data_files{
      data_file_uuid
      data_file_name
      data_file_format
    }
  }

  StudySpecimenByStudyShortName(study_short_name: $study_short_name) {
    specimen_types{
        group
        count
    }
    specimen_timepoints{
       group
       count
    }
    specimen_count
  }
}

`;


export const diagnosisNodeMetadata = {
  keysToInclude: [
    "participant_ids",
    "ctep_disease_term",
    "date_of_diagnosis",
    "date_of_diagnosis_original",
    "date_of_diagnosis_unit",
    "diagnosis_record_id",
    "histological_subtype",
    "histology",
    "meddra_disease_code",
    "primary_diagnosis_disease_group",
    "primary_disease_site",
    "snomed_disease_code",
    "snomed_disease_term"
  ],
  header: [
    "participant_ids",
    "ctep_disease_term",
    "date_of_diagnosis",
    "date_of_diagnosis_original",
    "date_of_diagnosis_unit",
    "diagnosis_record_id",
    "histological_subtype",
    "histology",
    "meddra_disease_code",
    "primary_diagnosis_disease_group",
    "primary_disease_site",
    "snomed_disease_code",
    "snomed_disease_term"
  ],
};

export const participantStatusNodeMetadata = {
  keysToInclude: [
    "participant_ids",
    "off_study",
    "off_study_reason",
    "participant_id",
    "participant_status_record_id",
    "survival_status"
  ],
  header: [
    "participant_ids",
    "off_study",
    "off_study_reason",
    "participant_id",
    "participant_status_record_id",
    "survival_status"
  ],
};

export const targetedTherapyNodeMetadata = {
  keysToInclude: [
    "participant_ids",
    "targeted_therapy",
    "targeted_therapy_dose",
    "targeted_therapy_frequency",
    "targeted_therapy_record_id"
  ],
  header: [
    "participant_ids",
    "targeted_therapy",
    "targeted_therapy_dose",
    "targeted_therapy_frequency",
    "targeted_therapy_record_id"
  ],
};

export const nonTargetedTherapyNodeMetadata = {
  keysToInclude: [
    "participant_ids",
    "non_targeted_therapy_record_id",
    "best_response_to_non_targeted_therapy",
    "non_targeted_therapy",
    "non_targeted_therapy_dose",
    "non_targeted_therapy_frequency"
  ],
  header: [
    "participant_ids",
    "non_targeted_therapy_record_id",
    "best_response_to_non_targeted_therapy",
    "non_targeted_therapy",
    "non_targeted_therapy_dose",
    "non_targeted_therapy_frequency"
  ],
};

export const surgeryNodeMetadata = {
  keysToInclude: [
    "participant_ids",
    "surgical_procedure_record_id",
    "extent_of_residual_disease",
    "surgical_procedure",
    "surgical_procedure_anatomical_location",
    "surgical_procedure_date",
    "surgical_procedure_findings",
    "surgical_procedure_therapeutic"
  ],
  header: [
    "participant_ids",
    "surgical_procedure_record_id",
    "extent_of_residual_disease",
    "surgical_procedure",
    "surgical_procedure_anatomical_location",
    "surgical_procedure_date",
    "surgical_procedure_findings",
    "surgical_procedure_therapeutic"
  ],
};

export const radiotherapyNodeMetadata = {
  keysToInclude: [
    "participant_ids",
    "radiation_dose",
    "radiation_extent",
    "radiation_frequency",
    "radiological_procedure",
    "radiological_procedure_anatomical_location",
    "radiological_procedure_record_id"
  ],
  header: [
    "participant_ids",
    "radiation_dose",
    "radiation_extent",
    "radiation_frequency",
    "radiological_procedure",
    "radiological_procedure_anatomical_location",
    "radiological_procedure_record_id"
  ],
};

export const table = {
  title: "Imaging Data Commons (IDC)",
  defaultSortField: "dataNode",
  // 'asc' or 'desc'
  defaultSortDirection: "asc",
  columns: [
    {
      dataField: "clinicalDataNode",
      header: "Clinical Data Nodes",
      sort: "asc",
      display: true,
      cellType: cellTypes.CUSTOM_ELEM,
      tooltipText: "sort",
    },
    {
      dataField: "clinicalDataDescription",
      header: "Definition",
      sort: "asc",
      display: true,
      cellType: cellTypes.CUSTOM_ELEM,
      tooltipText: "sort",
    },
    {
      dataField: "caseCount",
      header: "Participants",
      sort: "asc",
      display: true,
      tooltipText:
        "For each of the nodes listed below, the number of cases represented by one or more records within that node",
      columnDefaultValues: {
        0: " ",
      },
    },
    {
      dataField: "recordCount",
      header: "Records",
      sort: "asc",
      display: true,
      tooltipText:
        "For each of the nodes listed below, the total number of records within each node. Cases may have multiple/numerous records within certain nodes",
      columnDefaultValues: {
        0: " ",
      },
    },
    {
      dataField: "csvDataRow",
      header: "CSV",
      display: true,
      cellType: cellTypes.CUSTOM_ELEM,
    },
  ],
  rows: [
    {
      title: "diagnosis",
      countKey: "diagnosis",
      csvDownload: "diagnosisNodeData",
      manifest: diagnosisNodeMetadata,
    },
    {
      title: "participant_status",
      countKey: "participant_status",
      csvDownload: "participantStatusNodeData",
      manifest: participantStatusNodeMetadata,
    },
    {
      title: "targeted_therapy",
      countKey: "targeted_therapy",
      csvDownload: "targetedTherapyNodeData",
      manifest: targetedTherapyNodeMetadata,
    },
    {
      title: "non_targeted_therapy",
      countKey: "non_targeted_therapy",
      csvDownload: "nonTargetedTherapyNodeData",
      manifest: nonTargetedTherapyNodeMetadata,
    },
    {
      title: "surgery",
      countKey: "surgery",
      csvDownload: "surgeryNodeData",
      manifest: surgeryNodeMetadata,
    },
    {
      title: "radiotherapy",
      countKey: "radiotherapy",
      csvDownload: "radiotherapyNodeData",
      manifest: radiotherapyNodeMetadata,
    },
  ],
  tableMsg: {
    noMatch: "Data unavailable at this time",
  },
};


export const tableLayOut = [
  {
    container: "paginatedTable",
    paginatedTable: true,
  },
];