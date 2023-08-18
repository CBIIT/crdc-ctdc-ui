import React from 'react';
import {
  Grid,
  withStyles,
} from '@material-ui/core';
import {
  // eslint-disable-next-line no-unused-vars
  externalIcon,
} from '../../../../bento/trialDetailData';
import SampleProfile from '../BiospecimenProfile';
import OverviewThemeProvider from './overviewThemeConfig';
import classNames from 'classnames';

const Overview = ({
  classes,
  studyData,
  diagnoses,
  caseFileTypes,
  data,
  nodeCount,
  supportingDataCount,
  clinicalDataTabIndex,
  supportingDataTabIndex,
  setCurrentTab,
}) => {
  // eslint-disable-next-line no-unused-vars
  const getImageTypes = (typeString) => {
    const types = JSON.parse(typeString);
    return types.join(', ');
  };

  // eslint-disable-next-line no-unused-vars
  const getAccessTypeString = (accessType) => (accessType === 'Cloud'
    ? 'Available only via the Cloud' : 'Available for Download');

  const ExternalLinkIcon = () => {
    return (
      <img 
        src={externalIcon}
        width={14}
        height={14}
        className={classes.externalLinkIcon}
        alt='outbounnd web site icon'/>
    )
  }

  return (
    <OverviewThemeProvider>
      <div className={classes.container}>
        <div className={classes.detailContainer}>
          <Grid container>
            <Grid item lg={5} md={5} sm={6} xs={12} className={classes.borderRight}>
              <Grid container direction="row" className={classes.detailContainerLeft}>
                <Grid item xs={12} className={classes.containerHeader}>
                  <span className={classes.detailContainerHeaderText}>Trial Name</span>
                </Grid>
                <Grid item xs={12} className={classes.studyDescription}>
                  <div>
                    <span className={classes.content}>
                      {' '}
                      Cancer Moonshot Biobank
                      {' '}
                    </span>
                  </div>
                </Grid>
                <Grid container className={classes.detailContainerItems}>
                  <Grid item xs={12} className={classes.detailContainerItem}>
                    <Grid item container direction="row">
                      <Grid item xs={12} className={classes.title}>
                        TRIAL DESCRIPTION                     
                      </Grid>
                      <Grid item xs={12} className={classes.content}>
                        "Cancer Moonshot Biobank" is a longitudinal study. This means it
                        collects and stores samples and information
                        over time, throughout the course of a
                        patient's cancer treatment. By looking at
                        samples and information collected from the
                        same people over time, researchers hope to
                        better understand how cancer changes over
                        time and over the course of medical
                        treatments.
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className={classes.detailContainerItem}>
                    <Grid item container direction="row">
                      <Grid item xs={12} className={classes.title}>
                        TRIAL TYPE                     
                      </Grid>
                      <Grid item xs={12} className={classes.content}>
                        Observational
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className={classes.detailContainerItem}>
                    <Grid item container direction="row">
                      <Grid item xs={12} className={classes.title}>
                        DATES OF CONDUCT
                      </Grid>
                      <Grid item xs={12} className={classes.content}>
                        September 2020 - September 2025 (estimated)
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className={classes.detailContainerItem}>
                    <Grid item container direction="row">
                      <Grid item xs={12} className={classes.title}>
                        ASSOCIATED LINKS
                      </Grid>
                      <Grid item xs={12} className={classes.content}>
                        <a href='/' className={classes.link}>ClinicalTrials.gov record</a> <ExternalLinkIcon/> <br/>
                        <a href='/' className={classes.link}>About the Biobank</a> <ExternalLinkIcon/>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                </Grid>
              </Grid>
            </Grid>
            
            {/* Right Container Detail */}
            <Grid item lg={7} md={7} sm={6} xs={12}>
              <Grid
                container
                direction="row"
                className={classes.detailContainerRight}
              >
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  className={classes.detailContainerRightTop}
                >
                  <Grid container className={classes.detailContainerHL}>
                    <Grid item xs={12} className={classes.containerHeader}>
                      <span className={classes.detailContainerHeaderText}>DIAGNOSES</span>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.detailContainerCL}>
                    <Grid item xs={12}>
                      <span className={classes.content}>
                        Acute Myeloid Leukemia Not Otherwise Specified
                      </span>
                    </Grid>
                    <Grid item xs={12}>
                      <span className={classes.content}>
                        {' '}
                        Colorectal Carcinoma
                      </span>
                    </Grid>
                    <Grid item xs={12}>
                      <span className={classes.content}>
                        {' '}
                        Plasma Cell Myeloma
                      </span>
                    </Grid>
                    <Grid item xs={12}>
                      <span className={classes.content}>
                        {' '}
                        Lung Non-Small Cell CarcinomaProstate Carcinoma
                      </span>
                    </Grid>
                    <Grid item xs={12}>
                      <span className={classes.content}>
                        {' '}
                        Lung Small Cell Carcinoma
                      </span>
                    </Grid>
                    <Grid item xs={12}>
                      <span className={classes.content}>
                        {' '}
                        Melanoma
                      </span>
                    </Grid>
                    <Grid item xs={12}>
                      <span className={classes.content}>
                        {' '}
                        Gastroesophageal Junction Adenocarcinoma
                      </span>
                    </Grid>
                    {/*diagnoses.sort((a, b) => customSorting(a, b, 'alphabetical')).map((diagnosis, index) => (
                      <Grid item xs={12} key={index}>
                        <span className={classes.content}>
                          {' '}
                          {diagnosis}
                        </span>
                      </Grid>
                    ))*/}
                  </Grid>
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  className={classes.detailContainerRightTop}
                >
                  <Grid container className={classes.participantFile}>
                    <Grid item xs={12} className={classes.containerHeader}>
                      <span className={classes.detailContainerHeaderText}>PARTICIPANT FILE TYPES</span>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.participantFile}>
                    <Grid item xs={12} className={classes.paddingTop2}>
                      <span className={classes.content}>
                        Molecular Panel Variant Call File Clinical Report File
                      </span>
                    </Grid>
                    {/*(caseFileTypes.length > 0) ? caseFileTypes.sort((a, b) => customSorting(a, b, 'alphabetical')).map((fileType, index) => (
                      <Grid item xs={12} key={index}>
                        <span className={classes.content}>{fileType}</span>
                      </Grid>
                    )) : (
                      <div className={classes.content}>
                        This study currently has no Files associated with its cases
                      </div>
                    )*/}
                  </Grid>
                </Grid>
                {/*<div><hr className={classNames(classes.hrLine, classes.hrLineRight)} /></div>*/}
              </Grid>
              <Grid container direction="row" className={classes.detailContainerRight}>
                <SampleProfile data={data} />

                {/* START: Image Collection */}
                <Grid item lg={6} md={6} sm={6} xs={12} className={classes.imageCollection}>
                  <Grid container>
                    <Grid item xs={12}>
                      <span className={classes.detailContainerHeaderText}>
                        IMAGE COLLECTIONS
                      </span>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.detailContainerItems}>
                    <Grid item xs={12} sm={10} className={classes.content}>
                      <div className={classes.content}>
                        Under Development ...
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                {/* END: Image Collection */}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </OverviewThemeProvider>
  );
};

