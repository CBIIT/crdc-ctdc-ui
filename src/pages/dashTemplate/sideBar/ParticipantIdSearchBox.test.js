import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import { LocalFindReducerGenerator } from '@bento-core/local-find';
import ConnectedParticipantIdSearchBox from './ParticipantIdSearchBox';

jest.mock('./BentoFilterUtils', () => ({
  getAllIds: jest.fn(() => Promise.resolve({
    participantIds: ['MSB-00140', 'MSB-00205', 'MSB-01068'],
  })),
}));

const mockClasses = {
  participantIdSearchContainer: 'participantIdSearchContainer',
  participantIdSearchLabel: 'participantIdSearchLabel',
  participantIdSearchInput: 'participantIdSearchInput',
};

const { localFind } = LocalFindReducerGenerator();
const createMockStore = () => createStore(combineReducers({ localFind }));

const renderConnected = (store) => render(
  <Provider store={store}>
    <ConnectedParticipantIdSearchBox classes={mockClasses} />
  </Provider>,
);

describe('ParticipantIdSearchBox', () => {
  it('renders without crashing', () => {
    renderConnected(createMockStore());
    expect(screen.getByLabelText('Find Participant by ID')).not.toBeNull();
  });

  it('shows matching options regardless of input case', async () => {
    const store = createMockStore();
    renderConnected(store);
    const input = screen.getByLabelText('Find Participant by ID');

    for (const term of ['msb', 'MSB', 'Msb']) {
      fireEvent.change(input, { target: { value: term } });
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => {
        expect(screen.getByText('MSB-01068')).not.toBeNull();
      });
    }
  });

  it('dispatches a single-entry array when a suggestion is selected', async () => {
    const store = createMockStore();
    renderConnected(store);
    const input = screen.getByLabelText('Find Participant by ID');

    fireEvent.change(input, { target: { value: 'MSB-01068' } });
    const option = await screen.findByText('MSB-01068');
    fireEvent.click(option);

    expect(store.getState().localFind.autocomplete).toEqual([
      { type: 'participantIds', title: 'MSB-01068' },
    ]);
  });

  it('shows "No matching Participants" when there is no match', async () => {
    const store = createMockStore();
    renderConnected(store);
    const input = screen.getByLabelText('Find Participant by ID');

    fireEvent.change(input, { target: { value: 'no-such-id' } });
    await waitFor(() => {
      expect(screen.getByText('No matching Participants')).not.toBeNull();
    });
  });

  it('reflects the currently selected participant from state', () => {
    const store = createStore(combineReducers({ localFind }), {
      localFind: {
        upload: [],
        autocomplete: [{ type: 'participantIds', title: 'MSB-00140' }],
        uploadMetadata: {},
      },
    });
    renderConnected(store);
    expect(screen.getByDisplayValue('MSB-00140')).not.toBeNull();
  });
});
