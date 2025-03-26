// TODO: Need to have some rules for trailing "/". Will introduce it soon.

window.injectedEnv = {

  REACT_APP_APPLICATION_VERSION: 'YYYY_MM_DD/HH:MM',

  // Services API End Points:
  REACT_APP_BACKEND_API: 'https://clinical-dev.datacommons.cancer.gov/v1/graphql/',
  REACT_APP_BACKEND_PUBLIC_API: 'https://4250bc0d-7018-4a95-bffb-d4dceb96fb4d.mock.pstmn.io/v1/graphql',
  REACT_APP_FILE_SERVICE_API: 'https://clinical-dev.datacommons.cancer.gov/api/files/',
  REACT_APP_AUTH_SERVICE_API: 'https://clinical-dev.datacommons.cancer.gov/api/auth/',
  REACT_APP_INTEROP_SERVICE_URL: 'https://clinical-dev.datacommons.cancer.gov/api/interoperation/',

  REACT_APP_FRONTEND_VERSION: '1.0.0',
  REACT_APP_BACKEND_VERSION: '2.0.0',
  REACT_APP_AUTH_SERVICE_VERSION: '3.0.0',
  REACT_APP_FILE_SERVICE_VERSION: '4.0.0',
  REACT_APP_INTEROP_SERVICE_VERSION: '5.0.0',

  REACT_APP_USER_SERVICE_API: 'http://localhost:3000/api/users/',
  REACT_APP_LOGIN_URL: 'https://nci-crdc-staging.datacommons.io/user/oauth2/authorize?client_id=HADoUzN9BWzbzwxdu0soRvRHSnegiWaoShVhB09O&response_type=code&redirect_uri=http://localhost:3000/login&scope=openid%20user',

  // About Content API:
  REACT_APP_ABOUT_CONTENT_URL: 'https://raw.githubusercontent.com/CBIIT/bento-ctdc-static-content/develop/aboutPagesContent.yaml',

  REACT_APP_FILE_CENTRIC_CART_README: 'https://raw.githubusercontent.com/CBIIT/ctdc-readMe-content/refs/heads/dev/My_Files_Cart_Page_README.md',


  // IDP Auth url
  REACT_APP_NIH_AUTH_URL: 'https://stsstg.nih.gov/auth/oauth/v2/authorize',
  // Client IDs for IDP
  REACT_APP_GOOGLE_CLIENT_ID: 'Sample Id',
  REACT_APP_NIH_CLIENT_ID: 'Sample Id',

  // Access control settings
  REACT_APP_AUTH: true,
  PUBLIC_ACCESS: 'Metadata Only',
  NODE_LEVEL_ACCESS: false,
  NODE_LABEL: 'Study Arm(s)',

  // No Longer Used.
  REACT_APP_BACKEND_GETUSERINFO_API: 'https://k9dc.essential-dev.com/fence/login/',
  REACT_APP_USER_LOGOUT_URL: 'https://k9dc.essential-dev.com/fence/logout',

  REACT_APP_DMN_URL: 'https://cbiit.github.io/crdc-data-model-navigator/?config=https://raw.githubusercontent.com/CBIIT/ctdc-data-model-navigator-landing/refs/heads/main/example/CTDC/1.0.0/'
};
