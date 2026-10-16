import gql from 'graphql-tag';
import dataVolumeIcon from '../assets/portfolio/stat-data-volume.svg';
import programIcon from '../assets/portfolio/stat-program.svg';
import studiesIcon from '../assets/portfolio/stat-studies.svg';
import participantsIcon from '../assets/portfolio/stat-participants.svg';
import biospecimensIcon from '../assets/portfolio/stat-biospecimens.svg';
import filesIcon from '../assets/portfolio/stat-files.svg';

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
    height: '43px',
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
  // Matches Figma design (node 1597:38231, "CTDC Statsbar - New Draft") exactly: Data Volume, Program,
  // Studies, Participants, Biospecimens, Files - no Diagnoses/Targeted Therapies. This is a shared component
  // so this also changes the Explore Dashboard and Study page counter strips, per design parity (AC#5).
  {
    // NOTE: statAPI 'volumeOfData' is not yet returned by GET_GLOBAL_STATS_DATA_QUERY below (no backend field
    // exists yet); StatsView defaults missing values to 0 until the query is updated to request this field.
    statTitle: 'DATA VOLUME',
    type: 'field',
    statAPI: 'volumeOfData',
    statIconSrc: dataVolumeIcon,
    statIconAlt: 'Data Volume Stats Bar Icon',
  },
  {
    // NOTE: statAPI 'numberOfPrograms' is not yet returned by GET_GLOBAL_STATS_DATA_QUERY below (depends on
    // CTDC-2067); StatsView defaults missing values to 0 until the query is updated to request this field.
    statTitle: 'PROGRAM',
    type: 'field',
    statAPI: 'numberOfPrograms',
    statIconSrc: programIcon,
    statIconAlt: 'Programs Stats Bar Icon',
  },
  {
    statTitle: 'STUDIES',
    type: 'field',
    statAPI: 'numberOfStudies',
    statIconSrc: studiesIcon,
    statIconAlt: 'Studies Stats Bar Icon',
  },
  {
    statTitle: 'PARTICIPANTS',
    type: 'field',
    statAPI: 'numberOfParticipants',
    statIconSrc: participantsIcon,
    statIconAlt: 'Participants Stats Bar Icon',
  },
  {
    statTitle: 'BIOSPECIMENS',
    type: 'field',
    statAPI: 'numberOfSpecimens',
    statIconSrc: biospecimensIcon,
    statIconAlt: 'Biospecimens Stats Bar Icon',
  },
  {
    statTitle: 'FILES',
    type: 'field',
    statAPI: 'numberOfFiles',
    statIconSrc: filesIcon,
    statIconAlt: 'Files Stats Bar Icon',
  },
];



// --------------- GraphQL query - Retrieve stats details --------------
export const GET_GLOBAL_STATS_DATA_QUERY = gql`
  query globalStatsQuery(
    $participant_id: [String],

    $study_short_name: [String],
    $ctep_disease_term: [String],
    $stage_of_disease: [String],
    $tumor_grade: [String],
    $sex: [String],
    $race: [String],
    $ethnicity: [String],
    $carcinogen_exposure: [String],
    $targeted_therapy_string: [String], # $targeted_therapy: [String],

    $anatomical_collection_site: [String],
    $tissue_category: [String],
    $assessment_timepoint: [String],

    $data_file_type: [String],
    $data_file_format: [String]

    $files_association: [String],
    $study_association: [String],
  ) {
    searchParticipants(
      participant_id: $participant_id

      study_short_name: $study_short_name
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      targeted_therapy_string: $targeted_therapy_string # targeted_therapy: $targeted_therapy

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
        numberOfStudyFiles
      }
    filesTabCount: searchParticipants(
      participant_id: $participant_id

      study_short_name: $study_short_name
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      targeted_therapy_string: $targeted_therapy_string

      anatomical_collection_site: $anatomical_collection_site
      tissue_category: $tissue_category
      assessment_timepoint: $assessment_timepoint

      data_file_type: $data_file_type
      data_file_format: $data_file_format
      association: $files_association
    ) {
      numberOfFiles
    }
    studyFilesTabCount: searchParticipants(
      participant_id: $participant_id

      study_short_name: $study_short_name
      ctep_disease_term: $ctep_disease_term
      stage_of_disease: $stage_of_disease
      tumor_grade: $tumor_grade
      sex: $sex
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      targeted_therapy_string: $targeted_therapy_string

      anatomical_collection_site: $anatomical_collection_site
      tissue_category: $tissue_category
      assessment_timepoint: $assessment_timepoint

      data_file_type: $data_file_type
      data_file_format: $data_file_format
      association: $study_association
    ) {
      numberOfStudyFiles
    }
  }
`;
