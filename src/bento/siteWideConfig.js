import env from '../utils/env';
import { getEnvBoolean } from '../utils/env';

export default {
  // Suggested for replaceEmptyValueWith: 'N/A' or '-' or ''
  replaceEmptyValueWith: '',
  // List for options for authentication empty array defaults to google
  authProviders: ['google', 'nih', 'loginGov'], // authEndPoint: []//
};



export const loginPath = '/user/login';
export const requestAccessPath = '/request';
export const adminPortalPath = '/admin';
export const userProfilePath = '/profile';

// Authentication: Enabled (True) or Disabled (False)
export const enableAuthentication = getEnvBoolean(env.REACT_APP_AUTH, true);

// List of enabled identity providers. This is an array of enabled identity providers,
// where each element corresponds to a key from loginProvidersData.
export const enabledAuthProviders = ['google', 'nih', 'loginGov'];

// Public Level Access
export const PUBLIC_ACCESS = env.PUBLIC_ACCESS || 'Metadata Only';

// Node level access
export const NODE_LEVEL_ACCESS = '';
export const NODE_LABEL = '';

// Redirect configs.
export const REDIRECT_AFTER_SIGN_OUT = '/';

// Inactivity Configs (Numbers are in "Seconds" for this section)
export const PING_INTERVAL = 10; // DEFAULT is 5 Seconds.

// SHOW_WARNING_BEFORE is used to configure when to show Inactivity pop-up.
// Value is required to be in Seconds format. DEFAULT is 300 Seconds (5 Minutes).
export const SHOW_WARNING_BEFORE = 300;

// DEFAULT_VALUE serves as a fallback when facet or widget items are empty
export const DEFAULT_VALUE = "No value";

// Must match the backend/index encoding of therapy_string combinations.
// Example: selecting A and B can send "A|B" with '|', or "A~B" with '~'.
// Change this value only with a coordinated backend/index update and frontend rebuild.
// It does not change displayed names, Type/Category values, or stored individual selections.
export const THERAPY_COMBINATION_SEPARATOR = '|';

// Constant for last visited hash key in localStorage
export const LAST_VISITED_HASH_KEY = "lastVisitedHash";

// Maximum file size in bytes for Blob downloads (50 MiB; displayed as 50 MB in tables).
export const MAX_BLOB_SIZE = 50 * 1024 * 1024;
