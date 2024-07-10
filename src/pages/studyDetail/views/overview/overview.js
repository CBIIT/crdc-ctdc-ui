import React from 'react';
import {
  Grid,
  withStyles,
} from '@material-ui/core';
import ToolTip from '@bento-core/tool-tip';
import {
  // eslint-disable-next-line no-unused-vars
  externalIcon,
} from '../../../../bento/studyDetailData';
import BiospecimenProfile from '../BiospecimenProfile';
import OverviewThemeProvider from './overviewThemeConfig';
import ZipDownloadView from './components/ZipDownloadView';
import downloadSuccess from '../../../../assets/study/zipDownloadIcon.svg'
import toolTipIcon from '../../../../assets/study/questionMarkTooltip.svg'

const documentDownloadProps = {
    // datafield where file file id exists in the table which is used to get file location
    fileLocationColumn: 'data_file_uuid',
    // datafield where file format exists in the table
    fileFormatColumn: 'data_file_format',
    // datafield where file name exists
    fileName: 'data_file_name',

    // Case 1: Logged in and granted access, file size below {maxFileSize}
    toolTipTextFileDownload: 'Click to download a copy of this file if you have been approved by dbGaP',
    iconFileDownload: downloadSuccess,
    
    // Case 2: Not logged in or access not granted, file size below {maxFileSize}
    iconUnauthenticated: downloadSuccess,
    toolTipTextUnauthenticated: 'You must be logged in and must already have been granted access to download a copy of this file',

    toolTipIcon,
}

