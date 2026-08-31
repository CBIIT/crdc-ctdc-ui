import React, { useState } from 'react';
import { Divider, Typography, withStyles } from '@material-ui/core';
import ArrowRight from '@material-ui/icons/ArrowRight';
import clsx from 'clsx';

const SummaryTable = (props) => {
  const {
    classes, matched, unmatched, error = null,
  } = props;

  const [tab, setTab] = useState('matched');
  const total = matched.length + unmatched.length;
  const uniqueStudies = new Set(matched.map((d) => d.program_id)).size;

  return (
    <div className={classes.summaryContainer} id="uploadCaseSetSummarySection">
      <p className={classes.summary} id="uploadCaseSetSummaryCount">
        {`${total} submitted Participant IDs mapped to ${uniqueStudies} unique Associated Studies`}
      </p>
      {error ? (
        <Typography className={clsx(classes.summary, classes.error)}>
          {error}
        </Typography>
      ) : null}
      <p className={classes.title}>
        Summary Table
        <ArrowRight className={classes.arrowRight} />
      </p>
      <div className={classes.btnContainer}>
        <span
          className={tab === 'matched' ? classes.summaryButton : classes.unselectedButton}
          onClick={() => setTab('matched')}
          id="uploadCaseSetMatched"
        >
          <span>Matched&nbsp;-&nbsp;</span>
          <span id="uploadCaseSetMatchedCount">{matched.length}</span>
        </span>
        <span
          className={tab === 'unmatched' ? classes.summaryButton : classes.unselectedButton}
          onClick={() => setTab('unmatched')}
          id="uploadCaseSetUnMatched"
        >
          <span>Unmatched&nbsp;-&nbsp;</span>
          <span id="uploadCaseSetUnMatchedCount">{unmatched.length}</span>
        </span>
      </div>
      <div className={classes.tableBox}>
        {tab === 'matched' ? (
          matched.length ? (
            <table className={classes.tableContainer} id="uploadCaseSetMatchedTable">
              <thead>
                <tr id="uploadCaseSetMatchedHeader">
                  <th className={classes.header} style={{ width: '55%' }}>Participant ID</th>
                  <td className={classes.emptyCell} />
                  <th className={classes.header} style={{ width: '45%' }}>Associated Study</th>
                </tr>
                <tr className={classes.heading}>
                  <td className={classes.columnPadding}><Divider style={{ width: '100%' }} className={classes.divider} /></td>
                  <td className={classes.emptyCell} />
                  <td className={classes.dividerContainer}><Divider className={classes.divider} /></td>
                </tr>
              </thead>
              <tbody>
                {matched.map((data, idx) => (
                  <tr key={idx}>
                    <td className={classes.tableColumn} style={{ backgroundColor: idx % 2 ? '#fff' : '#F8F8F8' }}>{data.subject_id}</td>
                    <td className={classes.emptyCell} />
                    <td className={classes.programHeading} style={{ backgroundColor: idx % 2 ? '#fff' : '#F8F8F8' }}>{data.program_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null
        ) : (
          unmatched.length ? (
            <table className={classes.tableContainer} id="uploadCaseSetUnMatchedTable">
              <thead>
                <tr>
                  <th id="uploadCaseSetUnMatchedHeader" className={classes.header}>Participant ID</th>
                </tr>
                <tr className={classes.heading}><td><Divider className={classes.divider} /></td></tr>
              </thead>
              <tbody>
                {unmatched.map((data, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 ? '#fff' : '#F8F8F8' }}>
                    <td className={classes.tableColumn}>{data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null
        )}
      </div>
    </div>
  );
};

const styles = () => ({
  tableContainer: {
    border: '1px solid #c1c1c1',
    width: '-webkit-fill-available',
    backgroundColor: '#fff',
    padding: '7px 15px 10px 18px',
    marginBottom: 16,
  },
  summaryButton: {
    fontSize: 12,
    fontWeight: 500,
    color: '#00387A',
    backgroundColor: '#fff',
    borderBottom: '4px solid #026551',
    cursor: 'pointer',
    padding: '11px 22px',
    fontFamily: 'Lato',
    textTransform: 'uppercase',
  },
  unselectedButton: {
    fontSize: 12,
    fontWeight: 500,
    color: '#00387A',
    backgroundColor: '#DEE0E2',
    cursor: 'pointer',
    padding: '11px 22px',
    fontFamily: 'Lato',
    textTransform: 'uppercase',
  },
  btnContainer: {
    display: 'flex',
    marginBottom: 0,
  },
  summary: {
    color: '#026551',
    fontSize: 14,
    textAlign: 'center',
    margin: 0,
    paddingTop: 10,
    fontFamily: 'Lato',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 300,
    color: '#000',
    fontSize: 16,
    fontFamily: 'Nunito',
  },
  arrowRight: {
    color: '#026551',
    fontSize: '2.5rem',
  },
  summaryContainer: {
    backgroundColor: '#CCD4DD',
    paddingLeft: 33,
    paddingRight: 33,
  },
  heading: {
    fontSize: 12,
    color: '#026551',
    textAlign: 'center',
    fontFamily: 'Lato',
    fontWeight: 400,
    lineHeight: '22px',
    letterSpacing: '0.12px',
    paddingBottom: 10,
  },
  header: {
    fontSize: 12,
    color: '#026551',
    textAlign: 'center',
    fontFamily: 'Lato',
    fontWeight: 400,
    lineHeight: '22px',
    letterSpacing: '0.12px',
    paddingBottom: 4,
  },
  programHeading: {
    textAlign: 'center',
  },
  divider: {
    backgroundColor: '#A4D0B4',
    width: '100%',
    height: 1,
  },
  dividerContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  emptyCell: {
    width: 20,
  },
  tableColumn: {
    color: '#000',
    textAlign: 'center',
  },
  tableBox: {
    maxHeight: 150,
    overflowY: 'auto',
    maxWidth: '100%',
  },
  error: {
    color: 'red',
  },
});

export default withStyles(styles, { withTheme: true })(SummaryTable);

