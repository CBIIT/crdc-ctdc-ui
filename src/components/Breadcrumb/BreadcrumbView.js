import React from 'react';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const CustomBreadcrumb = ({ classes, separator="/", data }) => (
  <div id="bread_crumb" className={classes.headerNav}>
    {
      data.reduce((acc, current, index) => {
        if (current.isALink) {
          acc.push(
            <Link
              className={classes.headerNavLink}
              to={current.to}
              onClick={current.onClick}
              key={current.to}
              id={`${index + 1}_breadcrumb`}
            >
              {current.name}
            </Link>,
          );
        } else {
          acc.push(<span className={classes.headerNavSpan}>{current.name}</span>);
        }
        if (index < data.length - 1) {
          acc.push(<span className={classes.separator}>{separator}</span>);
        }
        return acc;
      }, []).map((item) => (item))
    }
  </div>
);

const styles = (theme) => ({
  headerNav: {
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '17.16px',
    letterSpacing: '0.3px',
    color: '#0B4E75',
  },
  headerNavLink: {
    fontWeight: 700,
    color: '#0B4E75',
    textDecoration: 'none',
  },
  separator: {
    color: '#0B4E75',
    fontFamily: 'Lato',
    fontWeight: 500,
    fontSize: '15px',
    letterSpacing: '0.14px',
    padding: '0px 6px',
    position: 'relative',
    top: '1px',
  },
});

export default withStyles(styles)(CustomBreadcrumb);
