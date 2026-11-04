import { useEffect, useMemo, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { getFilters } from "@bento-core/facet-filter";
import {
  DASHBOARD_QUERY_NEW,
  THERAPY_QUERY,
} from "../../bento/dashboardTabData";
import {
  generateValidTherapyCombinations,
  updateTherapyFacetData,
} from "./utils";
import { ExploreResponseError, getExploreErrorMessage } from "./exploreErrors";

export const buildParticipantIdFilter = (
  localFindUpload,
  localFindAutocomplete,
) => [
  ...new Set([
    ...(localFindUpload || []).map((obj) => obj.subject_id),
    ...(localFindAutocomplete || []).map((obj) => obj.title),
  ]),
];

const THERAPY_FILTER = "therapy_string";
const VOCABULARY_FIELD =
  "filterParticipantCountBySingleTherapyCombinationForFacet";

const useDashData = ({
  filterState,
  localFindUpload,
  localFindAutocomplete,
}) => {
  const client = useApolloClient();
  const [vocabulary, setVocabulary] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  const baseFilters = useMemo(
    () => ({
      ...getFilters(filterState),
      participant_id: buildParticipantIdFilter(
        localFindUpload,
        localFindAutocomplete,
      ),
    }),
    [filterState, localFindUpload, localFindAutocomplete],
  );
  const requestKey = JSON.stringify(baseFilters);
  // This aggregation excludes the name filter itself. Other filters change its vocabulary.
  const vocabularyKey = JSON.stringify(
    Object.fromEntries(
      Object.entries(baseFilters).filter(([key]) => key !== THERAPY_FILTER),
    ),
  );
  const vocabularyReady = vocabulary?.key === vocabularyKey;
  // [] needs no expansion; [''] is an explicit selected "No value" option.
  const hasSelectedNames = Boolean(baseFilters[THERAPY_FILTER]?.length);
  const filtersReady = !hasSelectedNames || vocabularyReady;

  useEffect(() => {
    if (!hasSelectedNames || vocabularyReady) return undefined;
    let active = true;
    setError(null);
    client
      .query({ query: THERAPY_QUERY, variables: baseFilters })
      .then(({ data }) => {
        const buckets = data?.searchParticipants?.[VOCABULARY_FIELD];
        if (!Array.isArray(buckets)) {
          const receivedType = buckets === null ? "null" : typeof buckets;
          throw new ExploreResponseError(
            `The Therapy filter response does not contain the expected combination list at "searchParticipants.${VOCABULARY_FIELD}" `
            + `(expected an array, received ${receivedType}). `
            + "Explore cannot apply the selected Therapy names without this list.",
            "The Backend Service returned missing or invalid Therapy information needed to apply your selected names.",
          );
        }
        if (active) setVocabulary({ key: vocabularyKey, buckets });
      })
      .catch((queryError) => {
        console.error("[Explore] THERAPY_QUERY failed:", queryError);
        if (active)
          setError({
            key: requestKey,
            message: getExploreErrorMessage(queryError),
          });
      });
    return () => {
      active = false;
    };
  }, [
    client,
    baseFilters,
    hasSelectedNames,
    vocabularyKey,
    vocabularyReady,
    requestKey,
  ]);

  // Type/Category use backend any-value matching and pass through unchanged.
  // Only selected names need expansion into complete therapy_string combinations.
  const activeFilters = useMemo(() => {
    if (!hasSelectedNames || !vocabularyReady) return baseFilters;
    return {
      ...baseFilters,
      [THERAPY_FILTER]: generateValidTherapyCombinations(
        baseFilters,
        THERAPY_FILTER,
        vocabulary.buckets,
      ),
    };
  }, [baseFilters, hasSelectedNames, vocabulary, vocabularyReady]);

  /*
   * Load results directly when no Therapy names are selected. The dashboard also
   * returns vocabulary that can expand later selections under these other filters.
   * Example: select Category=Targeted, then names A and B. The Category dashboard
   * supplies A|B if it exists, so those name clicks do not need a bootstrap query.
   *
   * Saved/active names still wait for bootstrap when other filters change. Depend
   * on filtersReady so caching vocabulary from a direct response does not trigger
   * another dashboard request: its filters were already ready without expansion.
   */
  useEffect(() => {
    if (!filtersReady) return undefined;
    let active = true;
    setError(null);
    client
      .query({
        query: DASHBOARD_QUERY_NEW,
        variables: {
          ...activeFilters,
          files_association: ["biospecimen", "participant"],
          study_association: ["study"],
        },
      })
      .then(({ data }) => {
        const search = data?.searchParticipants;
        const invalidFields = [
          "participantCountBySingleTherapyCombination",
          "filterParticipantCountBySingleTherapyCombination",
          VOCABULARY_FIELD,
        ].filter((field) => !Array.isArray(search?.[field]));
        if (invalidFields.length) {
          const details = invalidFields.map((field) => {
            const value = search?.[field];
            const receivedType = value === null ? "null" : typeof value;
            return `"searchParticipants.${field}" (received ${receivedType})`;
          }).join(", ");
          throw new ExploreResponseError(
            `The Explore dashboard response contains missing or invalid Therapy lists: ${details}. `
            + "Each field must be an array so Explore can display the Therapy filters and charts.",
            "The Backend Service returned missing or invalid Therapy information needed to display the filters and charts.",
          );
        }
        if (active) {
          // A name-filtered request already used the matching bootstrap/cached vocabulary.
          if (!hasSelectedNames) {
            setVocabulary({
              key: vocabularyKey,
              buckets: search[VOCABULARY_FIELD],
            });
          }
          setDashboard({
            key: requestKey,
            filters: activeFilters,
            data: {
              ...search,
              numberOfFiles:
                data.filesTabCount?.numberOfFiles ?? search.numberOfFiles,
              numberOfStudyFiles:
                data.studyFilesTabCount?.numberOfStudyFiles ??
                search.numberOfStudyFiles,
              ...updateTherapyFacetData(
                search,
                "participantCountBySingleTherapyCombination",
              ),
              ...updateTherapyFacetData(
                search,
                "filterParticipantCountBySingleTherapyCombination",
              ),
            },
          });
        }
      })
      .catch((queryError) => {
        console.error("[Explore] DASHBOARD_QUERY_NEW failed:", queryError);
        if (active)
          setError({
            key: requestKey,
            message: getExploreErrorMessage(queryError),
          });
      });
    return () => {
      active = false;
    };
  }, [
    client,
    activeFilters,
    filtersReady,
    hasSelectedNames,
    vocabularyKey,
    requestKey,
  ]);

  return {
    dashData: dashboard?.data,
    // Keep table requests and counts on the last completed cohort during refresh.
    activeFilters: dashboard?.filters || activeFilters,
    loading: !filtersReady || dashboard?.key !== requestKey,
    error: error?.key === requestKey ? error.message : null,
  };
};

export default useDashData;
