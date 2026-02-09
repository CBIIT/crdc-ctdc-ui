import React from "react";
import {
  Grid,
  withStyles,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import Stats from "../../components/Stats/AllStatsController";
import { headerIcon, tab } from "../../bento/studyDetailData";
import Tab from "../../components/Tab/Tab";
import TabPanel from "../../components/Tab/TabPanel";
import Styles from "./studyDetailsStyle";
import StudyThemeProvider from "./studyDetailsThemeConfig";
import Overview from "./views/overview/overview";
import { onClearAllFilters } from "../dashTemplate/sideBar/BentoFilterUtils";
import useDashboardTabs from "../dashTemplate/components/dashboard-tabs-store";
import ClinicalDataController from "./views/clinical-data/ClinicalDataController";
import CustomBreadcrumb from "../../components/Breadcrumb/BreadcrumbView";
const StudyDetailView = ({
  classes,
  data,
  study_short_name,
  study_id,
  isLoading = false,
  isError = false,
}) => {
  const studyData = data;
  const processedTabs = tab.items;

  const breadCrumbJson = [
    { name: "Studies", to: "/studies", isALink: true },
    { name: study_short_name + "." + study_id, to: "", isALink: false },
  ];

  const [, actions] = useDashboardTabs();

  const [currentTab, setCurrentTab] = React.useState(0);
  const handleTabChange = (event, value) => {
    setCurrentTab(value);
  };

  const getHeaderIcon = () => (
    <img src={headerIcon} alt="CTDC trail detail header logo" />
  );

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

  const linkToDashboard = () => {
    // TODO: Once local-find is enabled; dispatch(resetAllData()) from bento-core/local-find to RESET_LOCALFIND_ALL_DATA
    onClearAllFilters();
    actions.changeCurrentTab(0);
  };

  const _clinicalDataNodeCounts = {
    ...data?.clinicalDataNodeCounts?.at(0),
    ...data?.clinicalTrialDataNodeCounts?.at(0),
  };
  const _clinicalDataNodeParticipantCounts = {
    ...data?.clinicalDataParticipantCounts?.at(0),
    ...data?.clinicalTrialDataParticipantCounts?.at(0),
  };

  console.log(
    "StudyDetailView clinicalDataNodeCounts:",
    _clinicalDataNodeCounts,
  );
  console.log(
    "StudyDetailView clinicalDataNodeParticipantCounts:",
    _clinicalDataNodeParticipantCounts,
  );
  return (
    <StudyThemeProvider>
      <Stats />

      <div className={classes.container}>
        <div className={classes.breadCrumb}>
          <CustomBreadcrumb separator=">" data={breadCrumbJson} />
        </div>
        <div className={classes.header}>
          <div className={classes.logo}>{getHeaderIcon()}</div>
          <div className={classes.headerTitle}>
            <div className={classes.headerMainTitle}>
              <span>
                {studyData.studyByStudyShortName[0].study_short_name}&nbsp;{">"}
                <span className={classes.headerMainSubTitle}>
                  {studyData.studyByStudyShortName[0].study_id}
                </span>
              </span>
            </div>
            <div className={classes.headerSubTitleCate}>
              <span>{studyData.studyByStudyShortName[0].study_name}</span>
            </div>
          </div>
          <div className={classes.headerButton}>
            <span className={classes.headerButtonLinkSpan}>
              <Link
                className={classes.headerButtonLink}
                to={(location) => ({ ...location, pathname: "/explore" })}
                onClick={() => linkToDashboard()}
              >
                <div className={classes.headerButtonLinkNumber}>
                  {studyData.studyByStudyShortName[0].participant_count || 0}
                </div>
                <span className={classes.headerButtonLinkText}>
                  Associated Participants
                </span>
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
      {processedTabs.map((processedTab, index) => {
        switch (processedTab.value) {
          case "overview":
            return (
              <TabPanel value={currentTab} index={index} maxWidth="1800px">
                <Overview data={data} />
              </TabPanel>
            );

          case "clinical_data":
            return (
              <TabPanel value={currentTab} index={index} maxWidth="1800px">
                <ClinicalDataController
                  dataCount={{
                    caseCount: _clinicalDataNodeParticipantCounts,
                    nodeCount: _clinicalDataNodeCounts,
                  }}
                  study_short_name={study_short_name}
                  study_id={study_id}
                />
              </TabPanel>
            );

          default:
            return null;
        }
      })}
    </StudyThemeProvider>
  );
};

export default withStyles(Styles, { withTheme: true })(StudyDetailView);
