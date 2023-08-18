import React from 'react';
import { withStyles, CssBaseline } from '@material-ui/core';
import { HashRouter, Route, Switch } from 'react-router-dom';
import aboutPageRoutes from '../../bento/aboutPagesRoutes';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToTop from '../ScrollButton/ScrollButtonView';
import Error from '../../pages/error/Error';
import UnderDev from '../../pages/error/development';
import Home from '../../pages/landing/landingController';
import About from '../../pages/about/aboutController';
import Programs from '../../pages/programs/programsController';
import ProgramDetail from '../../pages/programDetail/programDetailController';
import GraphqlClient from '../GraphqlClient/GraphqlView';
import GlobalSearchController from '../../pages/search/searchViewController';
import Login from '../../pages/login';
import ProfileController from '../../pages/profile/profileController';
import OverlayWindow from '../OverlayWindow/OverlayWindow';
import AUTH_MIDDLEWARE_CONFIG from '../Auth/authMiddlewareConfig';
import CarView from '../../pages/cart/cartController';
import AuthSessionTimeoutController from '../SessionTimeout/SessionTimeoutController';
import { AuthenticationMiddlewareGenerator } from '@bento-core/authentication';

import Notifactions from '../Notifications/NotifactionView';
import DashTemplate from '../../pages/dashTemplate/DashTemplateController';


const ScrollToTopComponent = () => {
  window.scrollTo(0, 0);
  return null;
};


const Layout = ({ classes, isSidebarOpened }) => {
  // Access control imports
  const { LoginRoute, MixedRoute, PrivateRoute, AdminRoute} = AuthenticationMiddlewareGenerator(AUTH_MIDDLEWARE_CONFIG);

  return (
  <>
    <CssBaseline />
    <HashRouter>
      <>
        <Notifactions />
        <AuthSessionTimeoutController />
        <Header />
        <OverlayWindow />
        <div
          className={classes.content}
        >
          <Route component={ScrollToTopComponent} />
          <Switch>
            <MixedRoute exact path="/" component={Home} />
            <MixedRoute exact path="/home" component={Home} />


            {/* SECTION: Member & Admin only Path */}
            <PrivateRoute path="/fileCentricCart" access={['admin', 'member']} component={UnderDev} />
            {/* bento 4.0 template */}
            <PrivateRoute path="/explore" access={['admin', 'member']} component={UnderDev} />
            {/* END SECTION */}

            {/* Psuedo Private routes where minor
            functionality can be accessed my unauthorized users */}
            <Route exact path="/search" access={['admin', 'member', 'non-member']} component={UnderDev} />
            <Route path="/search/:id" access={['admin', 'member', 'non-member']} component={UnderDev} />

            {/* END: Private Routes */}
            {aboutPageRoutes.map(
              (aboutPageRoute, index) => (
                <Route
                  key={index}
                  path={aboutPageRoute}
                  component={UnderDev}
                />
              ),
            )}
            <Route path="/graphql" component={UnderDev} />
            <LoginRoute path="/login" component={UnderDev} />
            <Route component={Error} />

          </Switch>
          <ScrollToTop />
          <Footer />
        </div>
      </>
    </HashRouter>
  </>
)};

const styles = (theme) => ({
  root: {
    display: 'flex',
    maxWidth: '100vw',
    overflowX: 'hidden',
  },
  content: {
    flexGrow: 1,
    // width: `calc(100vw - 240px)`,   // Ajay need to add this on addung side bar
    width: 'calc(100%)', // Remove this on adding sidebar
    background: theme.custom.bodyBackGround,
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.5em',
      height: '0.4em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px #ccc',
      borderRadius: '0px',
      backgroundColor: '#FFFFFF',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: '#97b0c0',
      outline: '1px solid slategrey',
      borderRadius: '0px',
    },
  },
});

export default withStyles(styles)(Layout);
