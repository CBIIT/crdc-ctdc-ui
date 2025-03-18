import React from 'react';
import { withStyles } from '@material-ui/core';

const DataAvailabilityHeader = ({
  classes,
  icon,
  dataField,
  iconAlt,
}) => (
  <>
    <img src={icon} alt={iconAlt} className={classes.icon} />
  </>
);

const styles = () => ({
  icon: {
    width: '25px',
    textAlign: 'center',
  },
});

export default withStyles(styles)(DataAvailabilityHeader);
