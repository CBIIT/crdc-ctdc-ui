import gql from 'graphql-tag';

export const statsStyling = {
  global: {
    horizontalStyle: false,
    statTitleFirst: false,
    height: '50px',
    background: '#47AEC3',
  },
  statsGroup: {
    margin: '8px 40px 0px 0px',
    padding: '0px',
    borderRight: 'none',
    '&:first-child': {
      padding: '0px 60px 0px 90px',
    },
    '&:last-child': {
      padding: '0px 40px 0px 0px',
    },
  },
  statsIcon: {
    margin: '0px 0px 0px -35px',
    '&:second-child': {
      paddingTop: '20px',
      marginTop: '20px'
    }
  },
  statCount: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: 'Oswald',
    fontSize: '20px',
    margin: '-5px 0px -4px 10px',
    paddingTop: '0px',
    // lineHeight: 17px
  },
  statTitle: {
    color: '#062D4F',
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: '12px',
    textTransform: 'none',
    margin: '0px 0px 0px 10px',
  },
};

export const globalStatsData = [
  // A maximum of 6 stats are allowed
  {
    statTitle: 'TRIALS',
    type: 'field',
    statAPI: 'numberOfStudies',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/ctdc-explore-stats-bar-icons/ctdc/images/svg/ExploreStatsBarTrialsIcon.svg',
    statIconAlt: 'TRIALS Stats Bar Icon',
  },
  {
    statTitle: 'PARTICIPANTS',
    type: 'field',
    statAPI: 'numberOfParticipants',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/ctdc-explore-stats-bar-icons/ctdc/images/svg/ExploreStatsBarParticipantsIcon.svg',
    statIconAlt: 'PARTICIPANTS Stats Bar Icon',
  },
  {
    statTitle: 'DIAGNOSES',
    type: 'field',
    statAPI: 'numberOfDiagnoses',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/ctdc-explore-stats-bar-icons/ctdc/images/svg/ExploreStatsBarDiagnosesIcon.svg',
    statIconAlt: 'DIAGNOSES Stats Bar Icon',
  },
  {
    statTitle: 'THERAPIES',
    type: 'field',
    statAPI: 'numberOfTargetedTherapies',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/ctdc-explore-stats-bar-icons/ctdc/images/svg/ExploreStatsBarTargetedTherapiesIcon.svg',
    statIconAlt: 'TARGETED THERAPIES Stats Bar Icon',
  },
  {
    statTitle: 'BIOSPECIMENS',
    type: 'field',
    statAPI: 'numberOfSpecimens',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/ctdc-explore-stats-bar-icons/ctdc/images/svg/ExploreStatsBarBiospecimensIcon.svg',
    statIconAlt: 'BIOSPECIMENS Stats Bar Icon',
  },
  {
    statTitle: 'FILES',
    type: 'field',
    statAPI: 'numberOfFiles',
    statIconSrc: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/ctdc-explore-stats-bar-icons/ctdc/images/svg/ExploreStatsBarFilesIcon.svg',
    statIconAlt: 'FILES Stats Bar Icon',
  },
];

// --------------- GraphQL query - Retrieve stats details --------------
export const GET_GLOBAL_STATS_DATA_QUERY = gql`
{
  numberOfStudies
  numberOfParticipants
  numberOfDiagnoses
  numberOfTargetedTherapies
  numberOfSpecimens
  numberOfFiles
}`;
