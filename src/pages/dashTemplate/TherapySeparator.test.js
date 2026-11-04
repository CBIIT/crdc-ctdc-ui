import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { useApolloClient, useQuery } from '@apollo/client';
import { sideBarReducerGenerator, toggleCheckBox } from '@bento-core/facet-filter';
import { btnTypes, TableView, Wrapper } from '@bento-core/paginated-table';
import { TableContext } from '@bento-core/paginated-table/dist/table/ContextProvider';
import { getTableData } from '@bento-core/paginated-table/dist/table/TableService';
import AddSelectedFiles from '@bento-core/paginated-table/dist/wrapper/components/AddSelectedFiles/AddSelectedFilesController';
import AddAllFiles from '@bento-core/paginated-table/dist/wrapper/components/AddAllFiles/AddAllView';
import DownloadButton from '@bento-core/paginated-table/node_modules/@bento-core/table/dist/toolbar/DownloadButtonView';
import { downloadJson, convertToCSV } from '@bento-core/paginated-table/node_modules/@bento-core/table/dist/util/downloadTable';
import * as siteWideConfig from '../../bento/siteWideConfig';
import * as queries from '../../bento/dashboardTabData';
import { GET_GLOBAL_STATS_DATA_QUERY } from '../../bento/globalStatsData';
import { loadState, saveState } from '../../store/utils';
import ScopedStatsController from '../../components/Stats/ScopedStatsController';
import StatsView from '../../components/Stats/StatsView';
import DashTemplateController from './DashTemplateController';
import BentoFacetFilter from './sideBar/BentoFacetFilter';
import WidgetView from './widget/WidgetView';
import TabsView from './tabs/TabsView';
import TabPanel from './tabs/TabPanel';
import { CustomCellView } from './tabs/tableConfig/Column';
import { generateValidTherapyCombinations, updateTherapyFacetData } from './utils';

// Change the configuration boundary, not the helpers. Controller calls below
// must pick up this setting without receiving an explicit separator argument.
jest.mock('../../bento/siteWideConfig', () => {
  const actual = jest.requireActual('../../bento/siteWideConfig');
  const config = { __esModule: true, ...actual };
  Object.defineProperty(config, 'THERAPY_COMBINATION_SEPARATOR', {
    configurable: true,
    get: () => actual.THERAPY_COMBINATION_SEPARATOR,
  });
  return config;
});
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
jest.mock('./filterQueryBar/QueryBarView', () => () => null);
jest.mock('../../components/Stats/StatsView', () => jest.fn(() => null));
jest.mock('../../components/DocumentDownload/DocumentDownloadView', () => () => null);
jest.mock('./tabs/Customize/TableView', () => ({ DisplayCustomText: () => null }));
jest.mock('@bento-core/paginated-table', () => ({
  ...jest.requireActual('@bento-core/paginated-table'),
  TableContextProvider: ({ children }) => children,
  TableView: jest.fn(() => null),
  Wrapper: jest.fn(({ children }) => children),
}));
jest.mock('@bento-core/paginated-table/node_modules/@bento-core/table/dist/util/downloadTable', () => ({
  ...jest.requireActual('@bento-core/paginated-table/node_modules/@bento-core/table/dist/util/downloadTable'),
  downloadJson: jest.fn(),
}));

// Synthetic backend vocabularies with explicit expected encodings. These tests
// verify frontend behavior, not backend indexing or server-side filtering.
// In particular, Type/Category remain independent any-value selections.
const ENCODINGS = [
  ['|', 'A|B', 'A|B|C'],
  ['~', 'A~B', 'A~B~C'],
  ['.*', 'A.*B', 'A.*B.*C'],
];
const COMBINATIONS = 'participantCountBySingleTherapyCombination';
const OPTIONS = 'filterParticipantCountBySingleTherapyCombination';
const VOCABULARY = 'filterParticipantCountBySingleTherapyCombinationForFacet';
const NAME_COUNTS = [
  { group: 'A', subjects: 21 }, { group: 'B', subjects: 23 },
  { group: 'C', subjects: 11 }, { group: '', subjects: 2 },
];
const TYPE_CATEGORY = {
  therapy_type: ['Chemotherapy', 'Immunotherapy'],
  therapy_category: ['Targeted', 'Non-Targeted'],
};
const distinct = (terms) => [...new Set(terms)].sort();
const selected = (names) => Object.fromEntries(names.map((name) => [name, true]));
const lastProps = (component) => component.mock.calls[component.mock.calls.length - 1][0];
const client = { query: jest.fn() };
const requests = (document) => client.query.mock.calls
  .map(([request]) => request).filter(({ query }) => query === document);
