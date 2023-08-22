import React from 'react';
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

export const headerIcon = 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/trialDetail/ctdc/images/svg/Icon-TrialDetail.svg';
export const externalIcon = 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/trialDetail/ctdc/images/svg/ExternalLinkIcon.svg';
export const sampleProfile = {
  tabs: [
    {
      index: 0,
      label: 'SITE',
      value: 'studySampleSiteCount',
    },
    {
      index: 1,
      label: 'TYPE',
      value: 'studySampleTypeCount',
    },
    {
      index: 2,
      label: 'PATHOLOGY',
      value: 'studySamplePathologyCount',
    },
  ],
};

export const tab = {
  items: [
    {
      index: 0,
      label: 'OVERVIEW',
      value: 'overview',
    },
    {
      index: 1,
      label: 'ADDITIONAL DETAILS',
      value: 'additional_details',
      disable: true,
    },
  ],
};
// --------------- GraphQL query configuration --------------
export const GET_TRIAL_DETAIL_DATA_QUERY = gql`
  query studyByIdQueries( $ids: [String],$id: String!){
   searchParticipant(study_id: $ids){
        participantCountBaseOnStudyId{
            group
            subjects
        }
    }
  studySpecimenTypeCount(study_id: [$id]) {
    group
    count
  }
  studySpecimenTimePointCount(study_id: [$id]) {
    group
    count
  }
  studyByStudyId(study_id: $id) {
      study_id
      study_name
      study_short_name
      study_description
      study_type
      dates_of_conduct
      associated_link{
        associated_link_name
        associated_link_url
      }
      diagnosis {
        ctep_disease_code
      }
      data_file {
        data_file_type
      }
      image_collection {
          image_collection_name
          repository_name
          image_collection_url
          image_type_included
          collection_access
    }
  }
}
`;
