import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { useApolloClient, useQuery } from '@apollo/client';
import {
  clearAllFilters, clearFacetSection, getFilters,
  sideBarReducerGenerator, toggleCheckBox,
} from '@bento-core/facet-filter';
import { btnTypes, TableView, Wrapper } from '@bento-core/paginated-table';
import DashTemplateController from './DashTemplateController';
import { generateValidTherapyCombinations, updateTherapyFacetData } from './utils';
import BentoFacetFilter from './sideBar/BentoFacetFilter';
import TabsView from './tabs/TabsView';
import WidgetView from './widget/WidgetView';
import TabPanel from './tabs/TabPanel';
import { CustomCellView } from './tabs/tableConfig/Column';
import ParticipantDetailController from '../participantDetail/participantDetailController';
import ParticipantDetailView from '../participantDetail/participantDetailView';
import StatsView from '../../components/Stats/StatsView';
import ScopedStatsController from '../../components/Stats/ScopedStatsController';
import { facetsConfig } from '../../bento/dashTemplate';
import * as queries from '../../bento/dashboardTabData';
import { GET_GLOBAL_STATS_DATA_QUERY } from '../../bento/globalStatsData';
import { loadState, saveState, migrateTherapyFilters } from '../../store/utils';
import { convertToCSV } from '@bento-core/table/dist/util/downloadTable';

// Keep the controller, dashboard view, helpers, Redux reducer/actions, query
// documents, tab configuration and cell renderer real. Mock network/UI boundaries.
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useApolloClient: jest.fn(),
  useQuery: jest.fn(),
}));
jest.mock('../../utils/graphqlClient', () => ({
  client: { query: jest.fn(), mutate: jest.fn() },
}));
jest.mock('./sideBar/BentoFacetFilter', () => jest.fn(() => null));
jest.mock('./tabs/TabsView', () => jest.fn(() => null));
jest.mock('./widget/WidgetView', () => jest.fn(() => null));
jest.mock('./filterQueryBar/QueryBarView', () => jest.fn(() => null));
jest.mock('../../components/Stats/StatsView', () => jest.fn(() => null));
jest.mock('../participantDetail/participantDetailView', () => jest.fn(() => null));
jest.mock('../../components/DocumentDownload/DocumentDownloadView', () => () => null);
jest.mock('./tabs/Customize/TableView', () => ({ DisplayCustomText: () => null }));
jest.mock('@bento-core/paginated-table', () => ({
  ...jest.requireActual('@bento-core/paginated-table'),
  TableContextProvider: ({ children }) => children,
  TableView: jest.fn(() => null),
  Wrapper: jest.fn(({ children }) => children),
}));

/**
 * Migrated regression contract (adapted from the 44-case pre-migration baseline) (CTDC-2152 / CTDC-2211).
 *
 * A/B/C and all counts/IDs below are synthetic fixtures, not CTDC records.
 * Tests exercise frontend behavior; they do not emulate or validate server-side
 * filtering/indexing. Retains the cohort, hydration and propagation expectations.
 *
 * Deliberately do not require duplicate generated terms, stale-request behavior,
 * or the Study Files operation's unsupported therapy filter. Type/Category use
 * the user-approved backend any-value contract; only names expand combinations.
 */
const THERAPY_FILTER = 'therapy_string';
const COMBINATIONS = 'participantCountBySingleTherapyCombination';
const OPTION_COMBINATIONS = 'filterParticipantCountBySingleTherapyCombination';
const RAW_COMBINATIONS = 'participantCountBySingleTherapyCombinationForFacet';
const OPTION_VOCABULARY = 'filterParticipantCountBySingleTherapyCombinationForFacet';
const NAME_COUNTS = 'participantCountByTherapy';

const buckets = [
  { group: 'A', subjects: 2 },
  { group: 'A|B', subjects: 3 },
  { group: 'A|B|C', subjects: 1 },
  { group: 'B', subjects: 4 },
  { group: 'C', subjects: 5 },
];
const nameCounts = [
  { group: 'A', subjects: 6 },
  { group: 'B', subjects: 8 },
  { group: 'C', subjects: 6 },
];
const distinct = (values = []) => [...new Set(values)].sort();
const selectedNames = (names) => Object.fromEntries(names.map((name) => [name, true]));
const lastProps = (component) => component.mock.calls[component.mock.calls.length - 1][0];
const mockClient = { query: jest.fn() };
const containers = new Set();
const render = (element) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  containers.add(container);
  act(() => { ReactDOM.render(element, container); });
  return { container };
};
const dashboardRequests = () => mockClient.query.mock.calls
  .map(([request]) => request)
  .filter(({ query }) => query === queries.DASHBOARD_QUERY_NEW);

const response = () => ({
  data: {
    searchParticipants: {
      numberOfParticipants: 15,
      numberOfTherapies: 3,
      numberOfFiles: 12,
      numberOfStudyFiles: 3,
      participantCountByTherapyType: [{ group: 'Chemotherapy', subjects: 15 }],
      filterParticipantCountByTherapyType: [{ group: 'Chemotherapy', subjects: 15 }],
      participantCountByTherapyCategory: [{ group: 'Targeted', subjects: 15 }],
      filterParticipantCountByTherapyCategory: [
        { group: 'Targeted', subjects: 15 }, { group: 'Non-Targeted', subjects: 8 },
      ],
      [NAME_COUNTS]: nameCounts.map((bucket) => ({ ...bucket })),
      filterParticipantCountByTherapy: nameCounts.map((bucket) => ({ ...bucket })),
      [COMBINATIONS]: buckets.map((bucket) => ({ ...bucket })),
      [OPTION_COMBINATIONS]: buckets.map((bucket) => ({ ...bucket })),
      [RAW_COMBINATIONS]: buckets.map((bucket) => ({ ...bucket })),
      [OPTION_VOCABULARY]: buckets.map((bucket) => ({ ...bucket })),
    },
    filesTabCount: { numberOfFiles: 9 },
    studyFilesTabCount: { numberOfStudyFiles: 3 },
  },
});

const makeStore = (filterState = {}, restoredState) => {
  const { statusReducer } = sideBarReducerGenerator();
  return createStore(combineReducers({
    statusReducer,
    localFind: (state = { upload: [], autocomplete: [] }) => state,
    cartReducer: (state = {}) => state,
  }), restoredState || { statusReducer: { filterState } });
};