const containers = [];
const render = (element) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  containers.push(container);
  const rerender = (next) => act(() => { ReactDOM.render(next, container); });
  rerender(element);
  return { container, rerender };
};
const makeStore = (selection, savedKey = 'therapy_string') => {
  saveState({
    statusReducer: { filterState: {
      [savedKey]: selected(selection),
      therapy_type: selected(TYPE_CATEGORY.therapy_type),
      therapy_category: selected(TYPE_CATEGORY.therapy_category),
      study_short_name: { 'test-study': true },
    } },
    localFind: { upload: [{ subject_id: 'test-participant' }], autocomplete: [] },
    cartReducer: { files: ['saved-file'] },
  });
  const { statusReducer } = sideBarReducerGenerator();
  return createStore(combineReducers({
    statusReducer,
    localFind: (state = {}) => state,
    cartReducer: (state = {}) => state,
  }), loadState());
};
const mountDashboard = (store) => render(
  <Provider store={store}><DashTemplateController /></Provider>,
);
const response = (vocabulary) => ({ data: {
  searchParticipants: {
    numberOfParticipants: 28,
    numberOfTherapies: 3,
    [COMBINATIONS]: vocabulary,
    [OPTIONS]: vocabulary,
    [VOCABULARY]: vocabulary,
    participantCountByTherapy: NAME_COUNTS,
    filterParticipantCountByTherapyType: [{ group: 'Chemotherapy', subjects: 28 }],
    filterParticipantCountByTherapyCategory: [{ group: 'Targeted', subjects: 28 }],
  },
  filesTabCount: { numberOfFiles: 9 },
  studyFilesTabCount: { numberOfStudyFiles: 3 },
} });
const click = async (container, title) => {
  const button = [...container.querySelectorAll('button')]
    .find((item) => item.textContent === title || item.getAttribute('title') === title);
  expect(button).toBeDefined();
  await act(async () => { button.click(); });
};
// Use the installed table request hook with the actual TabPanel props. File
// buttons and CSV download below also use the installed package components.
const TableProbe = ({ table, queryVariables }) => {
  getTableData({ table, queryVariables });
  return null;
};

let separatorSetting;
beforeEach(() => {
  jest.clearAllMocks();
  client.query.mockReset();
  useQuery.mockReset();
  useApolloClient.mockReturnValue(client);
  separatorSetting = jest.spyOn(siteWideConfig, 'THERAPY_COMBINATION_SEPARATOR', 'get');
  localStorage.removeItem('ctdcReduxState');
});
afterEach(() => {
  containers.splice(0).forEach((container) => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
  });
  localStorage.removeItem('ctdcReduxState');
  jest.restoreAllMocks();
});

