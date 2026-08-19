import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './Layout/LayoutContainer';
import NihLoginSuccess from './Auth/components/nihLoginSuccess';
import { CustomThemeProvider } from './ThemeContext';
import { AuthProviderGenerator } from './Authentication';
import AUTHPROVIDER_CONFIG from './Auth/authProviderConfig';
import { GlobalProvider } from './Global/GlobalProvider';

// This is the place to check login ref to https://medium.com/@tomlarge/private-routes-with-react-router-dom-28e9f40c7146 for sample code

const App = () => {
  
  const {AuthProvider} = AuthProviderGenerator(AUTHPROVIDER_CONFIG);
  return (
  <CustomThemeProvider>
    <AuthProvider>
      {/* Reminder: Ajay need to replace the ICDC with env variable and
    change build npm to read env variable */}
      <GlobalProvider>
        <BrowserRouter>
          <Switch>
            <Route
              path="/api/auth/callback"
              render={(props) => {
                console.log('[RAS callback] Frontend route hit', {
                  pathname: props.location.pathname,
                  hasSearch: Boolean(props.location.search),
                });

                return <NihLoginSuccess {...props} idp="ras" callbackPath="/api/auth/callback" />;
              }}
            />
            <Route
              path="/login"
              render={(props) => {
                console.log('[eRA callback] Frontend route hit', {
                  pathname: props.location.pathname,
                  hasSearch: Boolean(props.location.search),
                });

                return <NihLoginSuccess {...props} idp="dcf" callbackPath="/login" />;
              }}
            />
            <Route path="/" component={Layout} />
          </Switch>
        </BrowserRouter>
      </GlobalProvider>
    </AuthProvider>

  </CustomThemeProvider>
)};

export default App;
