import React from 'react';
import { useSelector } from 'react-redux';
import env from '../../utils/env';

const {
  REACT_APP_AUTH_SERVICE_API,
} = env;


const extendSession = async () => {
  try {
    const { status } = await fetch(`${REACT_APP_AUTH_SERVICE_API}authenticated`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).catch(() => {});

    return typeof status === 'boolean' && status;
  } catch (e) {
    return false;
  }
}


const ActivitiesController = (props) => {
   const {
      children
    } = props;

 const {
    isSignedIn
  } = useSelector((state) => state.login);

  // if signed In then extend the session
  if(isSignedIn){
    extendSession()
  }

  return (
      <>
        {children}
      </>
  );
};

export default ActivitiesController;
