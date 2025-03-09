import React from 'react';
import {
  CircularProgress,
  Grid,
  Typography,
  withStyles,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import {
  pageData,
  tableLayOut,
} from '../../bento/studiesData';
import Stats from '../../components/Stats/AllStatsController';
import InvalidAccesionModal from './InvalidAccesionModal';
import StudiesThemeProvider from './studiesMuiThemConfig';
import env from '../../utils/env';
import {
  TableContextProvider,
} from '../../bento-core';
import StudiesTable from '../../components/DataAvailabilityTable/StudiesTable';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

// ICDC version
/*
const studiesByProgram = gql`
  query studiesByProgram {
    studiesByProgram {
      clinical_study_designation
      CRDCLinks {
        url
        repository
      }
      numberOfCRDCNodes
      numberOfImageCollections
    }
  }
`; */

// CTDC version
const studiesByProgram = gql`
  query getAllStudies {
    getAllStudies {
        study_id
        study_short_name
        associated_links {
            associated_link_name,
            associated_link_url,
            metadata {
                
                ... on IDCMetadata {
                    collection_id,
                    cancer_type,
                    date_updated,
                    description,
                    doi,
                    image_types,
                    location,
                    species,
                    subject_count,
                    supporting_data
                }
                ... on TCIAMetadata {
                    Collection,
                    Aggregate_PatientID,
                    Aggregate_Modality,
                    Aggregate_BodyPartExamined,
                    Aggregate_ImageCount,
                    Aggregate_ImageBool
                }
            }
        },
       image_collection_count
    }
  }
`;



const Studies = ({ classes, data, invalid }) => {
  /*const { data: interOpData, isLoading, isError } = useQuery({
    queryKey: ['studiesByProgram'],
    queryFn: async () => request(
      env.REACT_APP_INTEROP_SERVICE_URL,
      studiesByProgram,
    ),
  });*/
  
  /*
  const { data: interOpData, loading: isLoading, error: isError } = useQuery(studiesByProgram, {
    context: { uri: env.REACT_APP_INTEROP_SERVICE_URL+"graphql" }, // If using a custom endpoint
  }); */

  
  const { data: interOpData, loading: isLoading, error: isError } = {
    "data": {
      "studiesByProgram": [
        {
          "clinical_study_designation": "GLIOMA01",
          "CRDCLinks": [
            {
              "url": "https://portal.imaging.datacommons.cancer.gov/explore/filters/?collection_id=icdc_glioma",
              "repository": "IDC"
            },
            {
              "url": "https://nbia.cancerimagingarchive.net/nbia-search/?MinNumberOfStudiesCriteria=1&CollectionCriteria=ICDC-Glioma",
              "repository": "TCIA"
            }
          ],
          "numberOfCRDCNodes": 2,
          "numberOfImageCollections": 2
        }
      ]
    }
  }


  const overlay = useSelector((state) => (
    state.dashboardTab
      ? state.dashboardTab.isOverlayOpen : false));

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  if (isError) {
    return (
      <Typography variant="h5" color="error" size="sm">
        An error has occurred in interoperability api
      </Typography>
    );
  }

  return (
    <StudiesThemeProvider>
      <Stats />
      {
        invalid && !overlay ? (
          <InvalidAccesionModal />
        ) : null
    }
      <div className={classes.tableContainer}>
        <div className={classes.container}>
          <div className={classes.header}>
            <div className={classes.logo}>
              <img
                src={pageData.studyListingIcon.src}
                alt={pageData.studyListingIcon.alt}
              />

            </div>
            <div className={classes.headerTitle}>
              <div className={classes.headerMainTitle}>
                <span className={classes.headerMainTitle}>{pageData.table.title}</span>
              </div>
            </div>
          </div>

          <div className={classes.tableDiv}>
            <Grid container>
              <Grid item xs={12} id="table_studies">
                <TableContextProvider>
                  <StudiesTable
                    data={data.studiesByProgram}
                    interOpData={interOpData}
                    table={pageData.table}
                    tableLayOut={tableLayOut}
                    rowsPerPage={pageData.table.numbOfRowPerPage || 10}
                  />
                </TableContextProvider>
              </Grid>
            </Grid>
          </div>
        </div>

      </div>
    </StudiesThemeProvider>
  );
};

const styles = (theme) => ({
  dataAvailIndicator: {
    textAlign: 'center',
  },
  dataAvailIndicatorIcon: {
    color: '#1A89C4',
    height: '13px',
    width: '13px',
  },
  dalIcon: {
    width: '25px',
  },
  dataAvailIndicatorImage: {
    height: '20px',
    width: '20px',
  },
  crdcLinkStyle: {
    color: '#DC762F',
  },
  defaultDalTooltip: {
    maxWidth: 'none',
  },
  externalLinkDalTooltip: {
    maxWidth: 'none',
    padding: '0px 12px',
  },
  legend: {
    zIndex: '1000',
  },
  crdcLinks: {
    paddingLeft: '1em',
    textAlign: 'left',
  },
  legendTooltip: {
    position: 'relative',
    bottom: '0.5em',
  },
  link: {
    textDecoration: 'underline',
    fontFamily: 'Open Sans',
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#DC762F',
    lineSpacing: '19pt',
    float: 'left',
    marginRight: '5px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  embargoFileIcon: {
    width: '20px',
  },
  embargoToolTip: {
    visibility: 'hidden',
    fontWeight: '500',
    zIndex: '400',
    background: '#fff',
    border: '2px solid #A61401',
    borderRadius: '7px',
    fontSize: '12px',
    width: '110px',
    padding: '5px 0px 0px 2px',
    marginTop: '-30px',
    marginLeft: '-100px',
  },
  embargoToolTipMsgLeft: {

  },
  embargoToolTipMsgRight: {
  },
  buttonCaseNumb: {
    background: 'none!important',
    fontFamily: 'Open Sans',
    fontSize: '15px',
    border: 'none',
    lineSpacing: '19pt',
    padding: '0!important',
    textDecoration: 'underline',
    fontWeight: 'bold',
    color: '#DC762F',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  button: {
    background: 'none!important',
    border: 'none',
    padding: '0!important',
    textDecoration: 'none',
    fontWeight: 'bold',
    color: '#DC762F',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  card: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    margin: 'auto',
    paddingLeft: '27px',
    paddingRight: '27px',
    paddingTop: '60px',
  },
  paper: {
    textAlign: 'center',
  },
  fakeToolbar: {
    ...theme.mixins.toolbar,
  },
  root: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '9pt',
    letterSpacing: '0.025em',
    color: '#000',
    background: '#eee',
  },
  header: {
    background: '#eee',
    paddingLeft: '35px',
    paddingRight: '50px',
    borderBottom: '#004c73 10px solid',
    height: '154px',
    paddingTop: '60px',
  },
  headerMainTitle: {
    fontFamily: theme.custom.fontFamilyRaleway,
    fontWeight: '500',
    letterSpacing: '0.025em',
    color: '#0290C0',
    fontSize: '28px',
    position: 'absolute',
    marginTop: '12px',
    marginLeft: '10px',
    lineHeight: '25px',
  },
  headerTitle: {
    margin: 'auto',
    float: 'left',
    marginLeft: '90px',
  },
  logo: {
    position: 'absolute',
    float: 'left',
    width: '94px',
    zIndex: '10',
  },
  tableContainer: {
    background: '#eee',
    paddingBottom: '80px',
  },
  tableDiv: {
    margin: 'auto',
    fontSize: '10pt',
    fontFamily: '"Open Sans", sans-serif',
    letterSpacing: '0.025em',
    textAlign: 'left',
  },
});

export default withStyles(styles, { withTheme: true })(Studies);
