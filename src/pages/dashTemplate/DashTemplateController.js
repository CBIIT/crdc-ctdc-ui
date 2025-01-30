import React, { useEffect, useMemo, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { getFilters } from '@bento-core/facet-filter';
import DashTemplateView from './DashTemplateView';
import { DASHBOARD_QUERY_NEW, TARGETED_THERAPY_QUERY } from '../../bento/dashboardTabData';
import { generateValidTherapyCombinations, updateTargetedTherapyFacetData } from './utils';

const getDashData = (states) => {
  const {
    filterState,
    localFindUpload, localFindAutocomplete,
  } = states;

  const client = useApolloClient();

  const [dashData, setDashData] = useState(null)
  const [initialDashData, setInitialDashData] = useState(null);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const targeted_therapy_datafield = "targeted_therapy_string";

  // Compute activeFilters, ensuring it updates only when dependencies change
  const activeFilters = useMemo(() => {
    const baseFilters = {
      ...getFilters(filterState),
      subject_ids: [
        ...(localFindUpload || []).map((obj) => obj.subject_id),
        ...(localFindAutocomplete || []).map((obj) => obj.title),
      ],
    };

    const sourceData = dashData
      ? dashData.filterParticipantCountBySingleTargetedTherapyCombinationForFacet
      : initialDashData && initialDashData.filterParticipantCountBySingleTargetedTherapyCombinationForFacet;

    if (baseFilters[targeted_therapy_datafield] && sourceData) {
      baseFilters[targeted_therapy_datafield] = generateValidTherapyCombinations(
        baseFilters,
        targeted_therapy_datafield,
        sourceData
      );
    }

    return baseFilters;
  }, [filterState, localFindUpload, localFindAutocomplete, initialDashData, dashData]);

  // Fetch initial targeted therapy data only once
  useEffect(() => {
    // if targeted theray is empty skip this call and go strail to the second query: activeFilters[targeted_therapy_datafield]
    if (!hasLoadedInitialData) {
      const fetchInitialData = async () => {
        try {
          const result = await client.query({
            query: TARGETED_THERAPY_QUERY,
            variables: activeFilters,
          });
          if (result.data && result.data.searchParticipants) {
            setInitialDashData(result.data.searchParticipants);
            setHasLoadedInitialData(true);
          }
        } catch (error) {
          console.error("Error fetching initial targeted therapy data:", error);
        }
      };

      fetchInitialData();
    }
  }, [filterState, localFindUpload, localFindAutocomplete]);

  // Load dashboard data after initial targeted therapy data is loaded and activeFilters is generated
  useEffect(() => {
    if (!hasLoadedInitialData) return;

    const fetchDashData = async () => {
      try {
        const result = await client.query({
          query: DASHBOARD_QUERY_NEW,
          variables: activeFilters,
        });

        if (result.data && result.data.searchParticipants) {
          const transformData = (key) => updateTargetedTherapyFacetData(result.data.searchParticipants, key);
          
          const targetedTherapyCombination = transformData("participantCountBySingleTargetedTherapyCombination");
          const filterTargetedTherapyCombination = transformData("filterParticipantCountBySingleTargetedTherapyCombination");

          setDashData({
            ...result.data.searchParticipants,
            ...targetedTherapyCombination,
            ...filterTargetedTherapyCombination,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashData();
  }, [hasLoadedInitialData, filterState, localFindUpload, localFindAutocomplete]);

return { dashData, activeFilters };

};

const DashTemplateController = ((props) => {
  const { dashData, activeFilters } = getDashData(props);
  if (!dashData) {
    return (<CircularProgress />);
  }

  return (
    <DashTemplateView
      {...props}
      dashData={dashData}
      activeFilters={activeFilters}
    />
  );
});

const mapStateToProps = (state) => ({
  filterState: state.statusReducer.filterState,
  localFindUpload: state.localFind.upload,
  localFindAutocomplete: state.localFind.autocomplete,
});

export default connect(mapStateToProps, null)(DashTemplateController);