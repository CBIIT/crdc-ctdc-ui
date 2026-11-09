// Utility functions to load and save Redux state to local storage

const LOCAL_STORAGE_KEY = "ctdcReduxState";

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isSelection = (value) => isRecord(value)
  || (Array.isArray(value) && value.every((name) => typeof name === 'string'));

// Keep selected names in storage; pipe-combination terms are derived by the dashboard.
export const migrateTherapyFilters = (state) => {
  if (!isRecord(state)) return undefined;
  if (!Object.prototype.hasOwnProperty.call(state, 'statusReducer')) return state;
  if (!isRecord(state.statusReducer)) {
    const { statusReducer, ...rest } = state;
    return rest;
  }
  const { filterState } = state.statusReducer;
  if (!isRecord(filterState)) {
    return { ...state, statusReducer: { ...state.statusReducer, filterState: {} } };
  }
  if (!Object.prototype.hasOwnProperty.call(filterState, 'targeted_therapy_string')) return state;
  const { targeted_therapy_string: legacySelection, ...filters } = filterState;
  // An existing new selection (including an explicit clear) takes precedence.
  if (!isSelection(filters.therapy_string)) {
    delete filters.therapy_string;
    if (isSelection(legacySelection)) filters.therapy_string = legacySelection;
  }
  return { ...state, statusReducer: { ...state.statusReducer, filterState: filters } };
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined; // If no state is found, let the reducers initialize the state
    }
    return migrateTherapyFilters(JSON.parse(serializedState));
  } catch (err) {
    return undefined; // In case of error, return undefined to initialize state by reducers
  }
};
  
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState); // Store the serialized state
  } catch (err) {
    console.error("Could not save state to local storage: ", err);
  }
};