const styles = (theme) => ({
  container: {
    fontFamily: 'Raleway, sans-serif',
    paddingLeft: '32px',
    paddingRight: '32px',
    paddingBottom: '25px',
  },
  additionalDataLink: {
    color: '#DC762F',
    fontStyle: 'normal',
    fontWeight: 600,
    fontFamily: 'Open Sans',
    fontSize: '13px',
    background: 'none !important',
    border: 'none',
    padding: '0 !important',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  spacer: {
    marginTop: '50px',
    height: '80px',
    width: '100%',
  },
  studyDescription: {
    paddingTop: '0px !important',
    // paddingLeft: '2px'
  },
  detailContainer: {
    margin: 'auto',
    paddingLeft: '50px',
    paddingRight: '50px',
    fontFamily: theme.custom.fontFamilySans,
    letterSpacing: '0.014em',
    color: '#000000',
    size: '12px',
    lineHeight: '23px',
  },
  hrLine: {
    width: '50px',
    float: 'left',
    marginTop: '30px',
    border: '#81a6b9 2px solid',
    background: '#81a6b9',
  },
  hrLineRight: {
    marginLeft: '4px',
  },
  hrLineLeftMargin: {
    marginLeft: '4px',
  },
  borderRight: {
    borderRight: '#000000 1px solid',
  },
  detailContainerLeft: {
    display: 'block',
    padding: '0px 61px 5px 8px',
    minHeight: '500px',
    maxHeight: '500px',
    overflowY: 'auto',
    overflowX: 'hidden',
    width: 'calc(100% + 8px) !important',
    marginLeft: '-8px',
    marginTop: '30px'
  },
  containerHeader: {
    // marginBottom: '10px',
    // lineHeight: '9px',
  },
  detailContainerHeaderText: {
    fontFamily: theme.custom.fontFamilyInter,
    fontSize: '16px',
    fontWeight: 400,
    letterSpacing: '0.017em',
    color: '#0696C9',
    textTransform: 'uppercase',
  },
  content: {
    fontSize: '14px',
    fontFamily: theme.custom.fontFamilyNunitoSansRegular
  },
  detailContainerItems: {
    // paddingTop: '7px',
  },
  title: {
    color: '#0696C9',
    fontFamily: theme.custom.fontFamilyInter,
    fontSize: '16px',
    letterSpacing: '0.017em',
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  titleCD: {
    color: '#0296c9',
    fontFamily: theme.custom.fontFamilySans,
    fontSize: '12px',
    letterSpacing: '0.017em',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginRight: '4px',
  },
  detailContainerItem: {
    paddingTop: '16px !important',
  },
  detailContainerRight: {
    margin: '30px 0px 0px 0px',
    padding: '0px 50px 5px 65px',
    maxHeight: '500px',
    overflowY: 'auto',
    overflowX: 'hidden',
    width: 'calc(100% + 8px)',
  },
  detailContainerRightTop: {
    maxHeight: '250px',
    overflow: 'auto',
  },
  participantFile: {
    paddingLeft: '30px'
  },
  detailContainerHL: {
    paddingRight: '30px',
  },
  detailContainerCL: {
    paddingTop: '2px',
    paddingRight: '30px',
  },
  paddingTop2: {
    paddingTop: '2px',
  },
  imageCollection: {
    marginTop: '10px',
    paddingLeft: '30px',
  },
  linkIcon: {
    width: '20px',
  },
  tableContainer: {
    background: '#f3f3f3',
  },
  paddingLeft5: {
    paddingLeft: '5px',
  },
  link: {
    color: '#990099',
    textDecoration: 'none',
    fontSize: '14px',
  },
  externalLinkIcon: {
    marginLeft: '5px'
  },
  outLink: {
    color: '#DC762F',
    textDecoration: 'none',
    fontSize: '12px',
    position: 'relative',
    bottom: '7px',
  },
  tableContainer2: {
    background: '#fff',
  },
});

export default withStyles(styles, { withTheme: true })(Overview);