const mountDashboard = (store) => render(
  <Provider store={store}><DashTemplateController /></Provider>,
);

const waitForDashboard = async (callCount, expectedTerms) => {
  // All API promises are controlled by this file; act flushes their updates/effects.
  await act(async () => {});
  expect(dashboardRequests()).toHaveLength(callCount);
  expect(distinct(dashboardRequests()[callCount - 1].variables[THERAPY_FILTER]))
    .toEqual(expectedTerms);
  expect(distinct(lastProps(TabsView).activeFilters[THERAPY_FILTER]))
    .toEqual(expectedTerms);
};

beforeEach(() => {
  jest.clearAllMocks();
  mockClient.query.mockReset();
  useQuery.mockReset();
  useApolloClient.mockReturnValue(mockClient);
  localStorage.removeItem('ctdcReduxState');
});

afterEach(() => {
  containers.forEach((container) => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
  });
  containers.clear();
  localStorage.removeItem('ctdcReduxState');
});

describe('Therapy combination filtering baseline', () => {
  it.each([
    ['one selected name excludes combinations with additional names', ['A'], ['A']],
    ['two names admit either singleton and their complete combination', ['A', 'B'], ['A', 'A|B', 'B']],
    ['selection order does not change matching', ['B', 'A'], ['A', 'A|B', 'B']],
    ['does not invent a compound term absent from the vocabulary', ['A', 'C'], ['A', 'C']],
    ['three names admit only combinations present in the vocabulary', ['A', 'B', 'C'], ['A', 'A|B', 'A|B|C', 'B', 'C']],
    ['no selection produces no therapy constraint', [], []],
  ])('%s', (_description, selection, expected) => {
    const filters = getFilters({ [THERAPY_FILTER]: selectedNames(selection) });
    const terms = generateValidTherapyCombinations(filters, THERAPY_FILTER, buckets);
    // A terms filter is insensitive to duplicates; do not lock in that legacy quirk.
    expect(distinct(terms)).toEqual(expected);
  });

  it('retains a selected singleton even when it occurs only in a compound bucket', () => {
    const terms = generateValidTherapyCombinations(
      { [THERAPY_FILTER]: ['A'] }, THERAPY_FILTER, [{ group: 'A|B', subjects: 1 }],
    );
    expect(distinct(terms)).toEqual(['A']);
    expect(terms).not.toContain('A|B');
  });

  it('treats plus signs inside a therapy name as part of the name', () => {
    const terms = generateValidTherapyCombinations(
      { [THERAPY_FILTER]: ['A + B', 'C'] }, THERAPY_FILTER,
      [{ group: 'A + B|C', subjects: 1 }],
    );
    expect(distinct(terms)).toEqual(['A + B', 'A + B|C', 'C']);
  });

  it('distinguishes a selected empty string from an empty filter list', () => {
    expect(generateValidTherapyCombinations({ [THERAPY_FILTER]: [''] }, THERAPY_FILTER, buckets))
      .toEqual(['']);
    expect(generateValidTherapyCombinations({ [THERAPY_FILTER]: [] }, THERAPY_FILTER, buckets))
      .toEqual([]);
  });

  it('preserves the explicit empty-string option without expanding other therapies', () => {
    const terms = generateValidTherapyCombinations(
      { [THERAPY_FILTER]: ['', 'A'] }, THERAPY_FILTER, buckets,
    );
    expect(distinct(terms)).toEqual(['', 'A']);
  });
});

describe('Therapy facet reconstruction', () => {
  it('adds each combination count to its individual names without changing raw buckets', () => {
    const source = response().data.searchParticipants;
    const before = JSON.parse(JSON.stringify(source));
    const result = updateTherapyFacetData(source, OPTION_COMBINATIONS);
    expect(result[OPTION_COMBINATIONS]).toEqual(nameCounts);
    expect(source).toEqual(before);
    expect(source[OPTION_VOCABULARY]).toContainEqual({ group: 'A|B', subjects: 3 });
  });

  it('retains an empty-string bucket for the facet missing-value label', () => {
    const source = { [COMBINATIONS]: [{ group: '', subjects: 2 }, { group: 'A|B', subjects: 3 }] };
    expect(updateTherapyFacetData(source, COMBINATIONS)[COMBINATIONS]).toEqual([
      { group: '', subjects: 2 }, { group: 'A', subjects: 3 }, { group: 'B', subjects: 3 },
    ]);
    const facet = facetsConfig.find(({ datafield }) => datafield === THERAPY_FILTER);
    expect(facet.defaultValue).toBe('No value');
    expect(getFilters({ [THERAPY_FILTER]: { '': true } })[THERAPY_FILTER]).toEqual(['']);
  });

  it('handles a valid empty aggregation', () => {
    expect(updateTherapyFacetData({ [COMBINATIONS]: [] }, COMBINATIONS))
      .toEqual({ [COMBINATIONS]: [] });
  });
});

