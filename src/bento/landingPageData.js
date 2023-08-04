import gql from 'graphql-tag';
// import Test from '../assets/header/CTDC_Logo.svg';

// The ideal image size of landingPageHero 1400x600px
// Tile1 Tile2 Tile3 images 293x349 px
// Tile4 image optimum size 600x 436 px
export const landingPageData = {
  callToActionTitle: 'Explore, Analyze, Visualize Clinical Trial Data Sets',
  callToActionDescription: 'Model, Store and Share your Data Sets using the Bento Framework for Data Sharing Platforms.',
  callToActionButtonText: 'EXPLORE THE SITE',
  callToActionLink: '/explore',
  landingPageHero: {
    alt: 'Alt tag1',
    img: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/png/landing_Hero_Graphic.png',
  },
  landingPageStatsBar: [
    {
      statTitle: 'Programs',
      statAPI: 'numberOfPrograms',
    },
    {
      statTitle: 'Arms',
      statAPI: 'numberOfStudies',
    },
    {
      statTitle: 'Cases',
      statAPI: 'numberOfSubjects',
    },
    {
      statTitle: 'samples',
      statAPI: 'numberOfSamples',
    },
    {
      statTitle: 'files',
      statAPI: 'numberOfFiles',
    },
  ],
  tile1: {
    alt: '',
    img: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/png/landing_tileAbout.png',
    titleText: 'The Bento Framework',
    descriptionText: 'Effective data management is key to scientific discovery. Bento is an open source framework, developed by the Frederick National Laboratory for Cancer Research, to support the creation of data sharing platforms, that adhere to the FAIR principles of scientific data management.',
    callToActionText: 'Read More',
    callToActionLink: '/bento', // This links to the "About" static page.
  },
  tile2: {
    alt: '',
    img: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/png/landing_tileProgam.png',
    titleText: 'Programs',
    descriptionText: 'Access data from the TAILORx clinical trial, on this data sharing platform, built on Bento.',
    callToActionText: 'View',
    callToActionLink: '/programs', // This links to the Programs Listing Page.
  },
  tile3: {
    alt: '',
    img: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/png/landing_tileAnalytics.png',
    titleText: 'Resources',
    descriptionText: 'Use Bento to build your own data sharing platform.',
    callToActionText: 'Read More',
    callToActionLink: '/resources', // Link to the "Resources" Static Page
  },
  tile4: {
    alt: '',
    img: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/png/landing_tileCases.png',
    titleText: 'Cases',
    descriptionText: 'Analyze cases from the TAILORx clinical trial.',
    callToActionText: 'Explore',
    callToActionLink: '/explore', // This links to the cases dashboard.
  },
};

// --------------- GraphQL query - Retrieve Landing page data --------------
export const GET_LANDING_PAGE_DATA_QUERY = gql`
query search(
    $clinical_trial_designation : [String],
    $clinical_trial_id : [String],
    $pubmed_id : [String],
    $trial_arm : [String],
    $disease : [String],
    $gender : [String],
    $race : [String],
    $ethnicity : [String],
    $file_type : [String],
    $file_format : [String]
){
    searchCases(
        clinical_trial_designation: $clinical_trial_designation
        clinical_trial_id: $clinical_trial_id
        pubmed_id: $pubmed_id
        trial_arm: $trial_arm
        disease: $disease
        gender: $gender
        race: $race
        ethnicity: $ethnicity
        file_type: $file_type
        file_format: $file_format
    ){
        numberOfTrials
        numberOfCases
        numberOfFiles
        numberOfArms
        numberOfDiagnoses
        numberOfFileTypes
        diagnosisCountByArm{
            arm_id
            diagnoses
        }
        armCountByTrial{
            group
            subjects
        }
        trialsAndArms{
            trials
            caseSize
            arms{
                arm
                caseSize
            }
        }
        casesCountBaseOnTrialId{
            group
            subjects
        }
        casesCountBaseOnTrialCode{
            group
            subjects
        }
        casesCountBaseOnPubMedID{
            group
            subjects
        }
        casesCountBaseOnGender{
            group
            subjects
        }
        casesCountBaseOnRace{
            group
            subjects
        }
        casesCountBaseOnEthnicity{
            group
            subjects
        }
        casesCountBaseOnDiagnoses{
            group
            subjects
        }
        casesCountBaseOnFileType{
            group
            subjects
        }
        casesCountBaseOnFileFormat{
            group
            subjects
        }
        casesCountBaseOnTrialArm{
            group
            subjects
        }
    }
}
`;
