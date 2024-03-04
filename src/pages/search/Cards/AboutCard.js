import React from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import Anchor from '../../../utils/Anchor';

const AboutCard = ({
  searchText, data, classes, index,
}) => {
  const results = data.text.map((result) => result.replaceAll('$', ''));

  function getHighlightedText(text, highlight, classes) {
    // Split on highlight term and include term into parts, ignore case
    const textString = text.reduce((searchResults, currentString, currentIndex) => {
      let newResults = searchResults;
      if (currentString.endsWith('.') || currentIndex >= text.length - 1) {
        newResults = `${`${newResults} ${currentString}`}`;
      } else {
        newResults = `${`${newResults} ${currentString}`} ... `;
      }
      return newResults;
    }, '');
    const parts = textString.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {' '}
        { parts.map((part, i) => (
          <span id={i} className={part.toLowerCase() === highlight.toLowerCase() ? classes.highlightText : {} }>
            { part }
          </span>
        ))}
        {' '}
      </span>
    );
  }

  return (
    <Grid item container className={classes.card} id={`global_search_card_${index}`}>
      <Grid item className={classes.indexContainer}>
        {index + 1 }
      </Grid>
      <Grid item xs={true} className={classes.propertyContainer}>
        <div className={classes.titleRow}>
          <span className={classes.detailContainerHeader}>GENERAL</span>
          <Typography variant="h3" className={classes.cardTitle}>
            {data.title}
          </Typography>
        </div>
        <div className={classes.cardBody}>
          <div className={classes.text}>{getHighlightedText(results, searchText, classes)}</div>
          <div className={classes.linkText}>
            <Anchor link={data.page} text={`${window.location.origin}${data.page}`} classes={classes}/>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.hrContainer}>
        <hr className={classes.hr}/>
      </Grid>
    </Grid>
  );
};

const styles = (theme) => {
  const mdBreakpoint = '@media (min-width: 750px)';
  const lgBreakpoint = '@media (min-width: 1000px)';

  return {
    card: {
      '&:last-child $hrContainer': {
        display: 'none',
      },
      [lgBreakpoint]: {
        minWidth: '959px',
        width: '959px',
      },
      maxWidth: '800px',
      padding: '0px',
    },
    linkText: {
      marginTop: '4px',
    },
    link: {
      fontFamily: 'Roboto',
      fontSize: '15px',
      fontWeight: 500,
      lineHeight: '23px',
      letterSpacing: '0em',
      textAlign: 'left',
      color: '#990099',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    indexContainer: {
      fontFamily: 'Roboto',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '16px',
      letterSpacing: '0px',
      textAlign: 'left',
      color: '#747474',
      width: '25px',
      [mdBreakpoint]: {
        width: '49px',
      }
    },
    titleRow: {
      display: 'flex',
      margin: '0px',
      padding: '0px',
      marginBottom: '5px',
    },
    cardTitle: {
      textDecoration: 'none',
      fontFamily: 'Inter',
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '22px',
      color: '#004D73',
      paddingLeft: '10px',
      verticalAlign: 'middle',
    },
    detailContainerHeader: {
      textTransform: 'uppercase',
      padding: '6px 5px',
      backgroundColor: '#EEDEF1',
      color: '#092630',
      fontFamily: 'Roboto',
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '12px',
      verticalAlign: 'middle',
      borderRadius: '2px',
      textAlign: 'left',
    },
    cardBody: {
      marginLeft: '3px',
    },
    text: {
      color: '#000000',
      fontFamily: 'Roboto',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0em',
      textAlign: 'left',
    },
    highlightText: {
      color: '#004D73',
      fontWeight: 600,
    },
    hrContainer: {
      paddingTop: '10px',
      paddingBottom: '10px',
      maxWidth: '800px',
      marginLeft: '18px',
      [mdBreakpoint]: {
        marginLeft: '36px',
      },
      [lgBreakpoint]: {
        marginLeft: '36px',
        width: '925px',
        minWidth: '925px',
      },
    },
    hr: {
      width: '100%', 
      border: '1px solid #E7EEF5',
      margin: '10px 0px',
      padding: '0px',
    }
  }
};

export default withStyles(styles, { withTheme: true })(AboutCard);
