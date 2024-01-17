import { Grid, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import { prepareLinks } from '@bento-core/util';
import PropertyItem from './PropertyItem';
import { cn } from 'bento-components';

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
    link: '/',
  },
];

const ValueCard = ({ data, classes, index }) => {
  const propertiesWithLinks = prepareLinks(CARD_PROPERTIES, data);
  console.log("Data: ", data)
  return (
    <Grid item container className={classes.card} id={`global_search_card_${index}`}>
      <Grid item xs={1} className={classes.indexContainer}>
        {index + 1 }
      </Grid>
      <Grid item xs={11} className={classes.propertyContainer}>
        <div className={cn(classes.row, classes.titleRow)}>
          <span className={classes.detailContainerHeader}>MODEL</span>
          <Typography variant="h3" className={classes.cardTitle}>
            CMB
          </Typography>
        </div>
        {propertiesWithLinks.map((prop, idx) => (
          <PropertyItem
            index={idx}
            label={prop.label}
            value={data[prop.dataField]}
            link={prop.link}
          />
        ))}
      </Grid>
      <Grid item className={classes.hrContainer}>
        <hr className={classes.hr}/>
      </Grid>
    </Grid>
  );
};

const styles = (theme) => ({
  card: {
    '&:last-child $hrContainer': {
      display: 'none',
    },
    maxWidth: '800px',
  },
  indexContainer: {
    color: '#767676',
    fontFamily: 'Roboto',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '16px',
    textAlign: 'left',
  },
  propertyContainer: {
    // padding: '16px 16px 16px 0px',
    // borderBottom: '10px solid #E7EEF5',
  },
  row: {
    display: 'flex',
    margin: '0px',
    padding: '0px',
  },
  titleRow: {
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
    color: '#990099',
    paddingLeft: '10px',
    verticalAlign: 'middle',
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

export default withStyles(styles, { withTheme: true })(ValueCard);
