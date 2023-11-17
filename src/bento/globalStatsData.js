import gql from 'graphql-tag';

export const statsStyling = {
  global: {
    horizontalStyle: false,
    statTitleFirst: false,
    height: '66px',
    background: '#8DCAFF',
  },
  statsGroup: {
    margin: '6px 9.25px',
    padding: '0.1% 10% 2% 6%',
    borderRight: '1px solid #0B3556',
    '&:first-child': {
      padding: '0.1% 6% 2% 6%',
    },
    '&:last-child': {
      padding: '0.1% 6% 2% 6%',
    },
  },
  statsIcon: {
    width: '40px',
    height: '45px',
    margin: '2px 0px 0px -45px',
    position: 'relative',
  },
  statCount: {
    color: '#0467BD',
    fontFamily: 'Oswald',
    fontSize: '20px',
    lineHeight: '17px',
    letterSpacing: '0.02em',
    margin: '4px 0 2px 13px',
  },
  statTitle: {
    color: '#062D4F',
    fontFamily: 'Nunito',
    fontSize: '12px',
    fontWeight: '700',
    lineHeight: '16px',
    textTransform: 'uppercase',
    margin: '0 0 0 13px',
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
     $snomed_disease_term: [String],
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
      snomed_disease_term: $snomed_disease_term
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
