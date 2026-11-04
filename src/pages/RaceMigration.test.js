import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useApolloClient, useQuery } from '@apollo/client';
import { csv2json } from 'json-2-csv';
import { tabContainers, GET_PARTICIPANTS_OVERVIEW_QUERY, GET_BIOSPECIMENS_OVERVIEW_QUERY,
  GET_FILES_OVERVIEW_QUERY, DASHBOARD_QUERY_NEW } from '../bento/dashboardTabData';
import { configColumn } from './dashTemplate/tabs/tableConfig/Column';
import ParticipantDetailController from './participantDetail/participantDetailController';
import ParticipantCard from './search/Cards/participant/ParticipantCard';
import useDashData from './dashTemplate/useDashData';
import { convertToCSV } from './fileCentricCart/utils';
import { loadState, saveState } from '../store/utils';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'), useQuery: jest.fn(), useApolloClient: jest.fn(),
}));
jest.mock('../utils/graphqlClient', () => ({ client: { query: jest.fn(), mutate: jest.fn() } }));
jest.mock('../components/Breadcrumb/BreadcrumbView', () => () => null);
jest.mock('bento-components', () => ({ cn: require('classnames') }));
jest.mock('./participantDetail/participantDetailView', () => {
  const React = require('react');
  const HeaderPanel = require('./participantDetail/components/HeaderPanel').default;
  return ({ participant }) => <HeaderPanel classes={{}} participant={participant} />;
});

const participants = tabContainers.find(({ name }) => name === 'Participants');
const raceColumn = configColumn(participants.columns).find(({ dataField }) => dataField === 'race');
const empty = [];
const client = { query: jest.fn() };
const FacetProbe = ({ filterState }) => {
  const result = useDashData({ filterState, localFindUpload: empty, localFindAutocomplete: empty });
  return <output>{JSON.stringify(result)}</output>;
};

describe('Race array API compatibility (CTDC-2307)', () => {
  let container;
  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
    useApolloClient.mockReturnValue(client);
    localStorage.removeItem('ctdcReduxState');
  });
  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    localStorage.removeItem('ctdcReduxState');
  });
  const render = (element) => act(() => { ReactDOM.render(element, container); });
  const raceText = () => [...container.querySelectorAll('span, h6')]
    .find((element) => element.textContent === 'Race:').nextElementSibling.textContent;

  // Exercise the actual column configuration, controller-to-header path and search
  // card with synthetic API values. Do not normalize response arrays in the mocks.
  it.each([
    [['Asian', 'White'], 'Asian, White'],
    [['Black or African American'], 'Black or African American'],
    [[' Asian ', null, '', '   ', 'White'], 'Asian, White'],
    [[], ''], [null, ''], [undefined, ''],
    [['', '   ', null], ''], ['White', 'White'],
  ])('renders race %j consistently across Explore, Participant and search', (race, expected) => {
    if (Array.isArray(race)) Object.freeze(race);
    render(raceColumn.customCellRender({ ...raceColumn, race }));
    expect(container.textContent).toBe(expected);

    useQuery.mockImplementation((query) => {
      if (query === GET_PARTICIPANTS_OVERVIEW_QUERY) {
        return { data: { participantOverview: [{ participant_id: 'test-participant', race }] } };
      }
      if (query === GET_BIOSPECIMENS_OVERVIEW_QUERY) return { data: { biospecimenOverview: [] } };
      if (query === GET_FILES_OVERVIEW_QUERY) return { data: { fileOverview: [] } };
      throw new Error('Unexpected query');
    });
    render(<ParticipantDetailController match={{ params: { id: 'test-participant' } }} />);
    expect(raceText()).toBe(expected || 'N/A');

    render(<ParticipantCard index={0} data={{ participant_id: 'test-participant', race }} />);
    expect(raceText()).toBe(expected);
  });

  it.each(['race', 'additional_labels'])('keeps %s arrays in one escaped CSV cell and preserves adjacent columns', (field) => {
    const rows = [
      { id: 'multi', [field]: ['Asian', 'White'], ethnicity: 'Unknown' },
      { id: 'punctuation', [field]: ['Label, with comma', 'Label "quoted"', 'Line 1\nLine 2'], ethnicity: 'Other' },
      { id: 'empty', [field]: [], ethnicity: 'Unknown' },
      { id: 'null', [field]: null, ethnicity: 'Unknown' },
      { id: 'legacy', [field]: 'White', ethnicity: 'Unknown' },
      { id: 'numeric', [field]: [0, 42], ethnicity: 'Unknown' },
    ];
    const csv = convertToCSV(rows, '', ['id', field, 'ethnicity'], ['ID', 'Values', 'Ethnicity']);
    const parsed = csv2json(csv.replace(/\r\n$/, ''), {
      delimiter: { eol: '\r\n' }, parseValue: (value) => value,
    });
    expect(parsed).toEqual([
      { ID: 'multi', Values: 'Asian, White', Ethnicity: 'Unknown' },
      { ID: 'punctuation', Values: 'Label, with comma, Label "quoted", Line 1\nLine 2', Ethnicity: 'Other' },
      { ID: 'empty', Values: '', Ethnicity: 'Unknown' },
      { ID: 'null', Values: '', Ethnicity: 'Unknown' },
      { ID: 'legacy', Values: 'White', Ethnicity: 'Unknown' },
      { ID: 'numeric', Values: '0, 42', Ethnicity: 'Unknown' },
    ]);
    expect(rows[0][field]).toEqual(['Asian', 'White']);
  });

  it('restores race selections, passes them unchanged, and retains overlapping facet counts', async () => {
    const raceBuckets = [{ group: 'Asian', subjects: 2 }, { group: 'White', subjects: 2 }];
    const search = {
      numberOfParticipants: 3,
      participantCountByRace: raceBuckets,
      filterParticipantCountByRace: raceBuckets,
      participantCountBySingleTherapyCombination: [],
      filterParticipantCountBySingleTherapyCombination: [],
      filterParticipantCountBySingleTherapyCombinationForFacet: [],
    };
    client.query.mockResolvedValue({ data: { searchParticipants: search } });
    const saved = { statusReducer: { filterState: { race: { Asian: true, White: true }, sex: { Female: true } } } };
    saveState(saved);
    const restored = loadState();
    expect(restored).toEqual(saved);
    await act(async () => {
      ReactDOM.render(<FacetProbe filterState={restored.statusReducer.filterState} />, container);
    });
    expect(client.query).toHaveBeenCalledTimes(1);
    expect(client.query).toHaveBeenLastCalledWith(expect.objectContaining({
      query: DASHBOARD_QUERY_NEW,
      variables: expect.objectContaining({ race: ['Asian', 'White'], sex: ['Female'] }),
    }));
    const result = JSON.parse(container.textContent);
    expect(result.loading).toBe(false);
    expect(result.dashData).toMatchObject({
      numberOfParticipants: 3, participantCountByRace: raceBuckets, filterParticipantCountByRace: raceBuckets,
    });
    expect(result.activeFilters.race).toEqual(['Asian', 'White']);

    // Empty-string selection and clearing stay distinct from display formatting.
    await act(async () => {
      ReactDOM.render(<FacetProbe filterState={{ race: { '': true }, sex: { Female: true } }} />, container);
    });
    expect(client.query.mock.calls[client.query.mock.calls.length - 1][0].variables.race).toEqual(['']);
    await act(async () => {
      ReactDOM.render(<FacetProbe filterState={{ race: {}, sex: { Female: true } }} />, container);
    });
    expect(client.query.mock.calls[client.query.mock.calls.length - 1][0].variables.race).toEqual([]);
  });
});
