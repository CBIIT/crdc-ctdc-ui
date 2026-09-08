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
