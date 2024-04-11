import React, { useState } from 'react';
import {
  Grid,
  withStyles,
  Tabs,
  Tab,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { BarChart } from 'bento-components';

import { clearAllFilters } from '@bento-core/facet-filter';
import {
  biospecimenProfile,
  palette,
  valueConfiguration,
  timePointArgumentConfiguration,
  argumentConfiguration,
  seriesSetting,
} from '../../../bento/studyDetailData';
import TabPanel from '../../../components/Tab/TabPanel';
// import { navigatedToDashboard } from '../../../utils/utils';
import store from '../../../store';

const tooltipContent = ({ argument, originalValue }) => (
  <div>
    <span style={{ fontWeight: 600, color: '#444444' }}>{argument}, </span>
    <span style={{ color: '#444444', fontWeight: 900 }}>{originalValue}</span>
  </div>
);

const BiospecimenProfile = ({ classes, d }) => {
  // const studyCode = data.study[0].clinical_study_designation;
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabChange = (event, value) => {
    setCurrentTab(value);
  };

  let data = d["StudySpecimenByStudyShortName"][0];
  const tabCount = biospecimenProfile.tabs.filter((tab) => (data[tab.value]
    && data[tab.value].length > 0));

  const biospecimenTabPathName = "/explore?selectedTab=biospecimens"

  const linkToDashboard = () => {
    // TODO: Once local-find is enabled; dispatch(resetAllData()) from bento-core/local-find to RESET_LOCALFIND_ALL_DATA
    store.dispatch(clearAllFilters());
  };

  const tabItem = (items) => (
    <Tabs
      value={currentTab}
      onChange={handleTabChange}
      className={classes.tabs}
      textColor="primary"
      TabIndicatorProps={{
        style: {
          backgroundColor: '#0296C9',
          height: '5px',
        },
      }}
    >
      { items.map((item, index) => (
        <Tab
          className={classes.tab}
          classes={{ root: classes.tab, labelContainer: classes.labelContainer, }}
          label={item.label}
          key={index}
        />
      )) }
    </Tabs>
  );

  const renderTabContent = (item, index) => (
    <TabPanel index={item.index} value={currentTab} key={index}>
      <BarChart
        data={data[item.value]}
        palette={palette}
        tooltipContent={tooltipContent}
        argument={item.label === 'TIMEPOINT' ? timePointArgumentConfiguration : argumentConfiguration}
        value={valueConfiguration}
        seriesSetting={seriesSetting}
        size= {{ maxHeight: 300, maxWidth: 300, }}
      />
    </TabPanel>
  );

  return (
    <Grid item lg={6} md={6} sm={12} xs={12}>
      <Grid container className={classes.detailContainerHL}>
        <Grid item xs={12}>
          <span className={classes.detailContainerHeader}> Biospecimen PROFILE </span>
        </Grid>
      </Grid>
      {(tabCount !== undefined && tabCount.length > 0) ? (
        <>
          <Grid container>
            <div className={classes.headerButton}>
              <span className={classes.headerButtonLinkSpan}>
                <Link
                  className={classes.headerButtonLink}
                  to={biospecimenTabPathName}
                  onClick={() => linkToDashboard()}
                >
                  <span className={classes.headerButtonLinkNumber}>
                    {0 || data.sample_count}
                  </span>
                  <span className={classes.headerButtonLinkText}>Associated Biospecimens</span>
                </Link>
              </span>
            </div>
          </Grid>
          <Grid item xs={12} className={classes.tabContainer}>
            { tabItem(biospecimenProfile.tabs) }
          </Grid>
          <Grid container className={classes.detailContainerItems}>
            { biospecimenProfile.tabs.map((item, index) => renderTabContent(item, index)) }
          </Grid>
          <Grid container>
            <p className={classes.helpfulDirectionText}>Move cursor over barchart to see data count in detail</p>
          </Grid>
        </>
      ) : (
        <Grid container className={classes.detailContainerCL}>
          <Grid item xs={12} sm={10}>
            <div className={classes.content}>
              This study currently has no associated Biospecimen Profile
            </div>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

const styles = (theme) => ({
  detailContainerHL: {
    paddingRight: '30px',
    marginRight: '30px',
  },
  detailContainerCL: {
    paddingTop: '2px',
    paddingRight: '30px',
    marginRight: '30px',
  },
  detailContainerHeader: {
    textTransform: 'uppercase',
    fontFamily: theme.custom.fontFamilyInter,
    fontSize: '16px',
    letterSpacing: '0.017em',
    color: '#066D93',
  },
  container: {
    fontFamily: 'Raleway, sans-serif',
    paddingLeft: '33px',
    paddingRight: '33px',
    paddingBottom: '25px',
  },
  content: {
    fontSize: '14px',
    fontFamily: theme.custom.fontFamilyNunitoSansRegular,
  },
  tabHighlight: {
    color: '#0296c9',
    outline: 'none !important',
  },
  tabContainer: {
    width: '300px',
    marginTop: '15px',
    padding: '0px 23px',
    marginBottom: '30px',
    borderBottom: '1px solid #42779A'
  },
  tab: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '19px',
    fontFamily: 'Nunito Sans',
    minWidth: '120px',
    paddingLeft: '2px',
    padding: '0px !important',
    marginRight: '10px',
    textAlign: 'center',
    color: '#507C91',
  },
  headerButton: {
    fontFamily: theme.custom.fontFamilySans,
    marginTop: '15px',
    textAlign: 'center',
    height: '33px',
    background: '#F6F4F4',
    padding: '2px 10px 0px 10px',
    border: '3px solid #81A6B9',
    width: '220px',
  },
  headerButtonLinkSpan: {
    fontFamily: theme.custom.fontFamilyInter,
    height: '50px',
    background: '#F6F4F4',
    width: '200px',
    fontSize: '14px',
  },
  headerButtonLinkText: {
    fontFamily: theme.custom.fontFamilyInter,
    color: '#0B3556',
  },
  headerButtonLinkNumber: {
    fontFamily: theme.custom.fontFamilyInter,
    margin: '0 4px',
    fontSize: '14px',
    color: '#AA581D',
  },
  headerButtonLink: {
    textDecoration: 'none',
    lineHeight: '14px',
    fontSize: '12px',
    color: '#0296c9',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  tabs: {
    '& .Mui-selected': {
      color: '#000000',
      fontWeight: '600',
    },
    fontFamily: theme.custom.fontFamilyNunitoSansRegular,
  },
  helpfulDirectionText: {
    marginTop: '18px',
    fontFamily: 'Roboto',
    fontWeight: 400,
    color: '#757575',
    fontSize: '13px',
    fontStyle: 'italic',
  },
});

export default withStyles(styles, { withTheme: true })(BiospecimenProfile);
