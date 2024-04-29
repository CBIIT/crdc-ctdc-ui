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
    headerMessage: "Log in with eRA Commons to begin accessing CTDC data",
    enabledAuthProviders,
    styles: {
      Container: {
        fontFamily: 'Lato',
      },
      InnerBox: {
        width: '468px',
        marginTop: '52px',
        marginBottom: '34px',
      },
      Box: {
        marginLeft: '16px',
        marginRight: '16px',
        height: '348px',
        maxWidth: '598px',
        backgroundColor:'#F0F8FA',
        border: '3px #08A383 solid',
        borderRadius: '35px',
        boxShadow: '0px 2px 10px 0px #00000040',
      },
      LoginBoxTitle: {
        marginTop: '0px',
        marginBottom: '0px',
        padding: '0px',
        width: '100%',

        fontFamily: 'Lato',
        fontWeight: 800,
        fontSize: '18px',
        lineHeight: '23px',
        color: '#415571',
      },
      LoginBoxInstruction: {
        margin: '27px 0px 0px 0px',
        paddingLeft: '46px',

        width: '100%',
        fontFamily: 'Lato',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '21px',
        letterSpacing: '0.2px',
        color: '#000000',
      },
      LoginButtonGroup: {
        marginTop: '0px',
      },
      LoginButton: {
        fontFamily: 'Roboto',
        fontSize: '16px',
        overflow: 'hidden',
        paddingLeft: '32px',
        borderRadius: '10px',
        fontWeight: 500,
        color: '#000000',
        width: '256px',
        height: '48px',
        border: '1.25px #0A6D59 solid',
      },
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
