import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { getFilters } from '@bento-core/facet-filter';
import DashTemplateView from './DashTemplateView';
import { DASHBOARD_QUERY_NEW } from '../../bento/dashboardTabData';
import { getTargetedTherapyStringFilter, updateTargetedTherapyFacetData } from './utils';

const getDashData = (states) => {
  const {
    filterState, customFilterState,
    localFindUpload, localFindAutocomplete,
  } = states;

  const tabIndexMap = {
    'participants': 0,
    'biospecimens': 1,
    'files': 2,
  };
  const { search } = useLocation();
  const tabName = search ? new URLSearchParams(search).get('selectedTab').toLowerCase() : 'participants';
  const tabIndex = tabIndexMap[tabName];

  const client = useApolloClient();
  async function getData(activeFilters) {
    const result = await client.query({
      query: DASHBOARD_QUERY_NEW,
      variables: activeFilters,
    })
      .then((response) => response.data);
    return result;
  }
  /*
  const [validTargetedTheray, setalidTargetedTheray] = useState(null)

  async function getDashQueryForTargetedTheray(activeFilters) {
    // const result = await client.query({
    //   query: DASHBOARD_QUERY_NEW,
    //   variables: activeFilters,
    // })
    //   .then((response) => response.data);
    // return result;
  }
  useEffect(() => { 
    const controller = new AbortController();
    if (dashData === null && validTargetedTheray === null) {
      getDashQueryForTargetedTheray(activeFilters).then((result) => {
        if (result.searchParticipants) {
          setalidTargetedTheray()
        }
      })
    }
   
    return () => controller.abort();
  }, [filterState, localFindUpload, localFindAutocomplete]);
*/
  const [dashData, setDashData] = useState(null);

  const activeFilters = {
    ...getFilters(filterState),
    subject_ids: [
      ...(localFindUpload || []).map((obj) => obj.subject_id),
      ...(localFindAutocomplete || []).map((obj) => obj.title),
    ],
  };

  if (activeFilters.targeted_therapy_string && dashData && dashData.filterParticipantCountByTargetedTherapyString_2){
    activeFilters.targeted_therapy_string = getTargetedTherapyStringFilter(activeFilters, "targeted_therapy_string", dashData.filterParticipantCountByTargetedTherapyString_2)

  } 
  // else if (activeFilters.targeted_therapy_string && !dashData) {
  //   // If dashData is null, used customFilterState
  //   activeFilters.targeted_therapy_string = customFilterState
  // } 
  else {
    console.log("|| I am not here: ", activeFilters, dashData)
  }

// "Aaaa|Bbbb", "Aaa",  => "Aaaa", "Bbbb"
  useEffect(() => { 
    const controller = new AbortController();
    getData(activeFilters).then((result) => {
      if (result.searchParticipants) {
        const participantCountByTargetedTherapyString = updateTargetedTherapyFacetData(result.searchParticipants, "participantCountByTargetedTherapyString")
        // console.log("||| ------- After: participantCountByTargetedTherapyString: ", participantCountByTargetedTherapyString);
        
        const filterParticipantCountByTargetedTherapyString = updateTargetedTherapyFacetData(result.searchParticipants, "filterParticipantCountByTargetedTherapyString")
        // console.log("||| ------- After: filterParticipantCountByTargetedTherapyString: ", filterParticipantCountByTargetedTherapyString)

        setDashData({
          ...result.searchParticipants,
          ...participantCountByTargetedTherapyString,
          ...filterParticipantCountByTargetedTherapyString
        });
      }
    });
    return () => controller.abort();
  }, [filterState, localFindUpload, localFindAutocomplete]);
  return { dashData, activeFilters, tabIndex };
};

const DashTemplateController = ((props) => {
  const { dashData, activeFilters, tabIndex } = getDashData(props);
  if (!dashData) {
    return (<CircularProgress />);
  }

  return (
    <DashTemplateView
      {...props}
      dashData={dashData}
      activeFilters={activeFilters}
      tabIndex={tabIndex}
    />
  );
});

const mapStateToProps = (state) => ({
  filterState: state.statusReducer.filterState,
  // customFilterState: state.statusReducer.customFilterState,
  localFindUpload: state.localFind.upload,
  localFindAutocomplete: state.localFind.autocomplete,
});

export default connect(mapStateToProps, null)(DashTemplateController);