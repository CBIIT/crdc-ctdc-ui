import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import TrialView from './trialDetailView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_TRIAL_DETAIL_DATA_QUERY } from '../../bento/trialDetailData';

const ProgramDetailContainer = ({ match }) => {
 /* const { loading, error, data } = {
    loading: false,
    error: false,
    data: {
        "searchParticipant": {
            "participantCountBaseOnStudyId": [
                {
                    "group": "NCT02465060",
                    "subjects": 15,
                    "__typename": "GroupCountES"
                }
            ]
        },
        "studySpecimenTypeCount": [
            {
                "group": "Blood",
                "count": 300,
                "__typename": "SpecimenTypeCount"
            },
            {
                "group": "Urine",
                "count": 150,
                "__typename": "SpecimenTypeCount"
            }
        ],
        "studySpecimenTimePointCount": [
            {
                "group": "Baseline",
                "count": 250,
                "__typename": "TimePointCount"
            },
            {
                "group": "Week 12",
                "count": 180,
                "__typename": "TimePointCount"
            }
        ],
        "studyByStudyId": {
            "study_id": "NCT04314401",
            "study_name": "Cancer Moonshot Biobank",
            "study_short_name": "CMB",
            "study_description": "This trial collects multiple tissue and blood samples, along with medical information, from cancer patients. The \"Cancer Moonshot Biobank\" is a longitudinal study. This means it collects and stores samples and information over time, throughout the course of a patient's cancer treatment. By looking at samples and information collected from the same people over time, researchers hope to better understand how cancer changes over time and over the course of medical treatments",
            "study_type": "Observational Study",
            "dates_of_conduct": "September 2020 - September 2025 (estimated)",
            "associated_link": [{
                "associated_link_name": "ClinicalTrials.gov record",
                "associated_link_url": "https://classic.clinicaltrials.gov/ct2/show/NCT04314401",
                "__typename": "associated_link"
            },{
                "associated_link_name": "About the Biobank",
                "associated_link_url": "https://moonshotbiobank.cancer.gov/about",
                "__typename": "associated_link"
            }],
            "diagnosis": {
                "ctep_disease_code": "C12345",
                "__typename": "Diagnosis"
            },
            "data_file": {
                "data_file_type": "CSV",
                "__typename": "DataFile"
            },
            "image_collection": [
      {
        "image_collection_name": "MRI Study Images",
        "repository_name": "Medical Imaging Repository",
        "image_collection_url": "https://www.exampleimaging.com/mri",
        "image_type_included": "MRI Scans",
        "collection_access": "Public",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "Cancer Imaging Database",
        "image_collection_url": "https://portal.imaging.datacommons.cancer.gov/explore/filters/?collection_id=cmb_crc",
        "image_type_included": "CT, DX, MR, PT, US",
        "collection_access": "Unrestricted",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "The Cancer Imaging Archive",
        "image_collection_url": "https://wiki.cancerimagingarchive.net/pages/viewpage.action?pageId=93257955",
        "image_type_included": "CT, DX, MR, PT, US",
        "collection_access": "Download",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "Cancer Imaging Database",
        "image_collection_url": "https://portal.imaging.datacommons.cancer.gov/explore/filters/?collection_id=cmb_gec",
        "image_type_included": "CT, PT",
        "collection_access": "Unrestricted",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "The Cancer Imaging Archive",
        "image_collection_url": "https://wiki.cancerimagingarchive.net/pages/viewpage.action?pageId=127665431",
        "image_type_included": "CT, PT",
        "collection_access": "Download",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "Cancer Imaging Database",
        "image_collection_url": "https://portal.imaging.datacommons.cancer.gov/explore/filters/?collection_id=cmb_lca",
        "image_type_included": "CT, DX, MR, NM, US",
        "collection_access": "Unrestricted",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "The Cancer Imaging Archive",
        "image_collection_url": "https://wiki.cancerimagingarchive.net/pages/viewpage.action?pageId=93258420",
        "image_type_included": "CT, DX, MR, NM, US",
        "collection_access": "Download",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "Cancer Imaging Database",
        "image_collection_url": "https://portal.imaging.datacommons.cancer.gov/explore/filters/?collection_id=cmb_mel",
        "image_type_included": "CT, PT, US",
        "collection_access": "Unrestricted",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "The Cancer Imaging Archive",
        "image_collection_url": "https://wiki.cancerimagingarchive.net/pages/viewpage.action?pageId=93258432",
        "image_type_included": "CT, PT, US",
        "collection_access": "Download",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "Cancer Imaging Database",
        "image_collection_url": "https://portal.imaging.datacommons.cancer.gov/explore/filters/?collection_id=cmb_mml",
        "image_type_included": "CT, MR, PT",
        "collection_access": "Unrestricted",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "The Cancer Imaging Archive",
        "image_collection_url": "https://wiki.cancerimagingarchive.net/pages/viewpage.action?pageId=93258436",
        "image_type_included": "CT, MR, PT",
        "collection_access": "Download",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "Cancer Imaging Database",
        "image_collection_url": "https://portal.imaging.datacommons.cancer.gov/explore/filters/?collection_id=cmb_pca",
        "image_type_included": "CT, MR, NM",
        "collection_access": "Unrestricted",
        "__typename": "ImageCollection"
      },
      {
        "image_collection_name": "CT Study Images",
        "repository_name": "The Cancer Imaging Archive",
        "image_collection_url": "https://wiki.cancerimagingarchive.net/pages/viewpage.action?pageId=95224082",
        "image_type_included": "CT, MR, NM",
        "collection_access": "Download",
        "__typename": "ImageCollection"
      }
    ],
            "__typename": "Study"
        }
    }
  }
  */
  
  const { loading, error, data } = useQuery(GET_TRIAL_DETAIL_DATA_QUERY, {
    variables: { id: "NCT02465060", ids: ["NCT02465060"] },
    context: { clientName: "mockService"},
  });

  if (loading) return <CircularProgress />;
  if (error || !data) {
    return (
      <Typography variant="headline" color="error" size="sm">
        {error ? `An error has occurred in loading stats component: ${error}` : 'Recieved wrong data'}
      </Typography>
    );
  }
  return <TrialView data={data} />;
};

export default ProgramDetailContainer;
