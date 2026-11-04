import { combineReducers, createStore } from 'redux';
import { LocalFindReducerGenerator, updateAutocompleteData, updateUploadData } from '@bento-core/local-find';

const { localFind } = LocalFindReducerGenerator();
const createLocalFindStore = () => createStore(combineReducers({ localFind }));

describe('localFind reducer contract (autocomplete vs upload independence)', () => {
  it('updates autocomplete without touching upload', () => {
    const store = createLocalFindStore();
    store.dispatch(updateUploadData([{ subject_id: 'MSB-00140', program_id: 'CTDC' }]));

    store.dispatch(updateAutocompleteData([{ type: 'participantIds', title: 'MSB-01068' }]));

    expect(store.getState().localFind.autocomplete).toEqual([
      { type: 'participantIds', title: 'MSB-01068' },
    ]);
    expect(store.getState().localFind.upload).toEqual([
      { subject_id: 'MSB-00140', program_id: 'CTDC' },
    ]);
  });

  it('clears autocomplete without touching upload', () => {
    const store = createLocalFindStore();
    store.dispatch(updateUploadData([{ subject_id: 'MSB-00140', program_id: 'CTDC' }]));
    store.dispatch(updateAutocompleteData([{ type: 'participantIds', title: 'MSB-01068' }]));

    store.dispatch(updateAutocompleteData([]));

    expect(store.getState().localFind.autocomplete).toEqual([]);
    expect(store.getState().localFind.upload).toEqual([
      { subject_id: 'MSB-00140', program_id: 'CTDC' },
    ]);
  });
});


jest.mock('redux-logger', () => ({
  createLogger: () => () => (next) => (action) => next(action),
}));
jest.mock('../utils/graphqlClient', () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

describe('Local Find startup flag', () => {
  afterEach(() => {
    localStorage.removeItem('ctdcReduxState');
    jest.dontMock('../bento/siteWideConfig');
  });

  it.each([false, true])('restores saved state with ENABLE_LOCAL_FIND=%s', (enabled) => {
    const saved = {
      localFind: {
        upload: [{ subject_id: 'test-upload' }],
        autocomplete: [{ type: 'participantIds', title: 'test-autocomplete' }],
        uploadMetadata: { filename: 'participants.csv' },
      },
      statusReducer: { filterState: { sex: { Female: true } } },
      cartReducer: { filesId: ['test-file'], count: 1 },
    };
    localStorage.setItem('ctdcReduxState', JSON.stringify(saved));
    let initializedStore;
    jest.isolateModules(() => {
      jest.doMock('../bento/siteWideConfig', () => ({
        ...jest.requireActual('../bento/siteWideConfig'),
        ENABLE_LOCAL_FIND: enabled,
      }));
      initializedStore = require('./index').default;
    });

    const expectedLocalFind = enabled
      ? saved.localFind
      : { upload: [], autocomplete: [], uploadMetadata: {} };
    expect(initializedStore.getState()).toMatchObject({
      ...saved, localFind: expectedLocalFind,
    });
    expect(JSON.parse(localStorage.getItem('ctdcReduxState'))).toMatchObject({
      ...saved, localFind: expectedLocalFind,
    });
  });
});
