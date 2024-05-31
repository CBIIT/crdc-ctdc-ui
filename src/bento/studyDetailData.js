import gql from 'graphql-tag';

// --------------- Tooltip configuration --------------
export const tooltipContent = {
  src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/icdc/images/svgs/Tooltip.SpeechBubble.svg',
  alt: 'tooltipIcon',
};

export const title = {
  studyFile: '',
  armsAndCohort: '',
};



export const headerIcon = 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/Icon-TrialDetail.svg';
export const externalIcon = 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExternalLinkIcon.svg';

export const tab = {
  items: [
    {
      index: 0,
      label: 'OVERVIEW',
      value: 'overview',
    },
  ],
};

export const biospecimenProfile = {
  tabs: [
    {
      index: 0,
      label: 'TIMEPOINT',
      value: 'specimen_timepoints',
    },
    {
      index: 1,
      label: 'BIOSPECIMENS',
      value: 'parent_specimen_types',
    },
  ],
};

export const palette = ['#2A4B83', '#9F2A23', '#A8C4DF', '#CC703E', '#DFC798', '#C2C1C0', '#517D98', '#0B3556', '#1D79A8', '#FF7F15', '#39C0F0', '#8E9CEF', '#4BC41E' ];

/* * Xaxis config value */
export const argumentConfiguration = {
  field: 'group',
  visible: false,
  position: 'inside',
  size: 12,
  title: {
    text: 'Biospecimens',
    size: 13,
    color: '#444444',
    weight: 500,
    family: 'Inter',
  },
  label: {
    size: 20,
    position: 'outside',
    staggeringSpacing: 19,
  },
};

/* * Xaxis config value */
export const timePointArgumentConfiguration = {
  ...argumentConfiguration,
  title: {
    ...argumentConfiguration.title,
    text: 'Collection Timepoint',
  }
};

/* * Yaxis config value */
export const valueConfiguration = {
  field: 'count',
  size: 12,
  allowDecimals: false,
  title: {
    text: 'Biospecimen Count',
    size: 13,
    color: '#444444',
    weight: 500,
    family: 'Inter',
  },
  chartGrid: {
    visible: true,
  },
  label: {
    size: 12,
    position: 'outside',
  },
  tick: {
    visible: true,
  },
};

/** common series setting */
export const seriesSetting = {
  maxBarWidth: 16,
};

// --------------- GraphQL query configuration --------------
export const GET_STUDY_DETAIL_DATA_QUERY = gql`
query studyByStudyShortNameQueries($study_short_name: [String]) {
 
  studyByStudyShortName(study_short_name: $study_short_name) {
    study_id
    study_name
    study_short_name
    study_description
    study_type
    dates_of_conduct
    participant_count
    associated_links {
      associated_link_name
      associated_link_url
      associated_link_id
    }
    image_collection {
      image_collection_name
      repository_name
      image_collection_url
      image_type_included
      collection_access
    }
  }

   studyDiagnosisByStudyShortName(study_short_name: $study_short_name) {
    ctep_disease_terms
  }

   StudyDataFileByStudyShortName(study_short_name: $study_short_name) {
    list_type
    study_data_files{
      data_file_uuid
      data_file_name
      data_file_format
    }
  }

  StudySpecimenByStudyShortName(study_short_name: $study_short_name) {
    parent_specimen_types{
        group
        count
    }
    specimen_timepoints{
       group
       count
    }
    sample_count
  }
}

`;


//   query studyByIdQueries( $ids: [String],$id: String!){
//    searchParticipant(study_id: $ids){
//         participantCountBaseOnStudyId{
//             group
//             subjects
//         }
//     }
//   studySpecimenTypeCount(study_id: [$id]) {
//     group
//     count
//   }
//   studySpecimenTimePointCount(study_id: [$id]) {
//     group
//     count
//   }
//   studyByStudyId(study_id: $id) {
//       study_id
//       study_name
//       study_short_name
//       study_description
//       study_type
//       dates_of_conduct
//       associated_link{
//         associated_link_name
//         associated_link_url
//       }
//       diagnosis {
//         ctep_disease_code
//       }
//       data_file {
//         data_file_type
//       }
//       image_collection {
//           image_collection_name
//           repository_name
//           image_collection_url
//           image_type_included
//           collection_access
//     }
//   }
// }
// `;