describe('Saved selections and dashboard initialization', () => {
  it.each([
    [[''], ['']],
    [['', 'A'], ['', 'A']],
    [['A'], ['A']],
    [['A', 'B'], ['A', 'A|B', 'B']],
  ])('loads saved %j before expanding the first dashboard request', async (selection, expected) => {
    const savedState = {
      statusReducer: {
        filterState: {
          targeted_therapy_string: selectedNames(selection),
          study_short_name: { 'test-study': true },
        },
      },
      localFind: {
        upload: [{ subject_id: 'test-participant-1' }],
        autocomplete: [{ title: 'test-participant-1' }, { title: 'test-participant-2' }],
      },
      cartReducer: { files: ['test-file'] },
    };
    saveState(savedState);
    const migratedState = loadState();
    const store = makeStore({}, migratedState);
    let finishInitialRequest;
    const initialRequest = new Promise((resolve) => { finishInitialRequest = resolve; });
    mockClient.query.mockImplementation(({ query }) => (
      query === queries.THERAPY_QUERY ? initialRequest : Promise.resolve(response())
    ));

    mountDashboard(store);
    expect(mockClient.query).toHaveBeenCalledTimes(1);
    expect(mockClient.query).toHaveBeenCalledWith({
      query: queries.THERAPY_QUERY,
      variables: {
        [THERAPY_FILTER]: selection,
        study_short_name: ['test-study'],
        participant_id: ['test-participant-1', 'test-participant-2'],
      },
    });
    expect(dashboardRequests()).toHaveLength(0);
    expect(TabsView).not.toHaveBeenCalled();

    await act(async () => { finishInitialRequest(response()); });
    await waitForDashboard(1, expected);
    expect(dashboardRequests()[0].variables).toMatchObject({
      study_short_name: ['test-study'],
      participant_id: ['test-participant-1', 'test-participant-2'],
      files_association: ['biospecimen', 'participant'],
      study_association: ['study'],
    });
    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(store.getState()).toEqual(migratedState);
    expect(store.getState().statusReducer.filterState.targeted_therapy_string).toBeUndefined();
    saveState(store.getState());
    expect(loadState()).toEqual(migratedState);
    expect(Object.keys(loadState().statusReducer.filterState[THERAPY_FILTER]))
      .not.toContain('A|B');
  });

  it('initializes with no saved state and passes reconstructed facets and server stats to the view', async () => {
    expect(loadState()).toBeUndefined();
    mockClient.query.mockResolvedValue(response());
    mountDashboard(makeStore());
    await waitForDashboard(1, []);

    const facet = facetsConfig.find(({ datafield }) => datafield === THERAPY_FILTER);
    const sidebar = lastProps(BentoFacetFilter);
    expect(sidebar.searchData[facet.apiForFiltering]).toEqual(nameCounts);
    expect(sidebar.searchData[facet.apiPath]).toEqual(nameCounts);
    expect(sidebar.searchData[OPTION_VOCABULARY]).toEqual(buckets);
    expect(sidebar.searchData[RAW_COMBINATIONS]).toEqual(buckets);
    expect(lastProps(WidgetView).data[NAME_COUNTS]).toEqual(nameCounts);
    expect(lastProps(StatsView).data).toMatchObject({
      numberOfTherapies: 3, numberOfParticipants: 15,
      numberOfFiles: 9, numberOfStudyFiles: 3,
    });
    expect(mockClient.query.mock.calls[0][0].query).toBe(queries.DASHBOARD_QUERY_NEW);
    expect(mockClient.query).toHaveBeenCalledTimes(1);
  });

  it('recovers from invalid persisted JSON with an unfiltered initial load', async () => {
    localStorage.setItem('ctdcReduxState', '{invalid');
    expect(loadState()).toBeUndefined();
    mockClient.query.mockResolvedValue(response());
    mountDashboard(makeStore({}, loadState()));
    await waitForDashboard(1, []);
  });
});

