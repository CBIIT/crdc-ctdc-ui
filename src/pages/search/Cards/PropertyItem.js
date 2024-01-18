import React from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import Anchor from '../../../utils/Anchor';

/**
 * Property Item component generates the result card key:value element
 * e.g. "Program ID: NCT00000000" or "Age: 33"
 *
 * @param {object} props
 * @param {string} props.label - the label of the property
 * @param {string} props.value - the value of the property
 * @param {string} props.link - the relative link of the value (e.g. a local link)
 * @param {string} props.labelLink - the hyperlink of the label (e.g. to an external site)
 * @param {object} props.classes - the classes object used to style the component
 * @param {number} props.index
 * @returns {JSX.Element}
 */
const PropertyItem = ({ ...props }) => {
  const {
    label, value, link, labelLink, classes, index,
  } = props;
  const defaultValue = '';

  return (
    <Grid item container className={classes.propertyContainer}>
      {value ? (
        <Grid item xs={12} className={classes.row}>
          <Typography variant="h6" className={classes.title} id={`section_title_${index + 1}`}>
            {labelLink ? <Anchor link={labelLink} text={label} classes={classes} /> : `${label}:`}
          </Typography>
          <Typography variant="body1" className={classes.content} id={`section_description_${index + 1}`}>
            {value || value === 0 ? (
              link ? <Anchor link={link} text={value} classes={classes} /> : value
            ) : defaultValue}
          </Typography>
        </Grid>
      ) : '' }
    </Grid>
  );
};

const styles = () => ({
  row: {
    display: 'flex',
    margin: '0px',
    padding: '0px',
  },
  content: {
    color: '#000000',
    fontFamily: 'Roboto',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0em',
    textAlign: 'left',
  },
  title: {
    textTransform: 'uppercase',
    width: '115px',
    maxWidth: '115px',
    minWidth: '115px',
    color: '#000000',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '21px',
    letterSpacing: '0px',
    textAlign: 'left',
  },
  propertyContainer: {
    lineHeight: '17px',
    paddingLeft: '3px',
  },
  link: {
    color: '#990099',
    textDecoration: 'none',
    fontFamily: 'Roboto',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    letterSpacing: '0px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

export default withStyles(styles, { withTheme: true })(PropertyItem);
