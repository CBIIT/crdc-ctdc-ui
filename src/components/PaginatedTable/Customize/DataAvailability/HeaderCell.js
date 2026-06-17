import React from 'react';
import { withStyles } from '@material-ui/core';

const DataAvailabilityHeader = ({
  classes,
  icon,
  dataField,
  iconAlt,
}) => (
  <>
    <img
      src={icon}
      alt={iconAlt}
      className={dataField === 'numberOfPublications' ? classes.publicationsIcon : classes.icon}
    />
  </>
);

const styles = () => ({
  icon: {
    width: '35px',
    textAlign: 'center',
  },
  publicationsIcon: {
    width: '38px',
    textAlign: 'center',
    paddingTop: '4px',
  },
});

export default withStyles(styles)(DataAvailabilityHeader);
