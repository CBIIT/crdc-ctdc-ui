import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { redirect } from '../../Authentication';
import { useAuth } from '../../Authentication';
import { LAST_VISITED_HASH_KEY } from '../../../bento/siteWideConfig';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function getRedirectPath(query) {
  const state = JSON.parse(query.get('state')) || {};
  const redirectHash = localStorage.getItem(LAST_VISITED_HASH_KEY)
  const path = redirectHash ? `/${redirectHash}` : `/#${state.internalRedirectPath || ""}`;
  return path;
}

function getErrorData(query) {
  const error = query.get('error') || {};
  const errorDescription = query.get('error_description') || {};
  return { error, errorDescription };
}

function nihLoginSuccess() {
  const history = useHistory();
  const query = useQuery();
  const { authServiceLogin } = useAuth();
  const redirectPath = getRedirectPath(query);
  const nihCode = query.get('code');
  const originDomain = window.location.origin;
  const message = 'Please wait while redirecting....';
  const [notificationMessage, setNotificationMessage] = useState(message);

  const onSuccess = () => redirect(history, redirectPath);
  const onError = (error) => {console.log("Error: ", error)};

  useEffect(() => {
    if (nihCode) {
      authServiceLogin(nihCode, 'dcf', `${originDomain}/login`, onSuccess, onError);
    } else {
      const { error, errorDescription } = getErrorData(query);
      if (error) {
        const errorNotification = (
          <div>
            {errorDescription}
            <span>
              .
              {' '}
              Please go back to
              {' '}
              <Link to="/#/">Home Page</Link>
              {' '}
              or
              {' '}
              <Link to="/#/user/login">Login Page</Link>
              {' '}
              to login again.
            </span>

          </div>
        );
        setNotificationMessage(errorNotification);
      }
    }
  }, []);

  return (
    <div>{notificationMessage}</div>
  );
}

export default nihLoginSuccess;
