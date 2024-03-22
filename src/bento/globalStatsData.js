import gql from 'graphql-tag';

export const statsStyling = {
  global: {
    horizontalStyle: false,
    statTitleFirst: false,
    height: '50px',
    background: '#47AEC3',
  },
  statsGroup: {
    margin: '6px 9.25px',
    padding: '0.1% 10% 2% 6%',
    borderRight: 'none',
    '&:first-child': {
      padding: '0.1% 6% 2% 6%',
    },
    '&:nth-child(2)': {
      '& $statsIcon': { // Targeting statsIcon inside the second child
        marginTop: '4px',
      },
    },
    '&:last-child': {
      padding: '0.1% 6% 2% 6%',
    },
  },
  statsIcon: {
    width: '40px',
    height: '45px',
    margin: '0px 0px 0px -45px',
    position: 'relative',
  },
  statCount: {
    color: '#062D4F',
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
    statTitle: 'THERAPIES',
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
          $specimen_category: [String],
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
      specimen_category: $specimen_category
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
