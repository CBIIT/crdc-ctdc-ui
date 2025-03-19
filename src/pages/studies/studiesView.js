import React from 'react';
import {
  CircularProgress,
  Grid,
  withStyles,
} from '@material-ui/core';
import { useQuery } from '@apollo/client';
import {
  GET_STUDY_DATA_INTEROPS_QUERY,
  pageData,
  tableLayOut,
} from '../../bento/studiesData';
import Stats from '../../components/Stats/AllStatsController';
import StudiesThemeProvider from './studiesMuiThemConfig';
import env from '../../utils/env';
import {
  TableContextProvider,
} from '../../bento-core';
import StudiesTable from '../../components/DataAvailabilityTable/StudiesTable';

const Studies = ({ classes, data }) => {

  const { data: interOpData, loading: isLoading, error: isError } = useQuery(GET_STUDY_DATA_INTEROPS_QUERY, {
    context: { uri: `${env.REACT_APP_INTEROP_SERVICE_URL}graphql` },
  });

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  // TODO: Ensure the InterOp API is stable to minimize reliance on the backend API as a fallback.
  const finalInterOpData = isError ? data : interOpData; // Use `data` as a fallback if `isError` occurs

  if (isError) {
    console.warn("An error has occurred in interoperability api. Error message: ", isError)
    /* return (
      <Typography variant="h5" color="error" size="sm">
        An error has occurred in interoperability api
      </Typography>
    ); */
  }

  const getHeaderIcon = () => (
    <img
      src={pageData.studyListingIcon.src}
      alt={pageData.studyListingIcon.alt}
    />
  );

  return (
    <StudiesThemeProvider>
      <Stats />
      
      <div className={classes.tableContainer}>
        <div className={classes.container}>
          <div className={classes.header}>
            <div className={classes.logo}>
              { getHeaderIcon() }
            </div>
            <div className={classes.headerTitle}>
              <span> {pageData.table.title} </span>
            </div>
          </div>

          <div className={classes.tableDiv}>
            <Grid container>
              <Grid item xs={12} id="table_studies">
                <TableContextProvider>
                  <StudiesTable
                    data={data.getAllStudies}
                    interOpData={finalInterOpData}
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
  tableContainer: {
    background: 'white',
    paddingBottom: '80px',
  },
  container: {
    paddingTop: '28px',
    fontFamily: 'Raleway, sans-serif',
    paddingLeft: '32px',
    paddingRight: '32px',
    maxWidth: '1800px',
    margin: "0 auto",
  },
  header: {
    paddingLeft: '35px',
    paddingTop: '31px',
    borderBottom: '#4B619A 12px solid',
    height: '83px',
    margin: 'auto',
    position: 'relative',
  },
  logo: {
    float: 'left',
    marginTop:'-76px',
    marginLeft: '-68px',
    position: 'absolute',
  },
  headerTitle: {
    float: 'left',
    top: '23px',
    left: '85px',
    position: 'absolute',

    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '26px',
    color: '#274FA6',
    paddingLeft: '3px',
    lineHeight: '31px',
    letterSpacing: '-2%',
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
