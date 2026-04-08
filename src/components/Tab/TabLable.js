import React from 'react';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';

const tabLabel = ({
  classes, title, primaryColorClass, icon,
}) => (
  <div className={classNames(classes.defaultStyle, primaryColorClass)}>
    {(icon && (<img src={icon} alt="icdc_carousel_tabs" />))}
    <span>
      {title}
      {' '}

    </span>
  </div>
);

const styles = () => ({
  defaultStyle: {
    height: '46px',
    paddingTop: '8px',

    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '100%',
    letterSpacing: 0,
    textAlign: 'center',
    verticalAlign: 'middle',

  },
});

export default withStyles(styles, { withTheme: true })(tabLabel);