describe.each(ENCODINGS)('Therapy separator %j from site-wide configuration', (separator, ab, abc) => {
  const vocabulary = [
    { group: 'A', subjects: 3 }, { group: 'B', subjects: 5 },
    { group: ab, subjects: 7 }, { group: abc, subjects: 11 },
    { group: '', subjects: 2 },
  ];
  beforeEach(() => {
    separatorSetting.mockReturnValue(separator);
    client.query.mockResolvedValue(response(vocabulary));
  });

  it.each([
    [['A'], ['A'], 3],
    [['B', 'A'], ['A', ab, 'B'], 15],
    [['C', 'A', 'B'], ['A', ab, abc, 'B', 'C'], 26],
    [['A', 'C'], ['A', 'C'], 3],
    [[''], [''], 2],
    [['', 'A', 'B'], ['', 'A', ab, 'B'], 17],
    [[], [], null],
  ])('expands %j into only supported complete combinations', (selection, expected, count) => {
    const filters = { therapy_string: selection, ...TYPE_CATEGORY };
    const before = JSON.stringify({ filters, vocabulary });
    const terms = generateValidTherapyCombinations(filters, 'therapy_string', vocabulary);
    // Compare exact terms for every separator; duplicate request values must fail.
    expect(terms).toEqual([...expected].sort());
    if (count !== null) {
      expect(vocabulary.filter(({ group }) => terms.includes(group))
        .reduce((sum, { subjects }) => sum + subjects, 0)).toBe(count);
    }
    expect(JSON.stringify({ filters, vocabulary })).toBe(before);
  });

  it('reconstructs name counts and preserves the missing-value option without mutating buckets', () => {
    const source = { [OPTIONS]: vocabulary };
    const before = JSON.stringify(source);
    expect(updateTherapyFacetData(source, OPTIONS)).toEqual({ [OPTIONS]: NAME_COUNTS });
    expect(JSON.stringify(source)).toBe(before);
    expect(updateTherapyFacetData({ [OPTIONS]: [] }, OPTIONS)).toEqual({ [OPTIONS]: [] });
    expect(generateValidTherapyCombinations({ therapy_string: ['A'] }, 'therapy_string', []))
      .toEqual(['A']);
  });

  it.each(['therapy_string', 'targeted_therapy_string'])('restores %s before the first dashboard request', async (savedKey) => {
    const store = makeStore(['', 'B', 'A'], savedKey);
    const restored = store.getState();
    let finishVocabulary;
    client.query.mockImplementation(({ query }) => (query === queries.THERAPY_QUERY
      ? new Promise((resolve) => { finishVocabulary = resolve; })
      : Promise.resolve(response(vocabulary))));
    mountDashboard(store);
    expect(requests(queries.THERAPY_QUERY)).toHaveLength(1);
    expect(requests(queries.THERAPY_QUERY)[0].variables).toEqual({
      therapy_string: ['', 'B', 'A'], ...TYPE_CATEGORY,
      study_short_name: ['test-study'], participant_id: ['test-participant'],
    });
    expect(requests(queries.DASHBOARD_QUERY_NEW)).toHaveLength(0);
    expect(TabsView).not.toHaveBeenCalled();

    await act(async () => { finishVocabulary(response(vocabulary)); });
    expect(requests(queries.DASHBOARD_QUERY_NEW)).toHaveLength(1);
    const { variables } = requests(queries.DASHBOARD_QUERY_NEW)[0];
    expect(variables.therapy_string).toEqual(['', 'A', ab, 'B'].sort());
    expect(variables).toMatchObject({
      ...TYPE_CATEGORY, study_short_name: ['test-study'], participant_id: ['test-participant'],
      files_association: ['biospecimen', 'participant'], study_association: ['study'],
    });
    expect(lastProps(TabsView).activeFilters.therapy_string).toEqual(variables.therapy_string);
    expect(lastProps(BentoFacetFilter).searchData).toMatchObject({
      [COMBINATIONS]: NAME_COUNTS, [OPTIONS]: NAME_COUNTS, [VOCABULARY]: vocabulary,
    });
    expect(lastProps(WidgetView).data.participantCountByTherapy).toEqual(NAME_COUNTS);
    expect(lastProps(StatsView).data).toMatchObject({ numberOfTherapies: 3, numberOfFiles: 9 });
    expect(store.getState()).toEqual(restored);
    saveState(store.getState());
    expect(loadState()).toEqual(restored);
    expect(loadState().statusReducer.filterState.therapy_string).toEqual({ '': true, B: true, A: true });
    expect(loadState().statusReducer.filterState.targeted_therapy_string).toBeUndefined();
  });

  it.each([[['']], [[]]])('keeps restored %j distinct from a missing-value or cleared filter', async (selection) => {
    mountDashboard(makeStore(selection));
    await act(async () => {});
    expect(requests(queries.DASHBOARD_QUERY_NEW)[0].variables.therapy_string).toEqual(selection);
    useQuery.mockReturnValue({ loading: false, data: response(vocabulary).data });
    render(<ScopedStatsController variables={lastProps(TabsView).activeFilters} />);
    const [, options] = useQuery.mock.calls[useQuery.mock.calls.length - 1];
    // Scoped stats omits empty arrays, but must retain the selected empty string.
    expect(options.variables.therapy_string).toEqual(selection.length ? [''] : undefined);
  });

  it('refreshes combinations when another facet broadens the vocabulary, then clears names', async () => {
    const store = makeStore(['A', 'B']);
    client.query.mockResolvedValue(response(vocabulary.filter(({ group }) => group !== ab)));
    mountDashboard(store);
    await act(async () => {});
    expect(distinct(lastProps(TabsView).activeFilters.therapy_string)).toEqual(['A', 'B']);
    let finishVocabulary;
    client.query.mockImplementation(({ query }) => (query === queries.THERAPY_QUERY
      ? new Promise((resolve) => { finishVocabulary = resolve; })
      : Promise.resolve(response(vocabulary))));
    act(() => { store.dispatch(toggleCheckBox({ datafield: 'study_short_name', name: 'test-study', isChecked: false })); });
    expect(requests(queries.THERAPY_QUERY)).toHaveLength(2);
    expect(requests(queries.DASHBOARD_QUERY_NEW)).toHaveLength(1);
    await act(async () => { finishVocabulary(response(vocabulary)); });
    expect(distinct(lastProps(TabsView).activeFilters.therapy_string)).toEqual(distinct(['A', ab, 'B']));

    act(() => { store.dispatch(toggleCheckBox({ datafield: 'therapy_string', name: 'B', isChecked: false })); });
    await act(async () => {});
    expect(distinct(lastProps(TabsView).activeFilters.therapy_string)).toEqual(['A']);
    act(() => { store.dispatch(toggleCheckBox({ datafield: 'therapy_string', name: 'A', isChecked: false })); });
    await act(async () => {});
    expect(lastProps(TabsView).activeFilters.therapy_string).toEqual([]);
    expect(requests(queries.THERAPY_QUERY)).toHaveLength(2);
    expect(requests(queries.DASHBOARD_QUERY_NEW)).toHaveLength(4);
  });

  it.each(['Participants', 'Biospecimens', 'Files'])('%s forwards configured combinations to table, stats, and file requests', async (name) => {
    mountDashboard(makeStore(['', 'A', 'B']));
    await act(async () => {});
    const { activeFilters, dashboardStats } = lastProps(TabsView);
    expect(activeFilters.therapy_string).toEqual(['', 'A', ab, 'B'].sort());
    const config = queries.tabContainers.find((tab) => tab.name === name);
    render(<TabPanel config={config} activeFilters={activeFilters} dashboardStats={dashboardStats} activeTab />);
    const { queryVariables, initState } = lastProps(TableView);
    const wrapper = lastProps(Wrapper);
    const expectedFilters = { ...activeFilters, ...config.defaultFilters };
    expect(queryVariables).toEqual(expectedFilters);
    expect(wrapper.activeFilters).toEqual(expectedFilters);
    expect(queryVariables).toMatchObject(TYPE_CATEGORY);
    const table = initState({});
    client.query.mockResolvedValue({ data: { [config.paginationAPIField]: [] } });
    const { rerender } = render(<TableProbe table={table} queryVariables={queryVariables} />);
    await act(async () => {});
    rerender(<TableProbe table={{ ...table, page: 1, sortOrder: 'desc' }} queryVariables={queryVariables} />);
    await act(async () => {});
    expect(client.query).toHaveBeenLastCalledWith({ query: config.api, variables: {
      ...expectedFilters, first: 10, offset: 10, order_by: config.defaultSortField, sort_direction: 'desc',
    } });

    useQuery.mockReturnValue({ loading: false, data: response(vocabulary).data });
    render(<ScopedStatsController variables={activeFilters} />);
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_STATS_DATA_QUERY, { variables: {
      ...activeFilters, files_association: ['biospecimen', 'participant'], study_association: ['study'],
    } });
    const buttons = wrapper.wrapConfig.flatMap(({ items }) => items);
    const selectedButton = buttons.find(({ role }) => role === btnTypes.ADD_SELECTED_FILES);
    const allButton = buttons.find(({ role }) => role === btnTypes.ADD_ALL_FILES);
    const mockFiles = ({ responseKeys: keys }) => client.query.mockResolvedValue({ data: {
      [keys[0]]: keys.length === 2 ? [{ [keys[1]]: 'test-file' }] : ['test-file'],
    } });
    const addFiles = jest.fn();
    const common = {
      client, classes: {}, section: name, activeFilters: wrapper.activeFilters,
      addFiles, setOpenSnackbar: jest.fn(), setAlterDisplay: jest.fn(),
    };
    const SelectedController = AddSelectedFiles.WrappedComponent;
    mockFiles(selectedButton);
    const selectedView = render(
      <TableContext.Provider value={{ context: { selectedRows: ['selected-row'], dispatch: jest.fn() } }}>
        <SelectedController {...selectedButton} {...common} />
      </TableContext.Provider>,
    );
    await click(selectedView.container, selectedButton.title);
    expect(client.query).toHaveBeenLastCalledWith({ query: config.addSelectedFilesQuery, variables: {
      ...expectedFilters, first: 10000, [config.addFilesRequestVariableKey]: ['selected-row'],
    } });
    expect(addFiles).toHaveBeenCalledWith(['test-file']);
    addFiles.mockClear();
    mockFiles(allButton);
    const allView = render(<AddAllFiles {...allButton} {...common} />);
    await click(allView.container, allButton.title);
    expect(client.query).toHaveBeenLastCalledWith({ query: config.addAllFileQuery, variables: {
      ...expectedFilters, first: 10000,
    } });
    expect(addFiles).not.toHaveBeenCalled(); // Add-all still requires its normal confirmation.
  });

  it('keeps displayed names and exported arrays independent of request encoding', async () => {
    mountDashboard(makeStore(['A', 'B']));
    await act(async () => {});
    const config = queries.tabContainers.find(({ name }) => name === 'Participants');
    const { activeFilters, dashboardStats } = lastProps(TabsView);
    render(<TabPanel config={config} activeFilters={activeFilters} dashboardStats={dashboardStats} activeTab />);
    const { queryVariables, initState } = lastProps(TableView);
    const table = initState({});
    const rows = [{ participant_id: 'test-participant', therapy_name: ['drug, regimen', 'A + B'] }];
    const column = config.columns.find(({ dataField }) => dataField === 'therapy_name');
    expect(render(<CustomCellView {...column} {...rows[0]} />).container.textContent)
      .toBe('drug, regimen, A + B');
    client.query.mockResolvedValue({ data: { participantOverview: rows } });
    const { container } = render(<DownloadButton
      download={config.extendedViewConfig.download} table={table} queryVariables={queryVariables} server
    />);
    await act(async () => { container.querySelector('button').click(); });
    expect(client.query).toHaveBeenLastCalledWith({ query: config.api, variables: {
      ...queryVariables, page: 0, first: 10000,
    } });
    expect(downloadJson).toHaveBeenCalledWith(rows, table, 'CTDC_Participants_download');
    expect(convertToCSV(rows, ['participant_id', 'therapy_name'], ['Participant ID', 'Therapy']))
      .toBe('Participant ID,Therapy\r\n"test-participant","drug, regimen,A + B"\r\n');
    expect(rows[0].therapy_name).toEqual(['drug, regimen', 'A + B']);
  });
});

