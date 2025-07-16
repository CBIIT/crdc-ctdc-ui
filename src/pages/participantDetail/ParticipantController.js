import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import ParticipantView from './ParticipantView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_PARTICIPANT_DETAIL_DATA_QUERY } from '../../bento/participantDetailData';
import { convertCRDCLinksToValue } from '../../utils/utils';

const ParticipantController = ({match}) => {
  const { loading, error, data } = useQuery(GET_PARTICIPANT_DETAIL_DATA_QUERY, {
    variables: { participant_id: match.params.id },
  });

  /*const { loading, error, data } = {
    "data": {
        "sampleCountOfCase": 1,
        "fileCountOfCase": 2,
        "aliquotCountOfCase": 0,
        "studyFileCountOfCase": 2,
        "programsCountOfCase": 1,
        "volumeOfDataOfCase": 2080536121,
        "multiStudyCases": null,
        "case": [
            {
                "case_id": "COTC021-0513",
                "patient_id": "0513",
                "patient_first_name": "Sadie",
                "study": {
                    "clinical_study_name": "Evaluation of Orally Administered mTOR inhibitor Rapamycin in Dogs in the Adjuvant Setting with Osteosarcoma",
                    "clinical_study_designation": "COTC021",
                    "program": {
                        "program_acronym": "COP",
                        "__typename": "program"
                    },
                    "__typename": "study"
                },
                "demographic": {
                    "breed": "Labrador Retriever",
                    "sex": "Female",
                    "patient_age_at_enrollment": 8.9,
                    "neutered_indicator": "Yes",
                    "weight": 41.7,
                    "__typename": "demographic"
                },
                "cohort": null,
                "enrollment": {
                    "site_short_name": "",
                    "date_of_registration": "",
                    "patient_subgroup": "",
                    "date_of_informed_consent": "",
                    "initials": "",
                    "__typename": "enrollment"
                },
                "diagnoses": [
                    {
                        "best_response": "Progressive Disease",
                        "disease_term": "Osteosarcoma",
                        "stage_of_disease": "Not Determined",
                        "date_of_diagnosis": "",
                        "primary_disease_site": "Bone (Appendicular)",
                        "histological_grade": "",
                        "histology_cytopathology": "",
                        "__typename": "diagnosis"
                    }
                ],
                "__typename": "case"
            }
        ],
        "filesOfCase": [
            {
                "parent": "sample",
                "file_name": "28_0513_tumor_S40_R1_001.fastq.gz",
                "file_type": "RNA Sequence File",
                "file_description": "RNA-Seq: Primary Tumor",
                "file_format": "gz",
                "file_size": 1010324198,
                "md5sum": "3dc6a96e887c7ade7b5cbfed2b37a1ed",
                "uuid": "3e8c07f3-42cf-5ec4-a089-5886de9da3cd",
                "__typename": "FilesOfCase"
            },
            {
                "parent": "sample",
                "file_name": "28_0513_tumor_S40_R2_001.fastq.gz",
                "file_type": "RNA Sequence File",
                "file_description": "RNA-Seq: Primary Tumor",
                "file_format": "gz",
                "file_size": 1070070327,
                "md5sum": "a47927db1842ece0821484c1b33c5dbe",
                "uuid": "14f40c7b-6702-5d51-bf80-68613c8000bf",
                "__typename": "FilesOfCase"
            }
        ],
        "samplesByCaseId": [
            {
                "sample_id": "COTC021-0513-T",
                "sample_site": "Bone",
                "summarized_sample_type": "Primary Malignant Tumor Tissue",
                "specific_sample_pathology": "Osteosarcoma",
                "tumor_grade": "Not Applicable",
                "sample_chronology": "Before Treatment",
                "percentage_tumor": "",
                "necropsy_sample": "No",
                "sample_preservation": "RNAlater",
                "files": [
                    {
                        "uuid": "14f40c7b-6702-5d51-bf80-68613c8000bf",
                        "__typename": "file"
                    },
                    {
                        "uuid": "3e8c07f3-42cf-5ec4-a089-5886de9da3cd",
                        "__typename": "file"
                    }
                ],
                "__typename": "sample"
            }
        ]
    }
  }
    */
  
if (loading) return <CircularProgress />;
if (error) {
  return (
    <Typography variant="h5" color="error" size="sm">
      {error ? `An error has occurred in loading component: ${error}` : 'Recieved wrong data'}
    </Typography>
  );
}
  return <ParticipantView data={data} participant_id={match.params.id} />;
};

export default ParticipantController;
