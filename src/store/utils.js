// Utility functions to load and save Redux state to local storage

const LOCAL_STORAGE_KEY = "ctdcReduxState";

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined; // If no state is found, let the reducers initialize the state
    }
    return JSON.parse(serializedState); // Parse and return the stored state
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
  