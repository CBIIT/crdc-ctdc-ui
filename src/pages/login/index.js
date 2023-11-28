import React from 'react';
import { LoginGenerator,AuthProviderGenerator } from '@bento-core/authentication';
import { withStyles } from '@material-ui/core';
import { enabledAuthProviders } from '../../bento/siteWideConfig';
import { loginProvidersData } from '../../bento/loginData';
import AlertMessage from '../../bento-core/AlertMessage';
import Stats from '../../components/Stats/AllStatsController';


function loginController(props) {
  const { classes } = props;
  const componentProp = { 
    enabledAuthProviders,
    authenticationProviders: loginProvidersData,
    AlertMessage,
    };

  const customConfig = {
    config: {
      GOOGLE_CLIENT_ID: '',
      NIH_CLIENT_ID: '9daCtorxUg7aJPKFPd2cD4QvWw3AH61lWaKXZqXM',
      NIH_AUTH_URL: 'https://nci-crdc-staging.datacommons.io/user/oauth2/authorize',
    }
  }
  const { Login } = LoginGenerator();
  const {AuthProvider} = AuthProviderGenerator(customConfig);

  return (
    <div className={classes.Container}>
      <Stats />
      <AuthProvider>
       <Login {...componentProp} />
       </AuthProvider>
    </div>
  );
}

const styles = () => ({
  Container: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'Nunito',
  },
});

export default withStyles(styles, { withTheme: true })(loginController);
