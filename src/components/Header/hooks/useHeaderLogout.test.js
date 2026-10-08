import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useHistory } from 'react-router';
import { useAuth } from '../../Authentication';
import { useGlobal } from '../../Global/GlobalProvider';
import { getAuthenticatedIdp } from '../../../utils/authUtil';
import { useHeaderLogout } from './useHeaderLogout';

jest.mock('react-router', () => ({
  useHistory: jest.fn(),
}));

jest.mock('../../Authentication', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../Global/GlobalProvider', () => ({
  useGlobal: jest.fn(),
}));

jest.mock('../../../utils/authUtil', () => ({
  getAuthenticatedIdp: jest.fn(),
}));

describe('useHeaderLogout', () => {
  const authData = { IDP: 'ras' };
  const history = { push: jest.fn() };
  const signOut = jest.fn();
  const show = jest.fn();
  let logout;
  let container;

  const TestComponent = ({ redirectPath = '/', testAuthData = authData }) => {
    logout = useHeaderLogout({
      authData: testAuthData,
      redirectPath,
    });
    return null;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    logout = undefined;
    container = document.createElement('div');
    document.body.appendChild(container);
    getAuthenticatedIdp.mockReturnValue('ras');
    useHistory.mockReturnValue(history);
    useAuth.mockReturnValue({ signOut });
    useGlobal.mockReturnValue({
      Notification: {
        show,
      },
    });
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  const renderHookComponent = (props = {}) => {
    act(() => {
      ReactDOM.render(<TestComponent {...props} />, container);
    });
  };

  it('passes the resolved IDP and redirect path to signOut', async () => {
    signOut.mockResolvedValue({
      logoutCompleted: true,
      externalLogoutStarted: true,
    });

    renderHookComponent({ redirectPath: '/home' });

    let logoutResult;
    await act(async () => {
      logoutResult = await logout();
    });

    expect(getAuthenticatedIdp).toHaveBeenCalledWith(authData);
    expect(signOut).toHaveBeenCalledWith(history, '/home', 'ras');
    expect(show).not.toHaveBeenCalled();
    expect(logoutResult).toEqual({
      logoutCompleted: true,
      externalLogoutStarted: true,
    });
  });

  it('shows the local success message when Auth logout completes without external RAS redirect', async () => {
    signOut.mockResolvedValue({
      logoutCompleted: true,
      externalLogoutStarted: false,
    });

    renderHookComponent();

    await act(async () => {
      await logout();
    });

    expect(show).toHaveBeenCalledWith('You have been logged out.', 2000);
  });

  it('does not show a local success message when external RAS logout starts', async () => {
    signOut.mockResolvedValue({
      logoutCompleted: true,
      externalLogoutStarted: true,
    });

    renderHookComponent();

    await act(async () => {
      await logout();
    });

    expect(show).not.toHaveBeenCalled();
  });

  it('shows the Auth logout error message when logout fails', async () => {
    signOut.mockResolvedValue({
      logoutCompleted: false,
      externalLogoutStarted: false,
      errorMessage: 'Unable to complete logout. Auth service returned status code 500.',
    });

    renderHookComponent();

    await act(async () => {
      await logout();
    });

    expect(show).toHaveBeenCalledWith(
      'Unable to complete logout. Auth service returned status code 500.',
      6000,
    );
  });

  it('shows the fallback error message when logout fails without an error message', async () => {
    signOut.mockResolvedValue({
      logoutCompleted: false,
      externalLogoutStarted: false,
    });

    renderHookComponent();

    await act(async () => {
      await logout();
    });

    expect(show).toHaveBeenCalledWith(
      'Unable to complete logout. Please try again.',
      6000,
    );
  });
});
