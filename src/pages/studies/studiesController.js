import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import Studies from './studiesView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_STUDY_DATA_QUERY } from '../../bento/studiesData';
import { convertCRDCLinksToValue } from '../../utils/utils';

const studiesContainer = ({ invalid }) => {
  // const { loading, error, data } = useQuery(GET_STUDY_DATA_QUERY);

  const { loading, error, data } = 
  {
    "data": {
      "studiesByProgram": [
        {
          "program_id": "COP",
          "clinical_study_designation": "COTC007B",
          "clinical_study_name": "Preclinical Comparison of Three Indenoisoquinoline Candidates in Tumor-Bearing Dogs",
          "clinical_study_type": "Clinical Trial",
          "numberOfCases": 84,
          "numberOfCaseFiles": 0,
          "numberOfStudyFiles": 0,
          "numberOfImageCollections": 0,
          "numberOfPublications": 2,
          "accession_id": "000001",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "COP",
          "clinical_study_designation": "COTC021",
          "clinical_study_name": "Evaluation of Orally Administered mTOR inhibitor Rapamycin in Dogs in the Adjuvant Setting with Osteosarcoma",
          "clinical_study_type": "Clinical Trial",
          "numberOfCases": 152,
          "numberOfCaseFiles": 186,
          "numberOfStudyFiles": 2,
          "numberOfImageCollections": 0,
          "numberOfPublications": 1,
          "accession_id": "000017",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "COP",
          "clinical_study_designation": "COTC022",
          "clinical_study_name": "A Contemporaneous Controlled Study of the Standard of Care (SOC) in Dogs with Appendicular Osteosarcoma",
          "clinical_study_type": "Clinical Trial",
          "numberOfCases": 157,
          "numberOfCaseFiles": 184,
          "numberOfStudyFiles": 2,
          "numberOfImageCollections": 0,
          "numberOfPublications": 1,
          "accession_id": "000009",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "CMCP",
          "clinical_study_designation": "GLIOMA01",
          "clinical_study_name": "Comparative Molecular Life History of Spontaneous Canine and Human Gliomas",
          "clinical_study_type": "Genomics",
          "numberOfCases": 81,
          "numberOfCaseFiles": 858,
          "numberOfStudyFiles": 0,
          "numberOfImageCollections": 2,
          "numberOfPublications": 1,
          "accession_id": "000003",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 2,
          "CRDCLinks": [
            {
              "text": "ICDC-Glioma (GLIOMA01) - IDC",
              "url": "https://portal.imaging.datacommons.cancer.gov/explore/filters/?collection_id=icdc_glioma",
              "__typename": "Link"
            },
            {
              "text": "ICDC-Glioma01 - TCIA",
              "url": "https://doi.org/10.7937/TCIA.SVQT-Q016",
              "__typename": "Link"
            }
          ],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "CMCP",
          "clinical_study_designation": "MGT01",
          "clinical_study_name": "Molecular Homology and Differences Between Spontaneous Canine Mammary Cancer and Human Breast Cancer",
          "clinical_study_type": "Genomics",
          "numberOfCases": 13,
          "numberOfCaseFiles": 68,
          "numberOfStudyFiles": 0,
          "numberOfImageCollections": 0,
          "numberOfPublications": 2,
          "accession_id": "000007",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "COP",
          "clinical_study_designation": "NCATS-COP01",
          "clinical_study_name": "Models for Diagnosis and Treatment of Human Cancers Using Comparative Canine-Human Transcriptomics",
          "clinical_study_type": "Transcriptomics",
          "numberOfCases": 60,
          "numberOfCaseFiles": 211,
          "numberOfStudyFiles": 1,
          "numberOfImageCollections": 0,
          "numberOfPublications": 1,
          "accession_id": "000002",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "CMCP",
          "clinical_study_designation": "ORGANOIDS01",
          "clinical_study_name": "Characterization of Healthy, Diseased, and Cancer Canine Organoids for Applications in Personalized Medicine and Translational Research",
          "clinical_study_type": "Genomics",
          "numberOfCases": 5,
          "numberOfCaseFiles": 52,
          "numberOfStudyFiles": 0,
          "numberOfImageCollections": 0,
          "numberOfPublications": 0,
          "accession_id": "000013",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "CMCP",
          "clinical_study_designation": "OSA01",
          "clinical_study_name": "A Multi-Platform Sequencing Analysis of Canine Appendicular Osteosarcoma.",
          "clinical_study_type": "Genomics",
          "numberOfCases": 60,
          "numberOfCaseFiles": 278,
          "numberOfStudyFiles": 0,
          "numberOfImageCollections": 0,
          "numberOfPublications": 1,
          "accession_id": "000006",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "CMCP",
          "clinical_study_designation": "OSA02",
          "clinical_study_name": "Association of canine osteosarcoma outcomes with clinical, genomic mutation, and transcriptomic expression profiles",
          "clinical_study_type": "Transcriptomics/Genomics",
          "numberOfCases": 117,
          "numberOfCaseFiles": 223,
          "numberOfStudyFiles": 4,
          "numberOfImageCollections": 0,
          "numberOfPublications": 4,
          "accession_id": "000012",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "CMCP",
          "clinical_study_designation": "OSA03",
          "clinical_study_name": "Comparative analysis using whole genome bisulfite sequencing of human and canine osteosarcoma",
          "clinical_study_type": "Genomics",
          "numberOfCases": 44,
          "numberOfCaseFiles": 88,
          "numberOfStudyFiles": 0,
          "numberOfImageCollections": 0,
          "numberOfPublications": 1,
          "accession_id": "000016",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "PRECINCT",
          "clinical_study_designation": "PRECINCT01",
          "clinical_study_name": "Inhaled IL-15 Immunotherapy for Treatment of Lung Metastases (from primary osteosarcoma or melanoma)",
          "clinical_study_type": "Clinical Trial",
          "numberOfCases": 21,
          "numberOfCaseFiles": 21,
          "numberOfStudyFiles": 5,
          "numberOfImageCollections": 0,
          "numberOfPublications": 3,
          "accession_id": "000011",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "CMCP",
          "clinical_study_designation": "TBD01",
          "clinical_study_name": "Title of the pending TBD01 study",
          "clinical_study_type": "Transcriptomics",
          "numberOfCases": 0,
          "numberOfCaseFiles": 0,
          "numberOfStudyFiles": 0,
          "numberOfImageCollections": 0,
          "numberOfPublications": 0,
          "accession_id": "000008",
          "study_disposition": "Pending",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "CMCP",
          "clinical_study_designation": "TCL01",
          "clinical_study_name": "Whole exome sequencing analysis of canine cancer cell lines",
          "clinical_study_type": "Genomics",
          "numberOfCases": 45,
          "numberOfCaseFiles": 92,
          "numberOfStudyFiles": 3,
          "numberOfImageCollections": 0,
          "numberOfPublications": 1,
          "accession_id": "000008",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "PCCR",
          "clinical_study_designation": "UBC01",
          "clinical_study_name": "Antitumor Activity and Molecular Effects of Vemurafenib in Dogs with BRAF-mutant Bladder Cancer",
          "clinical_study_type": "Clinical Trial",
          "numberOfCases": 38,
          "numberOfCaseFiles": 166,
          "numberOfStudyFiles": 4,
          "numberOfImageCollections": 0,
          "numberOfPublications": 1,
          "accession_id": "000004",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "PCCR",
          "clinical_study_designation": "UBC02",
          "clinical_study_name": "Basal and Luminal Molecular Subtypes in Naturally-Occurring Canine Urothelial Carcinoma Are Associated With Tumor Immune Signatures and Dog Breed",
          "clinical_study_type": "Genomics",
          "numberOfCases": 60,
          "numberOfCaseFiles": 120,
          "numberOfStudyFiles": 2,
          "numberOfImageCollections": 0,
          "numberOfPublications": 1,
          "accession_id": "000005",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "PCCR",
          "clinical_study_designation": "UBC03",
          "clinical_study_name": "Transcriptomic analyses of early stage bladder cancer in Scottish Terriers detected through screening",
          "clinical_study_type": "Transcriptomics",
          "numberOfCases": 20,
          "numberOfCaseFiles": 40,
          "numberOfStudyFiles": 2,
          "numberOfImageCollections": 0,
          "numberOfPublications": 1,
          "accession_id": "000010",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        },
        {
          "program_id": "CMCP",
          "clinical_study_designation": "UC01",
          "clinical_study_name": "Whole exome sequencing analysis of canine urothelial carcinomas without BRAF V595E mutation",
          "clinical_study_type": "Genomics",
          "numberOfCases": 36,
          "numberOfCaseFiles": 72,
          "numberOfStudyFiles": 1,
          "numberOfImageCollections": 0,
          "numberOfPublications": 1,
          "accession_id": "000015",
          "study_disposition": "Unrestricted",
          "numberOfCRDCNodes": 0,
          "CRDCLinks": [],
          "__typename": "StudyOfProgram"
        }
      ]
    }
  };

  
  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="headline" color="error" size="sm">{error ? `An error has occurred in loading stats component: ${error}` : 'Recieved wrong data'}</Typography>;

  return <Studies data={convertCRDCLinksToValue(data)} invalid={invalid} />;
};

export default studiesContainer;
