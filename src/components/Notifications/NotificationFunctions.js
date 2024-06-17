import React from 'react';

const NotificationFunctions = () => {
  // States
  const [open, setOpen] = React.useState(false);
  const [duration, setDuration] = React.useState(10000);
  const [message, setMessage] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = React.useState({
    vertical: 'top',
    horizontal: 'center',
  });
  const [customStyle, setCustomStyle] = React.useState({});

  // Variables

  // Methods for Notifications.
  const close = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const show = (msg, timeoutDuration, style) => {
    setMessage(msg);
    setDuration(timeoutDuration);
    setCustomStyle(style); // Add this line to set the custom style
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
