import React from 'react';
import {
  Grid,
  withStyles,
} from '@material-ui/core';
import {
  pageData,
  tableLayOut,
} from '../../bento/studiesData';
import Stats from '../../components/Stats/AllStatsController';
import StudiesThemeProvider from './studiesMuiThemConfig';
import {
  TableContextProvider,
} from '../../bento-core';
import StudiesTable from '../../components/DataAvailabilityTable/StudiesTable';

const Studies = ({ classes, data}) => {
  // Helper function to render the header icon
  const renderHeaderIcon = () => (
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
          {/* Header Section */}
          <div className={classes.header}>
            <div className={classes.logo}>
              { renderHeaderIcon() }
            </div>
            <div className={classes.headerTitle}>
              <span> {pageData.table.title} </span>
            </div>
          </div>

          {/* Table Section */}
          <div className={classes.tableDiv}>
            <Grid container>
              <Grid item xs={12} id="table_studies">
                <TableContextProvider>
                  <StudiesTable
                    data={data.getAllStudies}
                    interOpData={data.getAllStudies}
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