describe('Therapy vocabulary request scheduling', () => {
  it.each([
    ['study_short_name', 'test-study'],
    ['sex', 'Female'],
    ['therapy_type', 'Chemotherapy'],
    ['therapy_category', 'Targeted'],
    ['therapy_type', ''],
    ['therapy_category', ''],
  ])('loads %s=%j directly without selected names and reuses the dashboard vocabulary', async (field, value) => {
    mockClient.query.mockResolvedValue(response());
    const store = makeStore({ [THERAPY_FILTER]: {} });
    mountDashboard(store);
    expect(mockClient.query).toHaveBeenCalledTimes(1);
    expect(mockClient.query.mock.calls[0][0].query).toBe(queries.DASHBOARD_QUERY_NEW);
    await waitForDashboard(1, []);

    act(() => { store.dispatch(toggleCheckBox({ datafield: field, name: value, isChecked: true })); });
    expect(dashboardRequests()).toHaveLength(2);
    await waitForDashboard(2, []);
    expect(dashboardRequests()[1].variables[field]).toEqual([value]);
    expect(mockClient.query).toHaveBeenCalledTimes(2);

    act(() => { store.dispatch(toggleCheckBox({ datafield: THERAPY_FILTER, name: 'A', isChecked: true })); });
    await waitForDashboard(3, ['A']);
    act(() => { store.dispatch(toggleCheckBox({ datafield: THERAPY_FILTER, name: 'B', isChecked: true })); });
    await waitForDashboard(4, ['A', 'A|B', 'B']);
    expect(dashboardRequests()[3].variables[field]).toEqual([value]);
    expect(mockClient.query).toHaveBeenCalledTimes(4);
  });

  it('still waits for vocabulary when the selected name is an empty string', async () => {
    let finishVocabulary;
    mockClient.query.mockImplementation(({ query }) => (query === queries.THERAPY_QUERY
      ? new Promise((resolve) => { finishVocabulary = resolve; }) : Promise.resolve(response())));
    mountDashboard(makeStore({ [THERAPY_FILTER]: { '': true } }));
    expect(mockClient.query).toHaveBeenCalledTimes(1);
    expect(dashboardRequests()).toHaveLength(0);
    await act(async () => { finishVocabulary(response()); });
    await waitForDashboard(1, ['']);
    expect(mockClient.query).toHaveBeenCalledTimes(2);
  });

  it.each(['rejection', 'missing vocabulary'])('retries a direct dashboard after %s without a bootstrap', async (failure) => {
    const malformed = response();
    delete malformed.data.searchParticipants[OPTION_VOCABULARY];
    mockClient.query.mockImplementationOnce(() => (failure === 'rejection'
      ? Promise.reject(new Error('Network failure')) : Promise.resolve(malformed)))
      .mockResolvedValue(response());
    const { container } = mountDashboard(makeStore());
    await act(async () => {});
    expect(container.querySelector('[role="alert"]').textContent).toContain('Unable to load Explore results.');
    expect(TabsView).not.toHaveBeenCalled();
    await act(async () => { container.querySelector('button').click(); });
    await waitForDashboard(2, []);
    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('ignores both results and vocabulary from an older direct dashboard response', async () => {
    const pending = [];
    mockClient.query.mockImplementation(() => new Promise((resolve) => { pending.push(resolve); }));
    const store = makeStore();
    mountDashboard(store);
    act(() => { store.dispatch(toggleCheckBox({ datafield: 'sex', name: 'Female', isChecked: true })); });
    expect(dashboardRequests()).toHaveLength(2);
    const newest = response();
    newest.data.searchParticipants.numberOfParticipants = 99;
    newest.data.searchParticipants[OPTION_VOCABULARY] = [{ group: 'A|C', subjects: 1 }];
    await act(async () => { pending[1](newest); });
    await act(async () => { pending[0](response()); });
    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(lastProps(StatsView).data.numberOfParticipants).toBe(99);

    mockClient.query.mockResolvedValue(response());
    act(() => { store.dispatch(toggleCheckBox({ datafield: THERAPY_FILTER, name: 'A', isChecked: true })); });
    await waitForDashboard(3, ['A']);
    act(() => { store.dispatch(toggleCheckBox({ datafield: THERAPY_FILTER, name: 'B', isChecked: true })); });
    await waitForDashboard(4, ['A', 'B']);
    expect(mockClient.query).toHaveBeenCalledTimes(4);
  });

  it.each(['resolve', 'reject'])('loads directly after clearing names and ignores a late bootstrap %s', async (completion) => {
    let finishVocabulary;
    mockClient.query.mockImplementation(({ query }) => (query === queries.THERAPY_QUERY
      ? new Promise((resolve, reject) => { finishVocabulary = completion === 'resolve' ? resolve : reject; })
      : Promise.resolve(response())));
    const store = makeStore({ [THERAPY_FILTER]: { A: true, B: true } });
    const { container } = mountDashboard(store);
    expect(dashboardRequests()).toHaveLength(0);
    act(() => { store.dispatch(clearFacetSection({ datafield: THERAPY_FILTER })); });
    await waitForDashboard(1, []);
    await act(async () => { finishVocabulary(completion === 'resolve' ? response() : new Error('Late failure')); });
    await waitForDashboard(1, []);
    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });
});

describe('Selecting, deselecting and clearing therapy filters', () => {
  it('recomputes API combinations while keeping Redux selections as individual names', async () => {
    mockClient.query.mockResolvedValue(response());
    const store = makeStore({ study_short_name: { 'test-study': true } });
    mountDashboard(store);
    await waitForDashboard(1, []);

    act(() => { store.dispatch(toggleCheckBox({ datafield: THERAPY_FILTER, name: 'A', isChecked: true })); });
    await waitForDashboard(2, ['A']);
    act(() => { store.dispatch(toggleCheckBox({ datafield: THERAPY_FILTER, name: 'B', isChecked: true })); });
    await waitForDashboard(3, ['A', 'A|B', 'B']);
    expect(store.getState().statusReducer.filterState[THERAPY_FILTER]).toEqual({ A: true, B: true });

    act(() => { store.dispatch(toggleCheckBox({ datafield: THERAPY_FILTER, name: 'A', isChecked: false })); });
    await waitForDashboard(4, ['B']);
    expect(store.getState().statusReducer.filterState[THERAPY_FILTER]).toEqual({ B: true });

    act(() => { store.dispatch(clearFacetSection({ datafield: THERAPY_FILTER })); });
    await waitForDashboard(5, []);
    expect(dashboardRequests()[4].variables.study_short_name).toEqual(['test-study']);
    expect(mockClient.query.mock.calls.filter(([request]) => request.query === queries.THERAPY_QUERY))
      .toHaveLength(0);

    act(() => { store.dispatch(clearAllFilters()); });
    await waitForDashboard(6, []);
    expect(dashboardRequests()[5].variables.study_short_name).toBeUndefined();
    expect(store.getState().statusReducer.filterState).toEqual({});
    expect(mockClient.query.mock.calls.filter(([request]) => request.query === queries.THERAPY_QUERY))
      .toHaveLength(0); // With no names selected, the dashboard also supplies the new vocabulary.
  });
});

describe('Therapy filter propagation through GraphQL documents', () => {
  const cases = [
    ['initial vocabulary', queries.THERAPY_QUERY, ['searchParticipants']],
    ['dashboard and count aliases', queries.DASHBOARD_QUERY_NEW, ['searchParticipants', 'filesTabCount', 'studyFilesTabCount']],
    ['global/scoped stats and count aliases', GET_GLOBAL_STATS_DATA_QUERY, ['searchParticipants', 'filesTabCount', 'studyFilesTabCount']],
    ['participant table', queries.GET_PARTICIPANTS_OVERVIEW_QUERY, ['participantOverview']],
    ['biospecimen table', queries.GET_BIOSPECIMENS_OVERVIEW_QUERY, ['biospecimenOverview']],
    ['file table', queries.GET_FILES_OVERVIEW_QUERY, ['fileOverview']],
    ['selected participant files', queries.GET_FILE_IDS_FOR_SELECTED_PARTICIPANTS, ['participant_data_files']],
    ['selected biospecimen files', queries.GET_FILE_IDS_FOR_SELECTED_BIOSPECIMENS, ['biospecimen_data_files']],
    ['selected files', queries.GET_FILE_IDS_FOR_SELECTED_FILES, ['fileOverview']],
    ['all participant files', queries.GET_ALL_FILE_IDS_FOR_PARTICIPANTS, ['participant_data_files']],
    ['all biospecimen files', queries.GET_ALL_FILE_IDS_FOR_BIOSPECIMENS, ['biospecimen_data_files']],
    ['all files', queries.GET_ALL_FILE_IDS_FOR_FILES, ['fileOverview']],
  ];

  it.each(cases)('%s declares and forwards the combination list to every expected root', (_label, document, expectedRoots) => {
    const operation = document.definitions.find(({ kind }) => kind === 'OperationDefinition');
    const roots = operation.selectionSet.selections;
    expect(roots.map((field) => (field.alias || field.name).value)).toEqual(expectedRoots);
    [THERAPY_FILTER, 'therapy_type', 'therapy_category'].forEach((filterKey) => {
      const declaration = operation.variableDefinitions
        .find(({ variable }) => variable.name.value === filterKey);
      expect(declaration).toBeDefined();
      expect(declaration.type).toMatchObject({ kind: 'ListType', type: { name: { value: 'String' } } });
      roots.forEach((field) => {
        const argument = field.arguments.find(({ name }) => name.value === filterKey);
        expect(argument).toMatchObject({ value: { kind: 'Variable', name: { value: filterKey } } });
      });
    });
  });

  it('requests only the required self-excluding vocabulary during bootstrap', () => {
    const operation = queries.THERAPY_QUERY.definitions.find(({ kind }) => kind === 'OperationDefinition');
    const main = operation.selectionSet.selections.find(({ name }) => name.value === 'searchParticipants');
    expect(main.selectionSet.selections.map(({ name }) => name.value)).toEqual([OPTION_VOCABULARY]);
  });

  it('requests both display buckets and raw combination vocabulary in the dashboard', () => {
    const operation = queries.DASHBOARD_QUERY_NEW.definitions.find(({ kind }) => kind === 'OperationDefinition');
    const main = operation.selectionSet.selections.find(({ name }) => name.value === 'searchParticipants');
    const fields = main.selectionSet.selections.map(({ name }) => name.value);
    expect(fields).toEqual(expect.arrayContaining([
      COMBINATIONS, OPTION_COMBINATIONS, RAW_COMBINATIONS, OPTION_VOCABULARY, NAME_COUNTS,
      'participantCountByTherapyType', 'filterParticipantCountByTherapyType',
      'participantCountByTherapyCategory', 'filterParticipantCountByTherapyCategory',
    ]));
  });
});

describe('Table, file-action and scoped-stat boundaries', () => {
  it.each(['Participants', 'Biospecimens', 'Files'])('%s receives the same expanded filter for its table and file actions', async (tabName) => {
    mockClient.query.mockResolvedValue(response());
    mountDashboard(makeStore({ [THERAPY_FILTER]: { A: true, B: true } }));
    await waitForDashboard(1, ['A', 'A|B', 'B']);
    const { activeFilters, dashboardStats } = lastProps(TabsView);
    const config = queries.tabContainers.find(({ name }) => name === tabName);
    expect(config).toBeDefined();
    render(<TabPanel config={config} activeFilters={activeFilters} dashboardStats={dashboardStats} activeTab />);

    const tableProps = lastProps(TableView);
    const wrapperProps = lastProps(Wrapper);
    expect(tableProps.queryVariables).toEqual({ ...activeFilters, ...config.defaultFilters });
    expect(wrapperProps.activeFilters).toEqual(tableProps.queryVariables);
    expect(distinct(wrapperProps.activeFilters[THERAPY_FILTER])).toEqual(['A', 'A|B', 'B']);
    const tableState = tableProps.initState({});
    expect(tableState.query).toBe(config.api);
    expect(tableState.extendedViewConfig.download.downloadFileName).toBeTruthy();

    const buttons = wrapperProps.wrapConfig.flatMap(({ items }) => items);
    const selected = buttons.filter(({ role }) => role === btnTypes.ADD_SELECTED_FILES);
    const all = buttons.filter(({ role }) => role === btnTypes.ADD_ALL_FILES);
    expect(selected.length).toBeGreaterThan(0);
    expect(all.length).toBeGreaterThan(0);
    selected.forEach((button) => {
      expect(button.applyActiveFilter).toBe(true);
      expect(button.addFileQuery).toBe(config.addSelectedFilesQuery);
    });
    all.forEach((button) => expect(button.addFileQuery).toBe(config.addAllFileQuery));
  });

  it('forwards expanded filters unchanged to scoped stats with association defaults', () => {
    const variables = { [THERAPY_FILTER]: ['A', 'A|B', 'B'], therapy_type: ['Chemotherapy'], therapy_category: ['Targeted', 'Non-Targeted'], study_short_name: ['test-study'] };
    useQuery.mockReturnValue({ loading: false, data: response().data });
    render(<ScopedStatsController variables={variables} />);
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_STATS_DATA_QUERY, {
      variables: {
        ...variables,
        files_association: ['biospecimen', 'participant'],
        study_association: ['study'],
      },
    });
  });
});

describe('Therapy display formatting', () => {
  const participantTab = queries.tabContainers.find(({ name }) => name === 'Participants');
  const therapyColumn = participantTab.columns.find(({ dataField }) => dataField === 'therapy_name');

  it.each([
    [['A', 'B'], 'A, B'],
    [['A + B', 'C'], 'A + B, C'],
    [[], ''],
    [[''], ''],
    ['', ''],
    [['drug, regimen', 'B'], 'drug, regimen, B'],
    [[null, '', '   ', ' A '], 'A'],
    [null, ''],
    [undefined, ''],
  ])('renders table value %j as %j without changing the row value', (value, expected) => {
    expect(therapyColumn).toBeDefined();
    const row = { therapy_name: value };
    const { container } = render(<CustomCellView {...therapyColumn} {...row} />);
    expect(container.textContent).toBe(expected);
    expect(row.therapy_name).toBe(value);
  });

  it.each([
    [['Targeted'], 'Targeted'],
    [['Targeted', 'Non-Targeted'], 'Targeted, Non-Targeted'],
    [[], ''],
    [[''], ''],
    [null, ''],
  ])('renders the participant Category column %j as %j without changing its values', (value, expected) => {
    const categoryColumn = participantTab.columns.find(({ dataField }) => dataField === 'therapy_category');
    expect(categoryColumn).toBeDefined();
    const row = { therapy_category: value, therapy_name: ['different therapy field'] };
    const { container } = render(<CustomCellView {...categoryColumn} {...row} />);
    expect(container.textContent).toBe(expected);
    expect(row.therapy_category).toBe(value);
  });

  const renderParticipant = (therapy, bestResponse) => {
    useQuery.mockImplementation((query) => {
      if (query === queries.GET_PARTICIPANTS_OVERVIEW_QUERY) {
        return { loading: false, data: { participantOverview: [{
          therapy_string: 'unused combination field',
          therapy_name: therapy,
          therapy_type: [' Chemotherapy '],
          therapy_category: ['Targeted', 'Non-targeted'],
          current_response_to_therapy: ['Current response'],
          best_response_to_therapy: bestResponse,
        }] } };
      }
      if (query === queries.GET_BIOSPECIMENS_OVERVIEW_QUERY) {
        return { loading: false, data: { biospecimenOverview: [{ specimen_id: 'test-specimen' }] } };
      }
      if (query === queries.GET_FILES_OVERVIEW_QUERY) {
        return { loading: false, data: { fileOverview: [] } };
      }
      throw new Error('Unexpected participant detail query');
    });
    render(<ParticipantDetailController match={{ params: { id: 'test-participant' } }} />);
    return lastProps(ParticipantDetailView);
  };

  it('formats all five participant lists independently using the participant route', () => {
    const view = renderParticipant([' A ', ' B '], [' response one ', ' response two ']);
    expect(view.participant.therapy_name).toBe('A, B');
    expect(view.participant.therapy_type).toBe('Chemotherapy');
    expect(view.participant.therapy_category).toBe('Targeted, Non-targeted');
    expect(view.participant.current_response_to_therapy).toBe('Current response');
    expect(view.participant.best_response_to_therapy).toBe('response one, response two');
    expect(view.biospecimens[0].therapy_name).toBe('A, B');
    expect(useQuery.mock.calls).toHaveLength(3);
    useQuery.mock.calls.forEach(([, { variables }]) => {
      expect(variables.participant_id).toEqual(['test-participant']);
      expect(variables[THERAPY_FILTER]).toBeUndefined();
    });
    expect(mockClient.query).not.toHaveBeenCalled();
  });

  it.each([[null], [undefined], [[]], [['']], [''], [[null, '', '   ']]])('normalizes missing participant therapy value %j for the display fallback', (value) => {
    const view = renderParticipant(value, value);
    expect(view.participant.therapy_name).toBeNull();
    expect(view.participant.best_response_to_therapy).toBeNull();
    expect(view.biospecimens[0].therapy_name).toBeNull();
  });
});

// New migration and request-lifecycle coverage. All A/B values are synthetic.
describe('Persisted Therapy key migration', () => {
  it('preserves unrelated state, removes the legacy key, and is idempotent', () => {
    const before = {
      statusReducer: { filterState: { targeted_therapy_string: { B: true, A: true }, sex: { Female: true } }, extra: 1 },
      cartReducer: { files: ['file-1'] },
      localFind: { upload: [{ subject_id: 'participant-1' }] },
    };
    const result = migrateTherapyFilters(before);
    expect(result).toEqual({
      ...before,
      statusReducer: { ...before.statusReducer, filterState: { therapy_string: { B: true, A: true }, sex: { Female: true } } },
    });
    expect(before.statusReducer.filterState.targeted_therapy_string).toEqual({ B: true, A: true });
    expect(result.cartReducer).toBe(before.cartReducer);
    expect(result.localFind).toBe(before.localFind);
    expect(migrateTherapyFilters(result)).toEqual(result);
  });

  it.each([{ B: true }, {}, []])('keeps an existing new selection or explicit clear: %j', (selection) => {
    const result = migrateTherapyFilters({ statusReducer: { filterState: {
      targeted_therapy_string: { A: true }, therapy_string: selection,
    } } });
    expect(result.statusReducer.filterState).toEqual({ therapy_string: selection });
  });

  it('retains supported array selections without combining or reordering them', () => {
    const result = migrateTherapyFilters({ statusReducer: { filterState: { targeted_therapy_string: ['B', 'A'] } } });
    const names = result.statusReducer.filterState.therapy_string;
    const terms = generateValidTherapyCombinations({ therapy_string: Object.freeze(names) }, THERAPY_FILTER, buckets);
    expect(distinct(terms)).toEqual(['A', 'A|B', 'B']);
    expect(names).toEqual(['B', 'A']);
  });

  it.each([null, 'invalid', 42])('discards an invalid legacy selection: %j', (value) => {
    expect(migrateTherapyFilters({ statusReducer: { filterState: { targeted_therapy_string: value, sex: { Female: true } } } }))
      .toEqual({ statusReducer: { filterState: { sex: { Female: true } } } });
  });

  it('falls back to a valid legacy selection when the new key is malformed', () => {
    expect(migrateTherapyFilters({ statusReducer: { filterState: { targeted_therapy_string: { A: true }, therapy_string: null } } }))
      .toEqual({ statusReducer: { filterState: { therapy_string: { A: true } } } });
  });

  it.each([null, [], 42, 'invalid'])('ignores invalid stored root state: %j', (state) => {
    localStorage.setItem('ctdcReduxState', JSON.stringify(state));
    expect(loadState()).toBeUndefined();
  });

  it('recovers malformed filter containers while preserving cart state', () => {
    expect(migrateTherapyFilters({ statusReducer: null, cartReducer: { files: ['f'] } }))
      .toEqual({ cartReducer: { files: ['f'] } });
    expect(migrateTherapyFilters({ statusReducer: { filterState: null, extra: true } }))
      .toEqual({ statusReducer: { filterState: {}, extra: true } });
  });
});

describe('Therapy request lifecycle', () => {
  it('keeps the existing table mounted and on its completed cohort during refresh', async () => {
    TabsView.mockImplementation(() => <input aria-label="Table state" defaultValue="initial" />);
    try {
      mockClient.query.mockResolvedValue(response());
      const store = makeStore();
      const { container } = mountDashboard(store);
      await waitForDashboard(1, []);
      const input = container.querySelector('input[aria-label="Table state"]');
      input.value = 'preserved';
      let finish;
      mockClient.query.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
      act(() => { store.dispatch(toggleCheckBox({ datafield: THERAPY_FILTER, name: 'A', isChecked: true })); });
      expect(container.querySelector('input[aria-label="Table state"]')).toBe(input);
      expect(container.querySelector('[aria-label="Updating Explore results"]')).not.toBeNull();
      expect(lastProps(TabsView).activeFilters[THERAPY_FILTER]).toBeUndefined();
      await act(async () => { finish(response()); });
      expect(container.querySelector('input[aria-label="Table state"]')).toBe(input);
      expect(input.value).toBe('preserved');
      expect(container.querySelector('[aria-label="Updating Explore results"]')).toBeNull();
      await waitForDashboard(2, ['A']);
    } finally {
      TabsView.mockImplementation(() => null);
    }
  });

  it.each([
    ['bootstrap rejection', 'bootstrap', () => Promise.reject(new Error('Network failure'))],
    ['bootstrap missing vocabulary', 'bootstrap', () => Promise.resolve({ data: { searchParticipants: {} } })],
    ['dashboard rejection', 'dashboard', () => Promise.reject(new Error('Network failure'))],
    ['dashboard missing buckets', 'dashboard', () => Promise.resolve({ data: { searchParticipants: {} } })],
  ])('shows a retryable error after %s and recovers', async (_name, phase, failure) => {
    let failed = false;
    mockClient.query.mockImplementation(({ query }) => {
      const target = phase === 'bootstrap' ? queries.THERAPY_QUERY : queries.DASHBOARD_QUERY_NEW;
      if (query === target && !failed) { failed = true; return failure(); }
      return Promise.resolve(response());
    });
    const { container } = mountDashboard(makeStore({ [THERAPY_FILTER]: { A: true, B: true } }));
    await act(async () => {});
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
    await act(async () => { container.querySelector('button').click(); });
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(distinct(lastProps(TabsView).activeFilters[THERAPY_FILTER])).toEqual(['A', 'A|B', 'B']);
  });

  it('refreshes vocabulary before using a changed non-therapy filter', async () => {
    let finishRefresh;
    mockClient.query.mockResolvedValue(response());
    const store = makeStore({ [THERAPY_FILTER]: { A: true, B: true } });
    mountDashboard(store);
    await waitForDashboard(1, ['A', 'A|B', 'B']);
    mockClient.query.mockImplementation(({ query }) => (query === queries.THERAPY_QUERY
      ? new Promise((resolve) => { finishRefresh = resolve; }) : Promise.resolve(response())));
    act(() => { store.dispatch(toggleCheckBox({ datafield: 'sex', name: 'Female', isChecked: true })); });
    expect(dashboardRequests()).toHaveLength(1);
    const refreshed = response();
    refreshed.data.searchParticipants[OPTION_VOCABULARY] = [{ group: 'A', subjects: 1 }, { group: 'B', subjects: 1 }];
    await act(async () => { finishRefresh(refreshed); });
    await waitForDashboard(2, ['A', 'B']);
    expect(dashboardRequests()[1].variables.sex).toEqual(['Female']);
  });

  it('ignores an older bootstrap response after another filter changes', async () => {
    const pending = [];
    mockClient.query.mockImplementation(({ query }) => (query === queries.THERAPY_QUERY
      ? new Promise((resolve) => { pending.push(resolve); }) : Promise.resolve(response())));
    const store = makeStore({ [THERAPY_FILTER]: { A: true, B: true } });
    mountDashboard(store);
    act(() => { store.dispatch(toggleCheckBox({ datafield: 'sex', name: 'Female', isChecked: true })); });
    expect(pending).toHaveLength(2);
    const newest = response();
    newest.data.searchParticipants[OPTION_VOCABULARY] = [{ group: 'A', subjects: 1 }];
    await act(async () => { pending[1](newest); });
    await waitForDashboard(1, ['A', 'B']);
    await act(async () => { pending[0](response()); });
    await waitForDashboard(1, ['A', 'B']);
  });

  it('does not overwrite newer dashboard results with an older response', async () => {
    mockClient.query.mockResolvedValue(response());
    const store = makeStore();
    mountDashboard(store);
    await waitForDashboard(1, []);
    const pending = [];
    mockClient.query.mockImplementation(() => new Promise((resolve) => { pending.push(resolve); }));
    act(() => { store.dispatch(toggleCheckBox({ datafield: THERAPY_FILTER, name: 'A', isChecked: true })); });
    act(() => { store.dispatch(toggleCheckBox({ datafield: THERAPY_FILTER, name: 'B', isChecked: true })); });
    const newest = response();
    newest.data.searchParticipants.numberOfParticipants = 99;
    await act(async () => { pending[1](newest); });
    await act(async () => { pending[0](response()); });
    expect(lastProps(StatsView).data.numberOfParticipants).toBe(99);
    expect(distinct(lastProps(TabsView).activeFilters[THERAPY_FILTER])).toEqual(['A', 'A|B', 'B']);
  });
});

describe('Explore Therapy CSV compatibility', () => {
  it('exports the name array under Therapy and keeps embedded commas in a quoted cell', () => {
    const column = queries.tabContainers.find(({ name }) => name === 'Participants').columns
      .find(({ dataField }) => dataField === 'therapy_name');
    const rows = [{ therapy_name: ['drug, regimen', 'B'], therapy_string: 'unused|combination' }, { therapy_name: [] }];
    const csv = convertToCSV(rows, [column.dataField], [column.header]);
    expect(csv).toBe('Therapy\r\n"drug, regimen,B"\r\n""\r\n');
    expect(rows[0].therapy_name).toEqual(['drug, regimen', 'B']);
  });
});


// C4: Type/Category are ordinary backend terms, distinct from name combinations.
// Populated Type fixtures below are synthetic because local source Type data is blank.
describe('Therapy Type and Category facets', () => {
  it.each([
    ['Therapy Type', 'therapy_type', 'TherapyType'],
    ['Therapy Category', 'therapy_category', 'TherapyCategory'],
  ])('%s uses its own current and self-excluding server buckets', (label, datafield, suffix) => {
    expect(facetsConfig.find((facet) => facet.datafield === datafield)).toMatchObject({
      label,
      apiPath: `participantCountBy${suffix}`,
      apiForFiltering: `filterParticipantCountBy${suffix}`,
      show: true,
      defaultValue: 'No value',
    });
  });

  it.each([
    [[], ['Targeted']],
    [['Chemotherapy', 'Immunotherapy'], ['Targeted', 'Non-Targeted']],
    [[''], ['']],
  ])('restores Type %j and Category %j before expanding saved names', async (types, categories) => {
    saveState({ statusReducer: { filterState: {
      targeted_therapy_string: { A: true, B: true },
      therapy_type: selectedNames(types),
      therapy_category: selectedNames(categories),
    } } });
    const store = makeStore({}, loadState());
    mockClient.query.mockResolvedValue(response());
    mountDashboard(store);
    await waitForDashboard(1, ['A', 'A|B', 'B']);
    const expected = { therapy_type: types, therapy_category: categories };
    expect(mockClient.query.mock.calls[0][0]).toMatchObject({
      query: queries.THERAPY_QUERY, variables: { ...expected, therapy_string: ['A', 'B'] },
    });
    expect(dashboardRequests()[0].variables).toMatchObject(expected);
    expect(lastProps(TabsView).activeFilters).toMatchObject(expected);
    saveState(store.getState());
    expect(loadState().statusReducer.filterState).toMatchObject({
      therapy_type: selectedNames(types), therapy_category: selectedNames(categories),
    });
  });

  it('uses server options without combining Type/Category values or inventing relationships', async () => {
    const data = response();
    mockClient.query.mockResolvedValue(data);
    mountDashboard(makeStore({ therapy_string: { A: true } }));
    await waitForDashboard(1, ['A']);
    const sidebar = lastProps(BentoFacetFilter).searchData;
    expect(sidebar.filterParticipantCountByTherapyType).toEqual([{ group: 'Chemotherapy', subjects: 15 }]);
    expect(sidebar.filterParticipantCountByTherapyType.some(({ group }) => group === 'Immunotherapy')).toBe(false);
    expect(sidebar.filterParticipantCountByTherapyCategory)
      .toEqual(data.data.searchParticipants.filterParticipantCountByTherapyCategory);
  });

  it('accepts valid empty Type buckets without creating a synthetic No value option', async () => {
    const data = response();
    data.data.searchParticipants.participantCountByTherapyType = [];
    data.data.searchParticipants.filterParticipantCountByTherapyType = [];
    mockClient.query.mockResolvedValue(data);
    mountDashboard(makeStore());
    await waitForDashboard(1, []);
    expect(lastProps(BentoFacetFilter).searchData.filterParticipantCountByTherapyType).toEqual([]);
  });

  it.each([
    ['therapy_type', ['Chemotherapy', 'Immunotherapy']],
    ['therapy_category', ['Targeted', 'Non-Targeted']],
  ])('refreshes name vocabulary before applying a changed %s filter', async (field, values) => {
    mockClient.query.mockResolvedValue(response());
    const store = makeStore({ therapy_string: { A: true, B: true }, [field]: selectedNames(values) });
    mountDashboard(store);
    await waitForDashboard(1, ['A', 'A|B', 'B']);
    let finishVocabulary;
    const pending = new Promise((resolve) => { finishVocabulary = resolve; });
    mockClient.query.mockImplementation(({ query }) => (
      query === queries.THERAPY_QUERY ? pending : Promise.resolve(response())
    ));
    act(() => { store.dispatch(toggleCheckBox({ datafield: field, name: values[1], isChecked: false })); });
    expect(mockClient.query.mock.calls[2][0]).toMatchObject({
      query: queries.THERAPY_QUERY, variables: { [field]: [values[0]] },
    });
    expect(dashboardRequests()).toHaveLength(1);
    expect(lastProps(TabsView).activeFilters[field]).toEqual(values);
    const updated = response();
    updated.data.searchParticipants[OPTION_VOCABULARY] = buckets.filter(({ group }) => !group.includes('|'));
    await act(async () => { finishVocabulary(updated); });
    await waitForDashboard(2, ['A', 'B']);
    expect(dashboardRequests()[1].variables[field]).toEqual([values[0]]);
    expect(lastProps(TabsView).activeFilters[field]).toEqual([values[0]]);
  });

  it('keeps incompatible selections active without adding them to server options', async () => {
    const noMatches = response();
    noMatches.data.searchParticipants.numberOfParticipants = 0;
    noMatches.data.searchParticipants[COMBINATIONS] = [];
    noMatches.data.searchParticipants.participantCountByTherapyType = [];
    noMatches.data.searchParticipants.filterParticipantCountByTherapyType = [];
    noMatches.data.searchParticipants.participantCountByTherapyCategory = [];
    noMatches.data.searchParticipants.filterParticipantCountByTherapyCategory = [{ group: 'Targeted', subjects: 4 }];
    mockClient.query.mockResolvedValue(noMatches);
    const store = makeStore({
      therapy_string: { A: true }, therapy_type: { Chemotherapy: true },
      therapy_category: { 'Non-Targeted': true },
    });
    mountDashboard(store);
    await waitForDashboard(1, ['A']);
    expect(lastProps(StatsView).data.numberOfParticipants).toBe(0);
    expect(lastProps(TabsView).activeFilters.therapy_category).toEqual(['Non-Targeted']);
    expect(lastProps(TabsView).activeFilters.therapy_type).toEqual(['Chemotherapy']);
    expect(lastProps(BentoFacetFilter).searchData.filterParticipantCountByTherapyType).toEqual([]);
    expect(lastProps(BentoFacetFilter).searchData.filterParticipantCountByTherapyCategory)
      .toEqual([{ group: 'Targeted', subjects: 4 }]);
    act(() => { store.dispatch(clearFacetSection({ datafield: 'therapy_category' })); });
    await waitForDashboard(2, ['A']);
    expect(lastProps(TabsView).activeFilters.therapy_type).toEqual(['Chemotherapy']);
    expect(getFilters(store.getState().statusReducer.filterState).therapy_category || []).toEqual([]);
    act(() => { store.dispatch(clearAllFilters()); });
    await waitForDashboard(3, []);
    expect(lastProps(TabsView).activeFilters.therapy_type).toBeUndefined();
    expect(lastProps(TabsView).activeFilters.therapy_category).toBeUndefined();
    expect(lastProps(BentoFacetFilter).searchData.filterParticipantCountByTherapyCategory)
      .not.toContainEqual({ group: 'Non-Targeted', subjects: 0 });
  });

  it.each([
    ['therapy_type', 'Chemotherapy', 'Therapy Type'],
    ['therapy_category', 'Non-Targeted', 'Therapy Category'],
    ['therapy_type', '', 'Therapy Type'],
    ['therapy_category', '', 'Therapy Category'],
  ])('removes unavailable %s selection %j through the real query bar', async (field, value, label) => {
    // Exercise the existing recovery UI even when the sidebar has no option to
    // uncheck. Empty values use the facet-label reset; named values use the item.
    const ActualQueryBarView = jest.requireActual('./filterQueryBar/QueryBarView').default;
    const noMatches = response();
    noMatches.data.searchParticipants.numberOfParticipants = 0;
    noMatches.data.searchParticipants[COMBINATIONS] = [];
    noMatches.data.searchParticipants.filterParticipantCountByTherapyType = [];
    noMatches.data.searchParticipants.filterParticipantCountByTherapyCategory = [];
    mockClient.query.mockImplementation(({ variables }) => Promise.resolve(
      variables[field]?.length ? noMatches : response(),
    ));
    const store = makeStore({ therapy_string: { A: true }, sex: { Male: true }, [field]: { [value]: true } });
    mountDashboard(store);
    await waitForDashboard(1, ['A']);
    expect(dashboardRequests()[0].variables[field]).toEqual([value]);
    expect(lastProps(StatsView).data.numberOfParticipants).toBe(0);
    const sidebar = lastProps(BentoFacetFilter).searchData;
    expect(sidebar.filterParticipantCountByTherapyType).toEqual([]);
    expect(sidebar.filterParticipantCountByTherapyCategory).toEqual([]);

    const { container } = render(
      <Provider store={store}><ActualQueryBarView data={sidebar} /></Provider>,
    );
    const resetControl = [...container.querySelectorAll('span')]
      .find((element) => element.children.length === 0 && element.textContent === (value || label));
    expect(resetControl).toBeDefined();
    act(() => { resetControl.click(); });
    await waitForDashboard(2, ['A']);
    expect(dashboardRequests()[1].variables[field]).toEqual([]);
    expect(dashboardRequests()[1].variables.sex).toEqual(['Male']);
    expect(getFilters(store.getState().statusReducer.filterState)[field]).toEqual([]);
    expect(lastProps(StatsView).data.numberOfParticipants).toBe(15);
  });
});
