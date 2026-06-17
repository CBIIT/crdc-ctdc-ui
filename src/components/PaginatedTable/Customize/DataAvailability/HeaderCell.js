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
      className={classes.icon}
      style={dataField === 'numberOfPublications' ? { width: '38px', paddingTop: '4px' } : undefined}
    />
  </>
);

const styles = () => ({
  icon: {
    width: '35px',
    textAlign: 'center',
  },
});

export default withStyles(styles)(DataAvailabilityHeader);
