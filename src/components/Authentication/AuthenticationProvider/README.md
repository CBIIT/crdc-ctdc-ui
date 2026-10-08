# AuthProviderGenerator Login And Logout

`AuthProviderGenerator.js` owns the frontend authentication context exposed by
`useAuth()`. It wires Auth service calls, Redux sign-in/sign-out actions, and
local browser storage. It does not render the `/user/login` page content; that
page only starts the RAS authorize redirect.

## Files

| File | Purpose |
| --- | --- |
| `AuthProviderGenerator.js` | Creates the Auth context and exposes login/logout functions. |
| `config.js` | Default AuthProvider config used when no app config is provided. |
| `AuthProviderGenerator.test.js` | Focused tests for Auth service login, RAS logout URL validation, and RAS logout redirect behavior. |
| `src/components/Auth/authProviderConfig.js` | CTDC runtime config that maps `window.injectedEnv` values into AuthProvider config. |

## Runtime Config

CTDC passes runtime values into the provider from
`src/components/Auth/authProviderConfig.js`.

| Config key | Runtime source | Used for |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | `REACT_APP_GOOGLE_CLIENT_ID` | Enables Google login when a real client ID is configured. |
| `NIH_CLIENT_ID` | `REACT_APP_NIH_CLIENT_ID` | eRA/NIH authorize client ID. |
| `NIH_AUTH_URL` | `REACT_APP_NIH_AUTH_URL` | eRA/NIH authorize endpoint. |
| `AUTH_API` | `REACT_APP_AUTH_SERVICE_API` | Auth service base URL for `login` and `logout`. |
| `RAS_BROWSER_LOGOUT_URL` | `REACT_APP_RAS_BROWSER_LOGOUT_URL` | RAS browser logout URL used after CTDC logout completes. |

`REACT_APP_RAS_BROWSER_LOGOUT_URL` must be supplied by the deployment
environment and is written into `injectEnv.js` from `conf/inject.template.js`.
The `target` value must be whitelisted by RAS. Dev, QA, and production should
each use the environment-specific RAS logout URL and CTDC return target approved
for that tier.

## Exposed Auth Context

Components call `useAuth()` to access:

| Function | Behavior |
| --- | --- |
| `authServiceLogin(code, IDP, redirectUri, onSuccess, onError)` | Sends an authorization code to the Auth service and updates frontend sign-in state on success. |
| `signInWithGoogle(onSuccess, onError)` | Uses `react-use-googlelogin` to get a Google code, then calls `authServiceLogin`. |
| `signInWithNIH(state)` | Builds the NIH authorize URL and redirects the browser to it. |
| `signInWithAuthURL(state)` | Redirects the browser to the configured `AUTH_URL`, if provided. |
| `signOut(history, redirectPath, IDP)` | Calls Auth service logout, clears frontend auth state, and handles optional RAS logout redirect. |

CTDC currently uses RAS as the active IDP. Missing frontend IDP values default
to `ras`, and stale legacy stored IDP values are treated as `ras` for logout
and session flows.

## Auth Service Login

`authServiceLogin` is the shared code-exchange path used after an external
identity provider returns an authorization code.

Request:

```text
POST <AUTH_API>login
body: { code, IDP, redirectUri }
```

On HTTP `200`, the provider:

1. Normalizes the returned user details by preserving `IDP`.
2. Dispatches Redux `signInRed(userDetails)`.
3. Stores `userDetails` in local storage.
4. Calls the supplied success callback.

On HTTP `400` or `403`, the provider calls the error callback with
`Error fetching user data.` Other non-200 responses call the error callback with
`Internal Error`. Network failures or invalid JSON also call
`Error fetching user data.`

The Auth service creates the CTDC server session and sets the session cookie.
The frontend does not create that cookie; the browser stores it from the Auth
service response and sends it automatically on later same-origin Auth requests.

## RAS Login Callback

The RAS authorize redirect is started outside this provider by the `/user/login`
page. After RAS authenticates the user, the browser returns to:

```text
/api/auth/callback?code=<authorization_code>
```

`src/components/App.js` routes `/api/auth/callback` to `NihLoginSuccess` with
`idp="ras"`. `nihLoginSuccess.js` reads the `code` query parameter and calls:

```text
authServiceLogin(code, "ras", "<origin>/api/auth/callback", onSuccess, onError)
```

On success, the callback page redirects the user back to the last visited hash
route or home.

Deployment must route `/api/auth/callback` to the frontend before the generic
Auth service `/api/auth/*` rule. Other Auth endpoints, such as
`/api/auth/login`, `/api/auth/logout`, `/api/auth/session-ttl`, and
`/api/auth/authenticated`, should continue routing to the Auth service.

## Logout

`signOut(history, redirectPath, IDP)` performs logout in this order:

1. Calls the CTDC Auth service:

   ```text
   POST <AUTH_API>logout
   body: { IDP }
   ```

2. Removes `userDetails` from local storage.
3. Dispatches Redux sign-out state.
4. If `IDP` is not `ras`, redirects locally to `redirectPath`.
5. If `IDP` is `ras` and `RAS_BROWSER_LOGOUT_URL` is a usable absolute URL, stores
   `showLogoutSuccess=true` in `sessionStorage` and navigates the browser to
   the RAS logout URL.

Browser navigation is required for RAS logout so RAS can clear the user's SSO
cookies. A frontend or backend background request is not enough for that browser
session.

`src/components/Layout/LayoutView.js` owns the return message. When CTDC loads
after RAS returns to the `target` URL, it checks `showLogoutSuccess`, removes the
flag, and shows `You have been logged out.`

If `RAS_BROWSER_LOGOUT_URL` is missing, unresolved, relative, or invalid, RAS
logout falls back to local CTDC redirect after Auth service logout. In that
case, the CTDC session is cleared, but the external RAS SSO session may still be
reusable by the browser.

`signOut` returns `{ logoutCompleted, externalLogoutStarted }` so callers can
show the local logout success message when RAS browser navigation was not
started. The values mean:

- `logoutCompleted`
  - `true` means CTDC Auth logout completed and frontend auth state was cleared.
  - `false` means logout did not complete, usually because the Auth service
    logout request failed.
- `externalLogoutStarted`
  - `true` means the browser was redirected to the RAS logout URL.
  - `false` means the browser stayed in CTDC and used the local fallback
    redirect.

If `signOut` is called without a `history` object, it still clears auth state but
skips the local React redirect.

## RAS Logout URL Validation

`getRasLogoutRedirectUrl` only accepts configured absolute `http://` or
`https://` URLs. Empty values, unresolved placeholders such as
`${REACT_APP_RAS_BROWSER_LOGOUT_URL}`, and relative paths return an empty
string.
