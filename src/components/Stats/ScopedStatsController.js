/**
 * ScopedStatsController
 *
 * OBJECTIVE:
 * Generic statistics bar controller that displays filtered statistics for detail pages.
 * Accepts any GraphQL query variables to filter stats, making it reusable across different
 * contexts (study detail, participant detail, or any custom filtering scenario).
 *
 * WHAT IT DOES:
 * 1. Accepts GraphQL query variables from parent component
 * 2. Automatically merges in association filters for accurate file counts
 * 3. Executes GraphQL queries to fetch statistics for the filtered scope
 * 4. Calculates file counts using separate queries with association filters:
 *    - Data Files: Files associated with 'biospecimen' or 'participant'
 *    - Study Files: Files associated with 'study'
 * 5. Renders the statistics bar with the filtered counts
 *
 * USAGE EXAMPLES:
 *
 * // Study Detail Page
 * <ScopedStatsController variables={{ study_short_name: ["COTC007B"] }} />
 *
 * // Participant Detail Page
 * <ScopedStatsController variables={{ participant_id: ["PARTICIPANT_001"] }} />
 *
 * // Custom Filtering (any searchParticipants filter)
 * <ScopedStatsController variables={{ ctep_disease_term: ["Breast Cancer"], sex: ["Female"] }} />
 *
 * WHY SEPARATE FILE QUERIES:
 * Files have different association types in the data model. To show accurate counts
 * in the Files tab vs Study Files tab, we need to query them separately with the
 * 'association' filter parameter. This component automatically handles this complexity.
 *
 * WHY THIS APPROACH IS BETTER:
 * - More flexible: Any searchParticipants filter can be used without modifying the component
 * - Less coupling: Component doesn't need to know about specific filter types
 * - Easier to extend: New filter types work automatically
 * - Parent controls filtering: Parent components build and pass their own filter variables
 */

import React from "react";
import { useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import StatsView from "./StatsView";
import { defaultFilters } from "../../bento/dashboardTabData";
import { SCOPED_STATS_QUERY } from "../../bento/globalStatsData";

/**
 * ScopedStatsController Component
 *
 * Displays a statistics bar with counts filtered by any query variables.
 * Automatically includes association filters for accurate file counts.
 *
 * @param {Object} props - Component props
 * @param {Object} props.variables - GraphQL query variables to filter stats.
 *                                   Any valid searchParticipants filter can be used.
 *                                   Association filters are automatically merged.
 *                                   Parent components must build and pass filter variables.
 *
 * @returns {JSX.Element} Statistics bar component or loading spinner
 *
 * @example
 * // Study Detail Page
 * <ScopedStatsController variables={{ study_short_name: ["COTC007B"] }} />
 *
 * @example
 * // Participant Detail Page
 * <ScopedStatsController variables={{ participant_id: ["PARTICIPANT_001"] }} />
 *
 * @example
 * // Custom Filtering
 * <ScopedStatsController variables={{ ctep_disease_term: ["Breast Cancer"], sex: ["Female"] }} />
 */
const ScopedStatsController = ({ variables }) => {
  /**
   * Build query variables by merging:
   * 1. Default association filters (always included for accurate file counts)
   * 2. Variables passed from parent component
   *
   * Parent components are responsible for building their filter variables.
   */
  const queryVariables = React.useMemo(() => {
    // Start with default association filters for accurate file counts
    const vars = {
      // Association filters determine which files are counted:
      // - files_association: Files linked to biospecimens/participants (Data Files tab)
      // - study_association: Files linked to studies (Study Files tab)
      files_association: defaultFilters.files.association,
      study_association: defaultFilters.studyFiles.association,
    };

    // Merge variables from parent if provided and valid
    // Filter out null, undefined, empty arrays, and arrays containing only null/undefined values
    if (
      variables &&
      typeof variables === "object" &&
      Object.keys(variables).length > 0
    ) {
      Object.entries(variables).forEach(([key, value]) => {
        // Skip null or undefined values
        if (value === null || value === undefined) {
          return;
        }

        // For arrays, skip if empty or contains only null/undefined values
        if (Array.isArray(value)) {
          const validItems = value.filter(
            (item) => item !== null && item !== undefined,
          );
          if (validItems.length > 0) {
            vars[key] = validItems;
          }
          return;
        }

        // Merge all other valid values
        vars[key] = value;
      });
    }

    return vars;
  }, [variables]);

  /**
   * Check if we have any actual filter variables beyond the default association filters.
   * If only association filters are present, skip the query to avoid fetching all data.
   */
  const hasValidFilters = React.useMemo(() => {
    const filterKeys = Object.keys(queryVariables).filter(
      (key) => key !== "files_association" && key !== "study_association",
    );
    return filterKeys.length > 0;
  }, [queryVariables]);

  const { loading, error, data } = useQuery(SCOPED_STATS_QUERY, {
    variables: queryVariables,
    /**
     * Skip query if no filter variables are provided (only association filters present).
     * This prevents querying for all repository data when no scope is specified.
     */
    skip: !hasValidFilters,
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error("Failed to load scoped stats.", error);
    return <CircularProgress />;
  }

  /**
   * IMPORTANT: File Count Calculation
   *
   * We override numberOfFiles and numberOfStudyFiles from the main query with
   * counts from the association-filtered queries (filesTabCount and studyFilesTabCount).
   *
   * WHY: The main searchParticipants query returns ALL files, but we need to
   * differentiate between:
   * - Data Files (biospecimen/participant association) → shown in "Files" tab
   * - Study Files (study association) → shown in "Study Files" tab
   *
   * The ?? (nullish coalescing) operator provides a fallback to the main query
   * count if the association-filtered queries don't return data.
   */
  const statsData = {
    ...data?.searchParticipants,
    // Override with association-filtered count for Data Files
    numberOfFiles:
      data?.filesTabCount?.numberOfFiles ??
      data?.searchParticipants?.numberOfFiles,
    // Override with association-filtered count for Study Files
    numberOfStudyFiles:
      data?.studyFilesTabCount?.numberOfStudyFiles ??
      data?.searchParticipants?.numberOfStudyFiles,
  };

  return <StatsView data={statsData} />;
};

export default ScopedStatsController;
