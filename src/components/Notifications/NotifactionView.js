import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useGlobal } from '../Global/GlobalProvider';
import { cn } from 'bento-components';


const Alert = withStyles(() => ({
  message: {},
}))((props) => <MuiAlert elevation={6} variant="filled" {...props} />);

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  snackbarStyles: {
    marginTop: '115px',
  },
  alertStyles: {
    // Widths & Size
    width: '535px',
    minHeight: '50px',
    boxSizing: 'border-box',

    // Fonts
    color: '#ffffff',
    fontFamily: 'Roboto',
    textAlign: (props) => props.textAlign || 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '400',
    letterSpacing: '0',
    lineHeight: '24px',

    // Background & Borders
    backgroundColor: (props) => props.backgroundColor || '#155E6F',
    borderColor: (props) => props.backgroundColor || 'none',
    borderRadius: '0px',
    boxShadow: '-4px 8px 27px 4px rgba(27,28,28,0.09)',

    // Positioning
    zIndex: '1100',
  },
}));

const NotificationView = () => {
  const { Notification } = useGlobal();
  const {
    open, message, duration, location, customStyle
  } = Notification.getProps();
  const classes = useStyles();

  const { vertical, horizontal } = location;

  const handleClose = () => {
    Notification.close();
  };

  const mergedStyles = cn(classes.alertStyles, customStyle);

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        className={classes.snackbarStyles}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={duration || 5000}
        onClose={handleClose}
      >
        <Alert className={mergedStyles} icon={false} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NotificationView;
