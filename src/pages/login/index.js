import React from 'react';
import { LoginGenerator,AuthProviderGenerator } from '../../components/Authentication';
import { withStyles } from '@material-ui/core';
import { enabledAuthProviders } from '../../bento/siteWideConfig';
import { loginProvidersData } from '../../bento/loginData';
import AlertMessage from '../../bento-core/AlertMessage';
import Stats from '../../components/Stats/AllStatsController';
import env from '../../utils/env';

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
      AUTH_URL: env.REACT_APP_LOGIN_URL,
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
