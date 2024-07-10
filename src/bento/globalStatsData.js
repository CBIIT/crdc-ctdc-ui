import gql from 'graphql-tag';

export const statsStyling = {
  global: {
    horizontalStyle: false,
    statTitleFirst: false,
    height: '50px',
    background: '#47AEC3',
  },
  box: {
    '@media (max-width: 860px)': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',

      '& > *': {
        flexBasis: '33.33%',
        height: '47px'
      },
      '& > *:nth-child(3), & > *:last-child': {
        width: '140px',
        maxWidth: '140px',
        height: '47px'
      },
    },
    '@media (max-width: 610px)': {
      marginLeft: '16px',
      '& > *': {
        flexBasis: '50%',
        height: '47px'
      },
      '& > *:nth-child(3), & > *:last-child': {
        width: '50%',
        maxWidth: '50%',
      },
      '& > *:nth-child(1), & > *:nth-child(3), & > *:nth-child(5)': {
        width: 'calc(50% - 50px)',
        maxWidth: 'calc(50% - 50px)',
      },
    },
    '@media (max-width: 425px)': {
      alignItem: 'center',
      paddingLeft: '16px',
      margin: 'auto',
      '& > *': {
        flexBasis: '100%',
        height: '47px'
      },
      '& > *:nth-child(3), & > *:last-child': {
        width: '100%',
        maxWidth: '100%',
      },
      '& > *:nth-child(1), & > *:nth-child(3), & > *:nth-child(5)': {
        width: '100%',
        maxWidth: '100%',
      },
    }
  },
  statsGroup: {
    height: '47px',
    borderRight: 'none',
    margin: '0px',
    padding: '4px 80px 10px 40px',

    '&:nth-child(2)': {
      '& $statsIcon': { // Targeting statsIcon inside the second child
        marginTop: '4px',
      },
    },
    '&:nth-child(5)': {
      '& $statsIcon': { // Targeting statsIcon inside the fifth child
        marginTop: '2px',
      },
    },
    '&:last-child': {
      padding: '4px 0px 10px 40px'
    },

    '@media (max-width: 1200px)': {
      padding: '4px 15px 10px 40px',
    },
    '@media (max-width: 880px)': {
      padding: '4px 15px 10px 40px',
    },
    '@media (max-width: 425px)': {
      margin: 'auto 30%',
      width: 'fit-content',
    }
  },
  statsIcon: {
    width: '40px',
    height: '45px',
    margin: '0px 0px 0px -40px',
    position: 'relative',
  },
  statCount: {
    color: '#062D4F',
    fontWeight: '500',
    fontFamily: 'Oswald',
    fontSize: '20px',
    margin: '-5px 0px -4px 8px',
    paddingTop: '2px',
    // lineHeight: 17px
  },
  statTitle: {
    color: '#062D4F',
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: '12px',
    textTransform: 'none',
    margin: '0px 0px 0px 8px',
    width: 'fit-content',
    whiteSpace: 'nowrap',
  },
};

export const globalStatsData = [
  // A maximum of 6 stats are allowed
  {
    statTitle: 'STUDIES',
    type: 'field',
    statAPI: 'numberOfStudies',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExploreStatsBarTrialsIcon.svg',
    statIconAlt: 'Studies Stats Bar Icon',
  },
  {
    statTitle: 'PARTICIPANTS',
    type: 'field',
    statAPI: 'numberOfParticipants',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExploreStatsBarParticipantsIcon.svg',
    statIconAlt: 'Participants Stats Bar Icon',
  },
  {
    statTitle: 'DIAGNOSES',
    type: 'field',
    statAPI: 'numberOfDiagnoses',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExploreStatsBarDiagnosesIcon.svg',
    statIconAlt: 'Diagnoses Stats Bar Icon',
  },
  {
    statTitle: 'TARGETED THERAPIES',
    type: 'field',
    statAPI: 'numberOfTargetedTherapies',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExploreStatsBarTargetedTherapiesIcon.svg',
    statIconAlt: 'Targeted Therapies Stats Bar Icon',
  },
  {
    statTitle: 'BIOSPECIMENS',
    type: 'field',
    statAPI: 'numberOfSpecimens',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExploreStatsBarBiospecimensIcon.svg',
    statIconAlt: 'Biospecimens Stats Bar Icon',
  },
  {
    statTitle: 'FILES',
    type: 'field',
    statAPI: 'numberOfFiles',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExploreStatsBarFilesIcon.svg',
    statIconAlt: 'Files Stats Bar Icon',
  },
];

// --------------- GraphQL query - Retrieve stats details --------------
export const GET_GLOBAL_STATS_DATA_QUERY = gql`
  query search(
    $subject_id: [String],
    $ctep_disease_term: [String],
    $stage_of_disease: [String],
    $tumor_grade: [String], 
    $sex: [String], 
    $reported_gender: [String], 
    $race: [String], $ethnicity: [String],
    $carcinogen_exposure: [String], 
    $targeted_therapy: [String],
    $anatomical_collection_site: [String],
    $tissue_category: [String],
    $assessment_timepoint: [String],
    $data_file_type: [String],
    $data_file_format: [String]) {
    searchParticipants(
      subject_id: $subject_id
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      reported_gender: $reported_gender
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      targeted_therapy: $targeted_therapy
      anatomical_collection_site: $anatomical_collection_site
      tissue_category: $tissue_category
      assessment_timepoint: $assessment_timepoint
      data_file_type: $data_file_type
      data_file_format: $data_file_format
    ) {
        numberOfStudies
        numberOfParticipants
        numberOfDiagnoses
        numberOfTargetedTherapies
        numberOfSpecimens
        numberOfFiles
      }
    }
`;
