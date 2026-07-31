/**
 * ScopedStatsController - Statistics bar for detail pages
 *
 * Displays filtered statistics for a specific entity (Study, Participant, etc.)
 * or global stats when no filters provided. Automatically includes association
 * filters to get accurate file counts (Data Files vs Study Files).
 *
 * Note: Unsupported variables are filtered out by Apollo Client before the HTTP request.
 *
 * @param {Object} variables - searchParticipants filter variables or empty for global stats
 *
 * @example <ScopedStatsController variables={{ study_short_name: ["COTC007B"] }} />
 * @example <ScopedStatsController variables={{ participant_id: ["P001"] }} />
 * @example <ScopedStatsController variables={{}} />
 */

import React from "react";
import { useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import StatsView from "./StatsView";
import { defaultFilters } from "../../bento/dashboardTabData";
import { GET_GLOBAL_STATS_DATA_QUERY } from "../../bento/globalStatsData";

const ScopedStatsController = ({ variables }) => {
  // Build query variables by merging parent-provided filters with association filters.
  // If no filters are provided, only association filters are sent, which returns global stats.
  const queryVariables = React.useMemo(() => {
    // Always include association filters - these determine which files are counted:
    // files_association: biospecimen/participant files (Data Files tab)
    // study_association: study-level files (Study Files tab)
    const vars = {
      files_association: defaultFilters.files.association,
      study_association: defaultFilters.studyFiles.association,
    };

    // Merge in parent-provided filter variables (study_short_name, participant_id, etc.)
    // If no filters provided, vars will only contain association filters → returns global stats
    if (
      variables &&
      typeof variables === "object" &&
      Object.keys(variables).length > 0
    ) {
      Object.entries(variables).forEach(([key, value]) => {
        // Skip null/undefined to avoid sending invalid filter values to GraphQL
        if (value === null || value === undefined) {
          return;
        }

        // For array values, filter out null/undefined items to prevent GraphQL errors
        // Only include the array if it has at least one valid item
        if (Array.isArray(value)) {
          const validItems = value.filter(
            (item) => item !== null && item !== undefined,
          );
          if (validItems.length > 0) {
            vars[key] = validItems;
          }
          return;
        }

        // Include all other valid values (strings, numbers, booleans)
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

  // Merge stats data with overridden file counts from association-filtered queries.
  // WHY: The main searchParticipants query returns ALL files, but we need separate
  // counts for Data Files vs Study Files based on their association type.
  // GET_GLOBAL_STATS_DATA_QUERY runs 3 queries:
  //   1. searchParticipants - main stats (studies, participants, diagnoses, etc.)
  //   2. filesTabCount - files with biospecimen/participant association (Data Files)
  //   3. studyFilesTabCount - files with study association (Study Files)
  // We use ?? (nullish coalescing) to fall back to main query if sub-queries fail.
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
