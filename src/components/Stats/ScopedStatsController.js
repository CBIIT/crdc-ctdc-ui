/**
 * ScopedStatsController - Generic statistics bar for detail pages
 *
 * Displays filtered statistics for entity detail pages or global stats when no filters provided.
 * Automatically adds association filters for accurate Data Files vs Study Files counting.
 * Apollo Client filters out unsupported variables before sending to server.
 *
 * @param {Object} variables - searchParticipants filter variables (study_short_name, participant_id, etc.)
 *                             Empty/null returns global stats. Invalid variables ignored by Apollo.
 * @example
 * <ScopedStatsController variables={{ study_short_name: ["COTC007B"] }} />
 * <ScopedStatsController variables={{ participant_id: ["P001"] }} />
 * <ScopedStatsController variables={{}} /> // global stats
 */

import React from "react";
import { useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import StatsView from "./StatsView";
import { defaultFilters } from "../../bento/dashboardTabData";
import { GET_GLOBAL_STATS_DATA_QUERY } from "../../bento/globalStatsData";

const ScopedStatsController = ({ variables }) => {
  // Merge parent filters with association filters (for accurate file counts)
  const queryVariables = React.useMemo(() => {
    const vars = {
      files_association: defaultFilters.files.association,
      study_association: defaultFilters.studyFiles.association,
    };

    if (
      variables &&
      typeof variables === "object" &&
      Object.keys(variables).length > 0
    ) {
      Object.entries(variables).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return;
        }

        if (Array.isArray(value)) {
          const validItems = value.filter(
            (item) => item !== null && item !== undefined,
          );
          if (validItems.length > 0) {
            vars[key] = validItems;
          }
          return;
        }

        vars[key] = value;
      });
    }

    return vars;
  }, [variables]);

  const { loading, error, data } = useQuery(GET_GLOBAL_STATS_DATA_QUERY, {
    variables: queryVariables,
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error("Failed to load scoped stats:", error);
    return <StatsView data={{}} />;
  }

  // Override file counts with association-filtered queries (Data Files vs Study Files)
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

export default ScopedStatsController;