describe('Separator configuration validation and literal parsing', () => {
  it('uses the shipped pipe setting by default', () => {
    expect(siteWideConfig.THERAPY_COMBINATION_SEPARATOR).toBe('|');
    expect(distinct(generateValidTherapyCombinations({ therapy_string: ['A', 'B'] }, 'therapy_string', [{ group: 'A|B' }])))
      .toEqual(['A', 'A|B', 'B']);
  });

  it.each(['', ' ', '\t\n', null, undefined, 42])('rejects invalid configured separator %j at both boundaries', (invalid) => {
    separatorSetting.mockReturnValue(invalid);
    expect(() => generateValidTherapyCombinations({ therapy_string: [] }, 'therapy_string', []))
      .toThrow('THERAPY_COMBINATION_SEPARATOR must be a non-empty, non-whitespace string.');
    expect(() => updateTherapyFacetData({ [OPTIONS]: [] }, OPTIONS))
      .toThrow('THERAPY_COMBINATION_SEPARATOR must be a non-empty, non-whitespace string.');
  });

  it('allows an explicit separator without changing the configured default', () => {
    separatorSetting.mockReturnValue('|');
    const vocabulary = [{ group: 'A~B', subjects: 2 }];
    expect(distinct(generateValidTherapyCombinations({ therapy_string: ['A', 'B'] }, 'therapy_string', vocabulary, '~')))
      .toEqual(['A', 'A~B', 'B']);
    expect(updateTherapyFacetData({ [OPTIONS]: vocabulary }, OPTIONS, '~')[OPTIONS])
      .toEqual([{ group: 'A', subjects: 2 }, { group: 'B', subjects: 2 }]);
    expect(siteWideConfig.THERAPY_COMBINATION_SEPARATOR).toBe('|');
  });

  it.each(['~', '.*', ' ~ '])('keeps punctuation inside names literal with separator %j', (separator) => {
    separatorSetting.mockReturnValue(separator);
    const names = ['A + B', 'C, regimen', 'D|E'];
    const vocabulary = [{ group: names.join(separator), subjects: 2 }];
    expect(distinct(generateValidTherapyCombinations({ therapy_string: names }, 'therapy_string', vocabulary)))
      .toEqual(distinct([...names, vocabulary[0].group]));
    expect(updateTherapyFacetData({ [OPTIONS]: vocabulary }, OPTIONS)[OPTIONS])
      .toEqual(names.map((group) => ({ group, subjects: 2 })));
  });
});
