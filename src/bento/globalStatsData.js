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
  query search(
    $subject_id: [String],
     $ctep_disease_code: [String],
      $stage_of_disease: [String],
       $tumor_grade: [String], 
       $sex: [String], 
       $reported_gender: [String], 
       $race: [String], $ethnicity: [String],
        $carcinogen_exposure: [String], 
        $targeted_therapy: [String],
         $anatomical_collection_site: [String],
          $specimen_type: [String],
           $tissue_category: [String],
            $assessment_timepoint: [String],
             $data_file_type: [String],
              $data_file_format: [String]) {
    searchParticipants(
      subject_id: $subject_id
      ctep_disease_code: $ctep_disease_code
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      reported_gender: $reported_gender
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      targeted_therapy: $targeted_therapy
      anatomical_collection_site: $anatomical_collection_site
      specimen_type: $specimen_type
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
