import { Grid, withStyles } from '@material-ui/core';
import React from 'react';
import { prepareLinks } from '@bento-core/util';
import PropertyItem from './PropertyItem';

const CARD_PROPERTIES = [
  {
    label: 'Data Model Node',
    dataField: 'node_name',
  },
  {
    label: 'Property Name',
    dataField: 'property_name',
  },
  {
    label: 'Property Description',
    dataField: 'property_description',
    hasBreakLine: true,
  },
  // {
  //   label: 'Property Required',
  //   dataField: 'property_required',
  // },
  // {
  //   label: 'Property Type',
  //   dataField: 'property_type',
  // },
  // {
  //   label: 'Property Value',
  //   dataField: 'value',
  // },
  {
    label: 'Page Link',
    dataField: 'node_name',
    link: '/data-model',
    linkText: 'Data Model',
  },
];

const ValueCard = ({ data, classes, index }) => {
  const propertiesWithLinks = prepareLinks(CARD_PROPERTIES, data);
  return (
    <Grid item container className={classes.card} id={`global_search_card_${index}`}>
      <Grid item className={classes.indexContainer}>
        {index + 1 }
      </Grid>
      <Grid item xs={true} className={classes.propertyContainer}>
        <div className={classes.titleRow}>
          <span className={classes.detailContainerHeader}>MODEL</span>
        </div>
        {propertiesWithLinks.map((prop, idx) => (
          <PropertyItem
            index={idx}
            value={data[prop.dataField]}
            {...prop}
          />
        ))}
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
    detailContainerHeader: {
      textTransform: 'uppercase',
      backgroundColor: '#F4D5D1',
      color: '#092630',
      verticalAlign: 'middle',

      fontFamily: 'Roboto',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '12px',
      letterSpacing: '0em',
      textAlign: 'left',
      height: '24px',
      padding: '6px 5px',
      borderRadius: '2px',
      gap: '10px',
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

export default withStyles(styles, { withTheme: true })(ValueCard);
