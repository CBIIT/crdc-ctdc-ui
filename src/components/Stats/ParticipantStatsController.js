import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import CircularProgress from "@material-ui/core/CircularProgress";
import StatsView from "./StatsView";

const PARTICIPANT_DETAIL_STATS_QUERY = gql`
  query search(
    $participant_id: [String]
    $files_association: [String]
    $study_association: [String]
  ) {
    searchParticipants(participant_id: $participant_id) {
      numberOfStudies
      numberOfParticipants
      numberOfDiagnoses
      numberOfTargetedTherapies
      numberOfSpecimens
      numberOfFiles
    }
    filesTabCount: searchParticipants(
      participant_id: $participant_id
      association: $files_association
    ) {
      numberOfFiles
    }
    studyFilesTabCount: searchParticipants(
      participant_id: $participant_id
      association: $study_association
    ) {
      numberOfStudyFiles
    }
  }
`;

const ParticipantStatsController = ({ participantId }) => {
  const variables = React.useMemo(
    () =>
      participantId
        ? {
            participant_id: [participantId],
            files_association: ["biospecimen", "participant"],
            study_association: ["study"],
          }
        : {},
    [participantId],
  );
  const { loading, error, data } = useQuery(PARTICIPANT_DETAIL_STATS_QUERY, {
    variables,
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error("Failed to load participant-scoped stats.", error);
    return <CircularProgress />;
  }

  const statsData = {
    ...data?.searchParticipants,
    numberOfFiles:
      data?.filesTabCount?.numberOfFiles ??
      data?.searchParticipants?.numberOfFiles,
    numberOfStudyFiles:
      data?.studyFilesTabCount?.numberOfStudyFiles ??
      data?.searchParticipants?.numberOfStudyFiles,
  };

  return <StatsView data={statsData} />;
};

export default ParticipantStatsController;
