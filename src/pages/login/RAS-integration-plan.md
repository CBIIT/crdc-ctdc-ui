# RAS Authentication/Authorization Integration Plan

## Overview

Integrate NIH Researcher Auth Service (RAS) login into the CTDC frontend. The backend auth service (`crdc-ctdc-authn`) handles the OAuth code exchange directly via `/api/auth/callback`. The frontend handles the redirect after session creation.

## Architecture Difference: eRA Commons vs RAS

| Step | eRA Commons (current) | RAS (new) |
|------|----------------------|-----------|
| User clicks login | Redirect to NIH OAuth | Redirect to RAS OAuth (`REACT_APP_RAS_AUTHORIZE_URL`) |
| OAuth callback | Frontend `/login?code=XXX` | Backend `/api/auth/callback?code=XXX` |
| Code exchange | Frontend sends code to `{AUTH_API}login` | Backend does it internally |
| Session creation | Backend returns user details, frontend stores | Backend creates session cookie, redirects to frontend |
| Frontend landing | `nihLoginSuccess.js` at `/login` | `rasLoginSuccess.js` at `/rasloginsuccess` |
| User state hydration | From `authServiceLogin` response | From `GET {AUTH_API}authenticated` |

## Frontend Tasks

### 1. RAS Login Page UI (DONE)
- File: `src/pages/login/RAS.js`
- Lock icon, sections, accordions, help sidebar
- "Login with RAS" button redirects to `env.REACT_APP_RAS_AUTHORIZE_URL`

### 2. Create `rasLoginSuccess` Component
- File: `src/components/Auth/components/rasLoginSuccess.js`
- Handles redirect from backend after RAS auth completes
- Flow:
  1. Check for `?error=` query params -> show error message
  2. If no error, call `GET {AUTH_API}authenticated` (session cookie already set by backend)
  3. On 200: dispatch `signIn(userDetails)` to Redux, store in localStorage, redirect to saved path
  4. On failure: show error with link to login page

### 3. Register Route in App.js
- File: `src/components/App.js`
- Add: `import rasLoginSuccess from './Auth/components/rasLoginSuccess'`
- Add route: `<Route path="/rasloginsuccess" component={rasLoginSuccess} />`
- Order: before `/login` and `/` routes

### 4. Register RAS Page Route
- File: `src/components/Layout/LayoutView.js`
- Add RAS login page route (e.g., `<LoginRoute path="/user/ras-login" component={RASLoginPage} />`)
- Uses `LoginRoute` so logged-in users are redirected away

### 5. Save Redirect Path Before RAS Redirect
- In `RAS.js`, before redirecting:
  ```javascript
  localStorage.setItem(LAST_VISITED_HASH_KEY, window.location.hash);
  ```

### 6. Add Env Variables
- File: `conf/inject.template.js`
- Add: `REACT_APP_RAS_AUTHORIZE_URL: '@@REACT_APP_RAS_AUTHORIZE_URL'`

### 7. Guard for Missing Env Var
- In `RAS.js`: disable button if `env.REACT_APP_RAS_AUTHORIZE_URL` is undefined

## Backend Requirements (for coordination)

- After `/api/auth/callback` processes RAS code successfully:
  - Create session cookie
  - Redirect browser to `{frontend_origin}/rasloginsuccess`
- On error:
  - Redirect to `{frontend_origin}/rasloginsuccess?error=...&error_description=...`
- `GET {AUTH_API}authenticated` must return user details JSON when session is valid
- `POST {AUTH_API}logout` must invalidate RAS session (call RAS `/connect/session/logout`)
- Token refresh handled server-side (transparent to frontend)

## Session/Logout/Download (No Frontend Changes Needed)

- **Session timeout**: Existing `SessionTimeoutController` pings `{AUTH_API}authenticated` — works with any session cookie
- **Logout**: Existing `onSignOut` calls `POST {AUTH_API}logout` — backend handles RAS-specific cleanup
- **File download**: Existing flow uses session cookie -> backend uses stored passport/visas to call DCF DRS
- **403 handling**: Existing notification works as-is

## Verification Checklist

- [ ] Click "Login with RAS" -> redirects to NIH RAS login screen
- [ ] Authenticate with test account -> redirected to `/rasloginsuccess` -> session established
- [ ] User details appear in Redux/localStorage after login
- [ ] Navigate to protected route -> access granted
- [ ] Controlled-access file download succeeds (if dbGaP access exists)
- [ ] Download denied -> clear error message shown
- [ ] Click logout -> session destroyed, redirected to home
- [ ] Visit RAS page while logged in -> redirected away
- [ ] Let session expire -> timeout modal appears -> forced to re-login
- [ ] RAS auth failure (deny consent) -> error shown on callback page
- [ ] Missing `REACT_APP_RAS_AUTHORIZE_URL` -> button disabled or error shown

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/Auth/components/rasLoginSuccess.js` | CREATE |
| `src/components/App.js` | ADD route for `/rasloginsuccess` |
| `src/components/Layout/LayoutView.js` | ADD route for RAS login page |
| `src/pages/login/RAS.js` | ADD localStorage save before redirect, env guard |
| `conf/inject.template.js` | ADD `REACT_APP_RAS_AUTHORIZE_URL` |

## rasLoginSuccess Component (Reference Implementation)

```javascript
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { redirect, useAuth } from '../../Authentication';
import { LAST_VISITED_HASH_KEY } from '../../../bento/siteWideConfig';
import env from '../../../utils/env';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function getRedirectPath() {
  const redirectHash = localStorage.getItem(LAST_VISITED_HASH_KEY);
  return redirectHash ? `/${redirectHash}` : '/#/';
}

function rasLoginSuccess() {
  const history = useHistory();
  const query = useQuery();
  const { signIn } = useAuth();
  const redirectPath = getRedirectPath();
  const [notificationMessage, setNotificationMessage] = useState('Please wait while redirecting...');
  const AUTH_API = env.REACT_APP_AUTH_SERVICE_API;

  useEffect(() => {
    const error = query.get('error');
    const errorDescription = query.get('error_description');

    if (error) {
      setNotificationMessage(
        <div>
          {errorDescription || 'Authentication failed.'}
          <span>
            {' '}Please go back to{' '}
            <Link to="/#/">Home Page</Link>
            {' '}or{' '}
            <Link to="/#/user/login">Login Page</Link>
            {' '}to login again.
          </span>
        </div>
      );
      return;
    }

    (async () => {
      try {
        const response = await fetch(`${AUTH_API}authenticated`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          const userDetails = await response.json();
          signIn(userDetails);
          localStorage.setItem('userDetails', JSON.stringify(userDetails));
          redirect(history, redirectPath);
        } else {
          setNotificationMessage(
            <div>
              Session could not be established. Please try logging in again.
              <span>{' '}Go to <Link to="/#/user/login">Login Page</Link></span>
            </div>
          );
        }
      } catch (err) {
        setNotificationMessage(
          <div>
            An error occurred during authentication. Please try again.
            <span>{' '}Go to <Link to="/#/user/login">Login Page</Link></span>
          </div>
        );
      }
    })();
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Lato' }}>
      {notificationMessage}
    </div>
  );
}

export default rasLoginSuccess;
```
