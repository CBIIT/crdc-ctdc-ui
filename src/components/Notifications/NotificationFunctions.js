import React from 'react';

const defaultLocation = {
  vertical: 'top',
  horizontal: 'center',
};

const NotificationFunctions = () => {
  // States
  const [open, setOpen] = React.useState(false);
  const [duration, setDuration] = React.useState(10000);
  const [message, setMessage] = React.useState('');
  const [location, setLocation] = React.useState(defaultLocation);
  const [customStyle, setCustomStyle] = React.useState({});

  // Variables

  // Methods for Notifications.
  const close = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const show = (msg, timeoutDuration, style, notificationLocation = defaultLocation) => {
    setMessage(msg);
    setDuration(timeoutDuration);
    setCustomStyle(style);
    setLocation(notificationLocation);
    setOpen(true);
  };

  const getProps = () => ({
    open, duration, message, location, customStyle,
  });

  return {
    show,
    close,
    getProps,
  };
};

export default NotificationFunctions;
