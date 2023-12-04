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
    headerMessage: "Log in with the following Identity Provider(s)",
    enabledAuthProviders,
    styles:{    
      Box: {
          height: '237px',
          minWidth: '496px',
          backgroundColor:'#F0F8FA',
          border: '3px #08A383 solid',
          borderRadius: '35px'
      },
      LoginBoxTitle:{
        marginTop: '0px'
      },
      LoginButtonGroup: {
       marginTop: '10px'
      },
      LoginButton:{
        overflow: 'hidden',
        paddingLeft: '32px',
        borderRadius: '15px',
        fontWeight: 'bold',
        color:'black',
        width: '256px',
        height: '48px',
        border: '1.25px #0A6D59 solid'

      }
    },
    authenticationProviders: loginProvidersData,
    AlertMessage,
    };

  const customConfig = {
    config: {
      GOOGLE_CLIENT_ID: 'x',
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
