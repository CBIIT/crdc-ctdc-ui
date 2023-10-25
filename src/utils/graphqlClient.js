import {
  ApolloClient, InMemoryCache, ApolloLink, HttpLink,
} from '@apollo/client';
import env from './env';

const defaultOptions = {
  query: {
    fetchPolicy: 'no-cache',
  },
};

const BACKEND = env.REACT_APP_BACKEND_API;
const PUBLIC_BACKEND = env.REACT_APP_BACKEND_PUBLIC_API;
const MOCK = 'https://4250bc0d-7018-4a95-bffb-d4dceb96fb4d.mock.pstmn.io/v1/graphql';
const CTDC_OLD_SERVICE =  "https://trialcommons-dev.cancer.gov/v1/graphql/";
const LOCAL_SERVICE =  "http://localhost:8080/v1/graphql/";
const AUTH_SERVICE = `${env.REACT_APP_AUTH_SERVICE_API}graphql`;
const USER_SERVICE = `${env.REACT_APP_USER_SERVICE_API}graphql`;

const backendService = new HttpLink({
  uri: BACKEND,
});


const CTDC_OLD_BackendService = new HttpLink({
  uri: MOCK , // ctdc old service
});

const authService = new HttpLink({
  uri: AUTH_SERVICE, // auth service
});

const userService = new HttpLink({
  uri: USER_SERVICE , // user service
});

const publicService = new HttpLink({
  uri: MOCK , // public backend
});

const mockService = new HttpLink({
  uri: MOCK,
});

const localService = new HttpLink({
  uri: LOCAL_SERVICE,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions,
  link: ApolloLink.split(
    (op) => op.getContext().clientName === 'publicService',
      publicService,
      ApolloLink.split(
        (operation) => operation.getContext().clientName === 'mockService',
        mockService,
        ApolloLink.split(
           (operation) => operation.getContext().clientName === 'localService',
          localService,
          ApolloLink.split(
            (operation) => operation.getContext().clientName === 'authService',
            authService, 
            ApolloLink.split( 
              (operation) => operation.getContext().clientName === 'userService',
              userService, 
               ApolloLink.split( 
              (operation) => operation.getContext().clientName === 'ctdcOldService',
                CTDC_OLD_BackendService,
                backendService,
              ),
            ), 
          ),
         ),
      ),
  ),
});

export default client;
