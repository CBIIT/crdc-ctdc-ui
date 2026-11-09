import { useHistory } from 'react-router';
import { useAuth } from '../../Authentication';
import { useGlobal } from '../../Global/GlobalProvider';
import { getAuthenticatedIdp } from '../../../utils/authUtil';

const LOGOUT_ERROR_MESSAGE = 'Unable to complete logout. Please try again.';
const LOGOUT_SUCCESS_MESSAGE = 'You have been logged out.';

/**
 * @param {object} options
 * @param {object} options.authData Redux login state for the signed-in user.
 *   This is passed to getAuthenticatedIdp for compatibility with the existing
 *   auth API, but CTDC currently defaults logout IDP to RAS.
 * @param {string} [options.redirectPath='/'] Local redirect path used when RAS
 *   browser logout is not started.
 */
export const useHeaderLogout = ({
  authData,
  redirectPath = '/',
} = {}) => {
  const history = useHistory();
  const { signOut } = useAuth();
  const { Notification } = useGlobal();

  return async () => {
    const idp = getAuthenticatedIdp(authData);
    const logoutResult = await signOut(history, redirectPath, idp);

    if (!logoutResult) {
      return logoutResult;
    }

    if (!logoutResult.logoutCompleted) {
      Notification.show(logoutResult.errorMessage || LOGOUT_ERROR_MESSAGE, 6000);
      return logoutResult;
    }

    if (!logoutResult.externalLogoutStarted) {
      Notification.show(LOGOUT_SUCCESS_MESSAGE, 2000);
    }

    return logoutResult;
  };
};
