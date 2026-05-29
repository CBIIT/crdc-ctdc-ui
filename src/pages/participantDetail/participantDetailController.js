import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '../../components/Wrappers/Wrappers';
import ParticipantDetailView from './participantDetailView';
import {
  GET_BIOSPECIMENS_OVERVIEW_QUERY,
  GET_FILES_OVERVIEW_QUERY,
  GET_PARTICIPANTS_OVERVIEW_QUERY,
} from '../../bento/dashboardTabData';

const ParticipantDetailController = ({ match }) => {
  const participant_id = match.params.id;

  const {
    loading: participantLoading,
    error: participantError,
    data: participantOverviewData,
  } = useQuery(GET_PARTICIPANTS_OVERVIEW_QUERY, {
    variables: { participant_id: [participant_id] },
  });

  const {
    loading: biospecimensLoading,
    error: biospecimensError,
    data: biospecimensData,
  } = useQuery(GET_BIOSPECIMENS_OVERVIEW_QUERY, {
    variables: {
      participant_id: [participant_id],
      first: 100,
      offset: 0,
      order_by: 'specimen_record_id',
      sort_direction: 'asc',
    },
  });

  const {
    loading: filesLoading,
    error: filesError,
    data: filesData,
  } = useQuery(GET_FILES_OVERVIEW_QUERY, {
    variables: { participant_id: [participant_id] },
  });

  if (participantLoading || biospecimensLoading || filesLoading) {
    return <CircularProgress />;
  }

  if (participantError || !participantOverviewData?.participantOverview?.length) {
    return (
      <Typography variant="headline" color="error" size="sm">
        {participantError
          ? `An error has occurred in loading participant detail: ${participantError}`
          : 'No data available for this participant.'}
      </Typography>
    );
  }
  if (biospecimensError) {
    console.error('[ParticipantDetail] biospecimenOverview query error:', biospecimensError);
  }
  if (filesError) {
    console.error('[ParticipantDetail] fileOverview query error:', filesError);
  }

  const overviewRecord = participantOverviewData.participantOverview[0];
  const biospecimenRecord = biospecimensData?.biospecimenOverview?.[0] || {};

  const formatPipeList = (val) => (val && val !== '[]'
    ? val.split('|').map((t) => t.trim()).join(', ')
    : null);

  const participantData = {
    participant_id,
    age_at_enrollment: overviewRecord.age_at_enrollment,
    sex: overviewRecord.sex,
    race: overviewRecord.race,
    ethnicity: overviewRecord.ethnicity,
    stage_of_disease: overviewRecord.stage_of_disease,
    primary_diagnosis_disease_group: overviewRecord.ctep_disease_term,
    targeted_therapy: formatPipeList(overviewRecord.targeted_therapy_string),
    best_response_to_targeted_therapy: formatPipeList(overviewRecord.best_response_to_targeted_therapy),
    primary_disease_site: biospecimenRecord.primary_disease_site,
  };

  const biospecimens = (biospecimensData?.biospecimenOverview || []).map((b) => ({
    ...b,
    age_at_enrollment: overviewRecord.age_at_enrollment,
    sex: overviewRecord.sex,
    race: overviewRecord.race,
    targeted_therapy: formatPipeList(overviewRecord.targeted_therapy_string),
  }));

  return (
    <ParticipantDetailView
      participant={participantData}
      biospecimens={biospecimens}
      files={filesData?.fileOverview || []}
    />
  );
};

export default ParticipantDetailController;