const Overview = ({
  classes,
  data,
}) => {

  const getAccessTypeString = (accessType) => {
    switch (accessType) {
      case 'Download':
        return 'Available for Download';
      case 'Cloud':
        return 'Available only via the Cloud';
      case 'Unrestricted':
        return 'Available both via the Cloud and via Download';
      default:
        return 'Available both via the Cloud and via Download';
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
  const associatedLinks = JSON.parse(JSON.stringify(data.studyByStudyShortName[0].associated_links));
  const diagnoses = JSON.parse(JSON.stringify(data.studyDiagnosisByStudyShortName[0].ctep_disease_terms));
  const participantFileTypes = JSON.parse(JSON.stringify(data.StudyDataFileByStudyShortName[0].list_type));
  const imageCollection = JSON.parse(JSON.stringify(data.studyByStudyShortName[0].image_collection));
  const { study_name, study_description, study_type, dates_of_conduct } = data.studyByStudyShortName[0];

  // TODO: BE API need to provide this
  const zipData = {
    data_file_uuid: JSON.parse(JSON.stringify(data.StudyDataFileByStudyShortName[0].study_data_files[0].data_file_uuid)),
    data_file_name: JSON.parse(JSON.stringify(data.StudyDataFileByStudyShortName[0].study_data_files[0].data_file_name)),
    data_file_format: JSON.parse(JSON.stringify(data.StudyDataFileByStudyShortName[0].study_data_files[0].data_file_format)),
}
  // const zipData = {
  //   data_file_uuid: 'dg.4DFC/4df75011-0149-4f1e-9f5a-e9c192618c17',
  //   data_file_name: 'CMB-all-files.CTDCV1',
  //   data_file_format: 'zip'
  // }
  const customSorting = (a, b) => {
    let val = 0
    if(a < b) { val = -1; }
    if(a > b) { val = 1; }
    return val;
  }
  
  /* 
    This function repalces '*' with ',' because
    there are caseses where the database might have 
   '*' separeted data
    */
  const separetByCommaIfnot = (imageList) => {
    if(imageList.includes("*")){
      return imageList.replace(/\s/g, "").split("*").join(", ");
    }

    return imageList;
}

  return (
    <OverviewThemeProvider>
      <div className={classes.container}>
        <div className={classes.detailContainer}>
          <Grid container>
            <Grid item lg={5} md={4} sm={6} xs={12} className={classes.borderRight}>
              <Grid container direction="row" className={classes.detailContainerLeft}>
                <Grid item xs={12} className={classes.title}>
                  Study Name               
                </Grid>
                <Grid item xs={12} className={classes.content}>
                  { study_name || "" }
                </Grid>
                <Grid container className={classes.detailContainerItems}>
                  <Grid item xs={12} className={classes.detailContainerItem}>
                    <Grid item container direction="row">
                      <Grid item xs={12} className={classes.title}>
                        STUDY DESCRIPTION                     
                      </Grid>
                      <Grid item xs={12} className={classes.content}>
                        { study_description || "" }
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className={classes.detailContainerItem}>
                    <Grid item container direction="row">
                      <Grid item xs={12} className={classes.title}>
                        STUDY TYPE                     
                      </Grid>
                      <Grid item xs={12} className={classes.content}>
                        { study_type || "" }
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className={classes.detailContainerItem}>
                    <Grid item container direction="row">
                      <Grid item xs={12} className={classes.title}>
                        DATES OF CONDUCT
                      </Grid>
                      <Grid item xs={12} className={classes.content}>
                        { dates_of_conduct || "" }
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className={classes.detailContainerItem}>
                    <Grid item container direction="row">
                      <Grid item xs={12} className={classes.title}>
                        ASSOCIATED LINKS
                      </Grid>
                      {associatedLinks.sort((a, b) => customSorting(a.associated_link_id, b.associated_link_id))
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

                  <Grid item xs={12} className={classes.detailContainerItem}>
                    <Grid item container direction="row">
                      <Grid item xs={12} className={classes.title}>
                        AVAILABLE DOWNLOADS
                      </Grid>
                      <Grid item xs={12} className={classes.content}>
                        Subject to the appropriate access controls, copies of all Clinical Reports, Variant Reports,
                        and Variant Call Files associated with the Cancer Moonshot Biobank study that are currently
                        represented within the application can be downloaded in the form of a .zip file by selecting
                        the ZIP FILE download option below.

                        <ZipDownloadView
                          fileFormat={zipData[documentDownloadProps.fileFormatColumn]}
                          fileName={zipData[documentDownloadProps.fileName]}
                          fileLocation={zipData[documentDownloadProps.fileLocationColumn]}
                          toolTipTextFileDownload={documentDownloadProps.toolTipTextFileDownload}
                          iconFileDownload={documentDownloadProps.iconFileDownload}

                          iconUnauthenticated={documentDownloadProps.iconUnauthenticated}
                          toolTipTextUnauthenticated={documentDownloadProps.toolTipTextUnauthenticated}

                          toolTipIcon={documentDownloadProps.toolTipIcon}
                        />
                      </Grid>
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
                  sm={12}
                  xs={12}
                  className={classes.detailContainerRightTopDiagnoses}
                >
                  <Grid container className={classes.detailContainerHL}>
                    <Grid item xs={12} className={classes.containerHeader}>
                      <span className={classes.detailContainerHeaderText}>DIAGNOSES</span>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.detailContainerCL} tabIndex="0">
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
                  sm={12}
                  xs={12}
                  className={classes.detailContainerRightTopParticipant}
                >
                  <Grid container className={classes.participantFileH}>
                    <Grid item xs={12} className={classes.containerHeader}>
                      <span className={classes.detailContainerHeaderText}>PARTICIPANT FILE TYPES</span>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.participantFileC}>
                    {(participantFileTypes.length > 0) ? participantFileTypes.sort((a, b) => customSorting(a, b)).map((fileType, index) => (
                      <Grid item xs={12} key={index}>
                        <span className={classes.content}>{fileType}</span>
                      </Grid>
                    )): null}
                  </Grid>
                </Grid>
              </Grid>
              <Grid container direction="row" className={classes.detailContainerRight}>
                <BiospecimenProfile d={data} />

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
                            {separetByCommaIfnot(image.image_type_included)}
                          </span>
                        </div>
                      ))}
                      </div>
                      <p className={classes.helpfulDirectionText}>Scroll down to see more available</p>
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
    boxShadow: '0px 4px 10px 0px #00000040',
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
    color: '#067CA7',
    paddingRight: '15px'
    // fontFamily: theme.
  },
  imageValue: {
    
  },
  container: {
    fontFamily: 'Raleway, sans-serif',
    padding: '0px 32px 40px 32px',
    margin: '0 auto',
    maxWidth: '1800px',
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
    marginTop: '8px',
    paddingTop: '0px !important',
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
    minHeight: '810px',
    maxHeight: '980px',
    overflowY: 'auto',
    overflowX: 'hidden',
    width: 'calc(100% + 8px) !important',
    marginLeft: '-8px',
    marginTop: '30px'
  },
  detailContainerHeaderText: {
    fontFamily: theme.custom.fontFamilyInter,
    fontSize: '18px',
    fontWeight: 400,
    letterSpacing: '0.017em',
    color: '#067CA7',
    textTransform: 'uppercase',
  },
  content: {
    fontSize: '16px',
    fontFamily: theme.custom.fontFamilyNunito,
    marginTop: '8px',
    fontWeight: 400,
    color: '#000'
  },
  helpfulDirectionText: {
    marginTop: '94px',
    fontFamily: 'Roboto',
    fontWeight: 400,
    color: '#757575',
    fontSize: '13px',
    fontStyle: 'italic',
  },
  title: {
    color: '#067CA7',
    fontFamily: theme.custom.fontFamilyInter,
    fontSize: '18px',
    letterSpacing: '0.017em',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  titleCD: {
    color: '#067CA7',
    fontFamily: theme.custom.fontFamilySans,
    fontSize: '12px',
    letterSpacing: '0.017em',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginRight: '4px',
  },
  detailContainerItem: {
    paddingTop: '30px !important',
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
  participantFileH: {
    paddingLeft: '30px',
  },
  participantFileC: {
    paddingLeft: '30px',
    marginTop: '8px',
    maxHeight: '250px',
    overflow: 'auto',
  },
  
  detailContainerHL: {
    paddingRight: '30px',
  },
  detailContainerCL: {
    marginTop: '8px',
    paddingRight: '30px',

    maxHeight: '250px',
    overflow: 'auto',
  },
  paddingTop2: {
    paddingTop: '2px',
  },
  imageCollection: {
    paddingLeft: '30px',
  },
  imageCollectionHeader: {
    marginBottom: '15px',
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
    fontSize: '16px',
    fontWeight: 400,
    fontFamily: theme.custom.fontFamilyNunito
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

  '@media (max-width: 1099px)': {
    detailContainerRightTopParticipant: {
      marginTop: '40px',
    },
    imageCollection: {
      marginTop: '55px',
      paddingLeft: '0px',
    },
    participantFileH: {
      paddingLeft: '0px',
    },
    participantFileC: {
      paddingLeft: '0px',
    },
  },
  '@media (max-width: 899px)': {
    detailContainerLeft: {
      padding: '0px 31px 5px 8px',
    },
    detailContainerRight: {
      padding: '0px 0px 5px 25px',
    },
  },
  '@media (max-width: 799px)': {
    borderRight: {
      borderRight: 'none',
    },
    detailContainerLeft: {
      minHeight: 'fit-content'
    },
    detailContainerRight: {
      padding: '0px 0px 5px 0px',
    },
  },
  '@media (max-width: 460px)': {
    detailContainer: {
      paddingLeft: '10px',
      paddingRight: '10px',
    },
  },
});

export default withStyles(styles, { withTheme: true })(Overview);
