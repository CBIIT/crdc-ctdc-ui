import React from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
// import { Anchor } from '@bento-core/util';
import { cn } from 'bento-components';
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
      <Grid item xs={1} className={classes.indexContainer}>
        {index + 1 }
      </Grid>
      <Grid item xs={11} className={classes.propertyContainer}>
        <div className={cn(classes.row, classes.titleRow)}>
          <span className={classes.detailContainerHeader}>ABOUT</span>
          <Typography variant="h3" className={classes.cardTitle}>
            {data.title}
          </Typography>
        </div>
        <div className={classes.text}>{getHighlightedText(results, searchText, classes)}</div>
        <div className={classes.linkText}>
          <Anchor link={data.page} text={`${window.location.origin}${data.page}`} classes={classes}/>
        </div>
      </Grid>
      <Grid item className={classes.hrContainer}>
        <hr className={classes.hr}/>
      </Grid>
    </Grid>
  );
};

const styles = (theme) => ({
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
  },
  indexContainer: {
    color: '#767676',
    fontFamily: 'Roboto',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '16px',
    textAlign: 'left',
  },
  row: {
    display: 'flex',
    margin: '0px',
    padding: '0px',
  },
  titleRow: {
    marginBottom: '5px',
  },
  cardTitle: {
    textDecoration: 'none',
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '22px',
    color: '#990099',
    paddingLeft: '15px',
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
     color: '#990099',
     fontWeight: 400,
  },
  hrContainer: {
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  hr: {
    minWidth: '836px',
    width: '836px',
    border: '1px solid #E7EEF5',
    margin: '10px 0px 10px 36px',
    padding: '0px',
  }
});

export default withStyles(styles, { withTheme: true })(AboutCard);
