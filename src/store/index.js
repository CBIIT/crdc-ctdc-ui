import { createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { sideBarReducerGenerator } from '@bento-core/facet-filter';
import layout from '../components/Layout/LayoutState';
import stats from '../components/Stats/StatsState';
import { cartReducerGenerator } from '@bento-core/cart';
import { LocalFindReducerGenerator } from '@bento-core/local-find';
import { LoginReducerGenerator } from '@bento-core/authentication';
import { getFromLocalStorage } from '../utils/localStorage';
import { loadState, saveState } from './utils';

const { localFind } = LocalFindReducerGenerator();
const { statusReducer } = sideBarReducerGenerator();
const { cartReducer } = cartReducerGenerator();
const { login } = LoginReducerGenerator(getFromLocalStorage);

const reducers = {
  localFind,
  cartReducer,
  statusReducer,
  login,
  layout,
  stats,
};
const loggerMiddleware = createLogger();

// Load state from local storage
const persistedState = loadState();

const store = createStore(
  combineReducers(reducers),
  persistedState, // Initialize the store with persisted state
  composeWithDevTools(applyMiddleware(ReduxThunk, loggerMiddleware)),
);

// Save state to local storage whenever the state changes
store.subscribe(() => {
  saveState(store.getState());
});

store.injectReducer = (key, reducer) => {
  reducers[key] = reducer;
  store.replaceReducer(combineReducers(reducers));
};

export default store;
