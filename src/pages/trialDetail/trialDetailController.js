import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import TrialView from './trialDetailView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_TRIAL_DETAIL_DATA_QUERY } from '../../bento/trialDetailData';
import { DASHBOARD_QUERY_NEW } from '../../bento/dashboardTabData';
import { stat } from 'fs-extra';

const ProgramDetailContainer =  ({ match }) => {
  
  const { loading, error, data } = useQuery(GET_TRIAL_DETAIL_DATA_QUERY, {
    variables: { study_short_name: ["CMB"] },
  });

  const statData = useQuery(DASHBOARD_QUERY_NEW, {
    variables: {"subject_ids":["NCT04314401"]},
  });
 
   
  


  if (loading) return <CircularProgress />;
  if (error || !data) {
    return (
      <Typography variant="headline" color="error" size="sm">
        {error ? `An error has occurred in loading stats component: ${error}` : 'Recieved wrong data'}
      </Typography>
    );
  }
  return <TrialView data={data} statData={statData} />;
};

export default ProgramDetailContainer;


