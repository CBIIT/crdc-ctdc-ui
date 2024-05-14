import React from 'react';
import { withStyles, CssBaseline } from '@material-ui/core';
import { HashRouter, Route, Switch } from 'react-router-dom';
import aboutPageRoutes from '../../bento/aboutPagesRoutes';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToTop from '../ScrollButton/ScrollButtonView';
import Error from '../../pages/error/Error';
import Home from '../../pages/landing/landingController';
import About from '../../pages/about/aboutController';
// import Programs from '../../pages/programs/programsController';
// import ProgramDetail from '../../pages/programDetail/programDetailController';
import StudyDetail from '../../pages/studyDetail/studyDetailController';
import GraphqlClient from '../GraphqlClient/GraphqlView';
import GlobalSearchController from '../../pages/search/searchViewController';
import Login from '../../pages/login';
// import ProfileController from '../../pages/profile/profileController';
import OverlayWindow from '../OverlayWindow/OverlayWindow';
import AUTH_MIDDLEWARE_CONFIG from '../Auth/authMiddlewareConfig';
import CartView from '../../pages/cart/cartController';
import AuthSessionTimeoutController from '../SessionTimeout/SessionTimeoutController';
import { AuthenticationMiddlewareGenerator } from '@bento-core/authentication';
import UnderDev from '../../pages/error/Development';
import Notifactions from '../Notifications/NotifactionView';
import DashTemplate from '../../pages/dashTemplate/DashTemplateController';
import RAView from '../../pages/about/requestAccess'; 
import ActivitiesController from '../ActivitiesController'; 
import useVisitedPageSync from '../../utils/useVisitedPageSync';

const ScrollToTopComponent = () => {
  window.scrollTo(0, 0);
  return null;
};


const Layout = ({ classes, isSidebarOpened }) => {
  // Access control imports
  const { LoginRoute } = AuthenticationMiddlewareGenerator(AUTH_MIDDLEWARE_CONFIG);
  
  useVisitedPageSync();

  return (
  <>
    <CssBaseline />
    <HashRouter>
      <>
        <Notifactions />
        <AuthSessionTimeoutController />
        <Header />
        <OverlayWindow />
        {/* Reminder: Ajay need to replace the ICDC with env variable and
          change build npm to read env variable */}
        <div
          className={classes.content}
        >

          <Route component={ScrollToTopComponent} />
           <ActivitiesController >
          <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/study/:id" component={StudyDetail} />
              <Route path="/fileCentricCart" component={CartView} />
              <Route path="/explore" component={DashTemplate} />
              <Route exact path="/data-dictionary" component={UnderDev} />
              <Route exact path="/data-harmonization" component={About} />
              <Route exact path="/request-access" component={RAView} />
              <Route exact path="/crdc"  component={UnderDev} />
              <Route exact path="/search" component={GlobalSearchController} />
              <Route path="/search/:id"  component={GlobalSearchController} />
              <Route path="/graphql" component={GraphqlClient} />

           
              {/* END: Private Routes */}
              {aboutPageRoutes.map(
                (aboutPageRoute, index) => (
                  <Route
                    key={index}
                    path={aboutPageRoute}
                    component={About}
                  />
                ),
              )}
              <LoginRoute path="/user/login" component={Login} />
              <Route component={Error} />
          </Switch>
          </ActivitiesController>
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
