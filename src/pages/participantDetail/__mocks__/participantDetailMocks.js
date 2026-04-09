import {
  GET_PARTICIPANTS_OVERVIEW_QUERY,
  GET_BIOSPECIMENS_OVERVIEW_QUERY,
  GET_FILES_OVERVIEW_QUERY,
} from '../../../bento/dashboardTabData';

export const MOCK_PARTICIPANT_ID = 'GLIOMA01-i-045E';

export const participantOverviewMock = {
  request: {
    query: GET_PARTICIPANTS_OVERVIEW_QUERY,
    variables: { participant_id: [MOCK_PARTICIPANT_ID] },
  },
  result: {
    data: {
      participantOverview: [
        {
          participant_id: MOCK_PARTICIPANT_ID,
          ctep_disease_term: 'Plasma Cell Myeloma',
          stage_of_disease: 'Stage IV',
          tumor_grade: 'abc',
          age_at_enrollment: 67,
          sex: 'Female',
          race: 'Black or African American',
          ethnicity: 'Not Hispanic or Latino',
          carcinogen_exposure: null,
          targeted_therapy_string: 'GLIOMA01',
          data_file_uuid: null,
        },
      ],
    },
  },
};

export const biospecimensOverviewMock = {
  request: {
    query: GET_BIOSPECIMENS_OVERVIEW_QUERY,
    variables: { participant_id: [MOCK_PARTICIPANT_ID] },
  },
  result: {
    data: {
      biospecimenOverview: [
        {
          participant_id: MOCK_PARTICIPANT_ID,
          ctep_disease_term: 'Plasma Cell Myeloma',
          stage_of_disease: 'Stage IV',
          specimen_id: 'MSB-00140',
          specimen_record_id: 'MSB-00140-R',
          anatomical_collection_site: 'Iliac Crest',
          tissue_category: 'Tumor',
          assessment_timepoint: 'Pre-Treatment',
          surgical_procedure: 'Core Needle Biopsy',
          specimen_type: 'Fresh Frozen Tissue',
          tumor_grade: 'Grade 3',
          data_file_uuid: 'file-uuid-001',
        },
        {
          participant_id: MOCK_PARTICIPANT_ID,
          ctep_disease_term: 'Plasma Cell Myeloma',
          stage_of_disease: 'Stage IV',
          specimen_id: 'MSB-00141',
          specimen_record_id: 'MSB-00141-R',
          anatomical_collection_site: 'Iliac Crest',
          tissue_category: 'Normal',
          assessment_timepoint: 'Post-Treatment',
          surgical_procedure: 'Excisional Biopsy',
          specimen_type: 'FFPE',
          tumor_grade: 'Grade 2',
          data_file_uuid: 'file-uuid-002',
        },
      ],
    },
  },
};

export const filesOverviewMock = {
  request: {
    query: GET_FILES_OVERVIEW_QUERY,
    variables: { participant_id: [MOCK_PARTICIPANT_ID] },
  },
  result: {
    data: {
      fileOverview: [
        {
          participant_id: MOCK_PARTICIPANT_ID,
          study_accession: 'GLIOMA01',
          data_file_name: 'GLIOMA01-i-045E_WGS.bam',
          data_file_format: 'BAM',
          data_file_type: 'Aligned Reads',
          data_file_size: 348000000,
          data_file_description: 'Whole genome sequencing aligned reads',
          specimen_id: 'MSB-00140',
          ctep_disease_term: 'Plasma Cell Myeloma',
          specimen_record_id: 'MSB-00140-R',
          data_file_uuid: 'file-uuid-001',
        },
        {
          participant_id: MOCK_PARTICIPANT_ID,
          study_accession: 'GLIOMA01',
          data_file_name: 'GLIOMA01-i-045E_variants.vcf',
          data_file_format: 'VCF',
          data_file_type: 'Variant Call File',
          data_file_size: 52000000,
          data_file_description: 'Somatic variant calls',
          specimen_id: 'MSB-00140',
          ctep_disease_term: 'Plasma Cell Myeloma',
          specimen_record_id: 'MSB-00140-R',
          data_file_uuid: 'file-uuid-002',
        },
      ],
    },
  },
};

export const biospecimensEmptyMock = {
  request: {
    query: GET_BIOSPECIMENS_OVERVIEW_QUERY,
    variables: { participant_id: [MOCK_PARTICIPANT_ID] },
  },
  result: {
    data: {
      biospecimenOverview: [],
    },
  },
};

export const filesEmptyMock = {
  request: {
    query: GET_FILES_OVERVIEW_QUERY,
    variables: { participant_id: [MOCK_PARTICIPANT_ID] },
  },
  result: {
    data: {
      fileOverview: [],
    },
  },
};

// Default: populated tables
export const allParticipantDetailMocks = [
  participantOverviewMock,
  biospecimensOverviewMock,
  filesOverviewMock,
];

// Empty tables: shows "No Matching Records Found" in both tables
export const allParticipantDetailMocksEmpty = [
  participantOverviewMock,
  biospecimensEmptyMock,
  filesEmptyMock,
];
