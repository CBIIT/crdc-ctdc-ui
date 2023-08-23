import React from 'react';
import {
  Grid,
  withStyles,
} from '@material-ui/core';
import ToolTip from '@bento-core/tool-tip';
import {
  // eslint-disable-next-line no-unused-vars
  externalIcon,
} from '../../../../bento/trialDetailData';
import BiospecimenProfile from '../BiospecimenProfile';
import OverviewThemeProvider from './overviewThemeConfig';

const Overview = ({
  classes,
  data,
}) => {
  // eslint-disable-next-line no-unused-vars
  const getImageTypes = (typeString) => {
    const types = JSON.parse(typeString);
    return types.join(', ');
  };

  const getAccessTypeString = (accessType) => {
    switch (accessType) {
      case 'Download':
        return 'Available for Download';
      case 'Cloud':
        return 'Available only via the Cloud';
      case 'Unrestricted':
        return 'Available both via the Cloud and via Download';
      default:
        return 'Available';
    }
  };

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
  const associatedLinks = data.studyByStudyId.associated_link;
  const diagnoses = data.studyByStudyId.diagnosis.list_diagnosis;
  const participantFileTypes = data.studyByStudyId.data_file.list_type;
  const imageCollection = data.studyByStudyId.image_collection;

  const customSorting = (a, b) => {
    let val = 0
    if(a < b) { val = -1; }
    if(a > b) { val = 1; }
    return val;
  }

  return (
    <OverviewThemeProvider>
      <div className={classes.container}>
        <div className={classes.detailContainer}>
          <Grid container>
            <Grid item lg={5} md={4} sm={6} xs={12} className={classes.borderRight}>
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
                      {associatedLinks.sort((a, b) => customSorting(a.associated_link_name, b.associated_link_name))
                        .map((link, index) => (
                          <Grid item xs={12} className={classes.content} key={index}>
                            <a
                              href={link.associated_link_url}
                              className={classes.link}
                              rel="noopener noreferrer"
                              target="_blank">
                              {link.associated_link_name}
                            </a>&nbsp;<ExternalLinkIcon/> <br/>
                          </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  
                </Grid>
              </Grid>
            </Grid>
            
            {/* Right Container Detail */}
            <Grid item lg={7} md={8} sm={6} xs={12}>
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
                    {diagnoses.sort((a, b) => customSorting(a, b)).map((diagnosis, index) => (
                      <Grid item xs={12} key={index}>
                        <span className={classes.content}>
                          {diagnosis}
                        </span>
                      </Grid>
                    ))}
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
                    {(participantFileTypes.length > 0) ? participantFileTypes.sort((a, b) => customSorting(a, b)).map((fileType, index) => (
                      <Grid item xs={12} key={index}>
                        <span className={classes.content}>{fileType}</span>
                      </Grid>
                    )): null}
                  </Grid>
                </Grid>
              </Grid>
              <Grid container direction="row" className={classes.detailContainerRight}>
                <BiospecimenProfile data={data} />

                {/* START: Image Collection */}
                <Grid item lg={6} md={6} sm={12} xs={12} className={classes.imageCollection}>
                  <Grid container className={classes.imageCollectionHeader}>
                    <Grid item xs={12}>
                      <span className={classes.detailContainerHeaderText}>
                        IMAGE COLLECTIONS
                      </span>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12}>
                      <div className={classes.collection}>
                      {imageCollection.sort((a, b) => customSorting(a.image_collection_name, b.image_collection_name)).map((image, index)=> (
                        <div className={classes.collectionWrapper}>
                          <span className={classes.imageKey}>
                            COLLECTION:
                          </span>
                          <a
                            href={image.image_collection_url}
                            className={classes.link}
                            rel="noopener noreferrer"
                            target="_blank">
                            <ToolTip 
                              classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }}
                              title={getAccessTypeString(image.collection_access)}
                              placement="bottom"
                            >
                              <span className={classes.collectionAndRepositorySpan}>
                                {image.image_collection_name} - {image.repository_name} 
                              </span>
                            </ToolTip>
                          </a>&nbsp;<ExternalLinkIcon/> <br/>
                          
                          <span className={classes.imageKey}>
                            IMAGE TYPES:
                          </span>

                          <span className={classes.imageValue}>
                            {image.image_type_included}
                          </span>
                        </div>
                      ))}
                      </div>
                      <p className={classes.scrollDownText}>Scroll down to see more available</p>
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
  customTooltip: {
    backgroundColor: '#FFFFFF',
    color: '#223D4C',
    width: 'fit-content',
    maxWidth: '250px',
    fontSize: '13px',
    border: '1px solid #C3C3C3',
    fontFamily: theme.custom.fontFamilySans,
    fontWeight: '600',
    textAlign: 'left',
    lineHeight: '19px',
    padding: '10px, 15px, 10px, 15px',
    borderRadius: '5px',
  },
  customArrow: {

  },
  collection: {
    maxHeight: '350px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  collectionWrapper: {
    marginBottom: '16px'
  },
  imageKey: {
    color: '#0296C9',
    paddingRight: '15px'
    // fontFamily: theme.
  },
  imageValue: {
    
  },
  container: {
    fontFamily: 'Raleway, sans-serif',
    padding: '0px 32px 40px 32px',
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
  scrollDownText: {
    color: '#838383',
    fontSize: '12px',
    fontStyle: 'italic',
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
    padding: '0px 25px 5px 65px',
    minHeight: '300px',
    // maxHeight: '500px',
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
  imageCollectionHeader: {
    marginBottom: '10px',
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
