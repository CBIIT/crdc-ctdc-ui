/* eslint-disable no-shadow */
import React from 'react';
import {
  Grid,
  withStyles,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

// import { request, gql } from 'graphql-request';
// import { useQuery } from '@tanstack/react-query';
import Snackbar from '../../components/Snackbar';
import StatsView from '../../components/Stats/StatsView';
// import { fetchDataForDashboardTabDataTable } from '../dashboardTab/store/dashboardReducer';
// import { studyDisposition, } from './utils';
// import { navigatedToDashboard } from '../../utils/utils';
// import CustomBreadcrumb from '../../components/Breadcrumb/BreadcrumbView';
import {
  headerIcon,
  tab,
} from '../../bento/trialDetailData';
import Tab from '../../components/Tab/Tab';
// import Overview from './views/overview/Overview';
// import Publication from './views/Publication';
// import ArmsAndCohort from './views/cohort/ArmsAndCohort';
// import StudyFiles from './views/StudyFiles';
import TabPanel from '../../components/Tab/TabPanel';
// import pendingHeaderIcon from '../../assets/icons/PendingRelease-icons.StudiesDetail-Main.svg';
import Styles from './studyDetailsStyle';
import StudyThemeProvider from './studyDetailsThemeConfig';
// import classNames from 'classnames';
import Overview from './views/overview/overview';
// import SupportingData from './views/supporting-data/supportingData';
// import env from '../../utils/env';
// import ClinicalData from './views/clinical-data/clinicalData';


const StudyDetailView = ({ classes, data, isLoading=false, isError=false}) => {
  const studyData = data;
  console.log("Data: ", data)

  const stat = {
    numberOfStudies: 1,
    numberOfCases: 100,
    numberOfSamples: 100,
    numberOfFiles: 100,
    numberOfStudyFiles: 100,
    numberOfPrograms: 100,
    numberOfAliquots: 100,
    volumeOfData: 100
  };

  /*
  React.useEffect(() => {
    fetchDataForDashboardTabDataTable();
  }, []);

  const breadCrumbJson = [{
    name: 'ALL PROGRAMS',
    to: '/programs',
    isALink: true,
  }, {
    name: "program_acronym",
    to: '',
    isALink: false,
  }];
  */

  const [snackbarState, setsnackbarState] = React.useState({
    open: false,
    value: 0,
  });

  function closeSnack() {
    setsnackbarState({ open: false });
  }

  const [currentTab, setCurrentTab] = React.useState(0);
  const handleTabChange = (event, value) => {
    setCurrentTab(value);
  };

  const renderDefaultHeaderIcon = () => (
    <img
      src={headerIcon}
      alt="CTDC trail detail header logo"
    />
  );


  const getHeaderIcon = renderDefaultHeaderIcon

  const getLabel = "Label"

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Typography variant="h5" color="error" size="sm">
        An error has occurred in interoperability api
      </Typography>
    );
  }

  const currentStudy = "StudyfgfgPlaceholder"

  let processedTabs;
  if (!currentStudy) {
    processedTabs = tab.items.filter((item) => item.label !== 'SUPPORTING DATA');
  } else {
    processedTabs = tab.items;
  }


  return (
    <StudyThemeProvider>
      <Snackbar
        snackbarState={snackbarState}
        closeSnack={closeSnack}
        autoHideDuration={3000}
        classes={classes}
      />

      <StatsView data={stat} />
      <div className={classes.container}>
        <div className={classes.header}>
          <div className={classes.logo}>
            { getHeaderIcon() }
          </div>
          <div className={classes.headerTitle}>
            <div className={classes.headerMainTitle}>
              <span>
                {studyData.studyByStudyId.study_short_name}&nbsp;{'>'}
                <span className={classes.headerMainSubTitle}>
                   {studyData.studyByStudyId.study_id}
                </span>
              </span>
            </div>
            <div className={classes.headerSubTitleCate}>
              <span>
                {studyData.studyByStudyId.study_name}
              </span>
            </div>
          </div>
          <div className={classes.headerButton}>
            <span className={classes.headerButtonLinkSpan}>
              <Link
                className={classes.headerButtonLink}
                to={(location) => ({ ...location, pathname: '/explore' })}
                // TO DO: Once Explore page is implemented
                // onClick={() => navigatedToDashboard(studyData.clinical_study_designation, 'Cases')}
              >
                <div className={classes.headerButtonLinkNumber}>
                  { data.searchParticipant.participantCountBaseOnSubjectId[0].subjects || 0}
                </div>
                <span className={classes.headerButtonLinkText}>Associated Participants</span>
              </Link>
            </span>
          </div>
        </div>

        <div className={classes.detailContainer}>
          <Grid container>
            <Grid item xs={12}>
              <Tab
                styleClasses={classes}
                tabItems={processedTabs}
                currentTab={currentTab}
                handleTabChange={handleTabChange}
              />
            </Grid>
          </Grid>
        </div>
      </div>
      {
        processedTabs.map((processedTab, index) => {
          switch (processedTab.label) {
            case 'OVERVIEW': return (
              <TabPanel value={currentTab} index={index}>
                <Overview data={data} />
              </TabPanel>
            );

            case 'ADDITIONAL DETAILS': return (
              <TabPanel value={currentTab} index={index}>
                <p>ADDITIONAL DETAILS</p>
              </TabPanel>
            );
          
            default:
              return null;
          }
        })
      }
    </StudyThemeProvider>
  );
};

export default withStyles(Styles, { withTheme: true })(StudyDetailView);
