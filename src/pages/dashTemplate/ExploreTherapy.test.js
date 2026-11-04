import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useApolloClient } from '@apollo/client';
import { btnTypes } from '@bento-core/paginated-table';
import { TableContext } from '@bento-core/paginated-table/dist/table/ContextProvider';
import { getTableData } from '@bento-core/paginated-table/dist/table/TableService';
import AddSelectedFiles from '@bento-core/paginated-table/dist/wrapper/components/AddSelectedFiles/AddSelectedFilesController';
import AddAllFiles from '@bento-core/paginated-table/dist/wrapper/components/AddAllFiles/AddAllView';
import DownloadButton from '@bento-core/paginated-table/node_modules/@bento-core/table/dist/toolbar/DownloadButtonView';
import { csv2json } from 'json-2-csv';
import { downloadCsvString } from '../fileCentricCart/utils';
import { useExtendedViewConfig } from './tabs/Customize/ExtendedView';
import { tabContainers } from '../../bento/dashboardTabData';
import { configWrapper, wrapperConfig } from './tabs/wrapperConfig/Wrapper';

// C3 integration coverage: use the installed runtime components, not replacement
// implementations of their request builders. Only network, cart writes and the
// browser download boundary are mocked. A/B and all IDs below are synthetic.
// The nested table import is intentional: paginated-table ships its own copy.
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useApolloClient: jest.fn(),
}));
jest.mock('../../utils/graphqlClient', () => ({
  client: { query: jest.fn(), mutate: jest.fn() },
}));
jest.mock('../../components/DocumentDownload/DocumentDownloadView', () => () => null);
jest.mock('./tabs/Customize/TableView', () => ({ DisplayCustomText: () => null }));
jest.mock('../fileCentricCart/utils', () => ({
  ...jest.requireActual('../fileCentricCart/utils'), downloadCsvString: jest.fn(),
}));

const client = { query: jest.fn() };
const tabs = tabContainers.filter(({ name }) => ['Participants', 'Biospecimens', 'Files'].includes(name));
const participants = tabs.find(({ name }) => name === 'Participants');
const containers = [];
const filters = (therapy = ['A', 'A|B', 'B']) => ({
  therapy_string: therapy,
  therapy_type: ['Chemotherapy', 'Immunotherapy'],
  therapy_category: ['Targeted', 'Non-Targeted'],
  study_short_name: ['test-study'],
  participant_id: ['test-participant'],
  race: ['Asian', 'White'],
});
const render = (element) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  containers.push(container);
  const rerender = (next) => act(() => { ReactDOM.render(next, container); });
  rerender(element);
  return { container, rerender };
};
const click = async (container, label) => {
  const button = [...container.querySelectorAll('button')]
    .find((element) => element.textContent === label || element.getAttribute('title') === label);
  expect(button).toBeDefined();
  await act(async () => { button.click(); });
};
const buttonConfig = (tab, role) => configWrapper(tab, wrapperConfig, '', 2)
  .flatMap(({ items }) => items).find((item) => item.role === role);
const fileResponse = (keys) => ({ data: {
  [keys[0]]: keys.length === 2 ? [{ [keys[1]]: 'test-file' }] : ['test-file'],
} });

beforeEach(() => {
  jest.clearAllMocks();
  client.query.mockReset();
  useApolloClient.mockReturnValue(client);
});
afterEach(() => {
  containers.splice(0).forEach((container) => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
  });
});

// Mount the real table request hook with the same configuration TabPanel uses.
// Changes to page/sort must not replace expanded combinations with display names.
const TableProbe = ({ tab, activeFilters, page = 0, sortBy, sortOrder = 'asc' }) => {
  const { tableData } = getTableData({
    queryVariables: activeFilters,
    table: {
      query: tab.api,
      paginationAPIField: tab.paginationAPIField,
      page,
      rowsPerPage: 10,
      sortBy: sortBy || tab.defaultSortField,
      sortOrder,
    },
  });
  return <span>{tableData ? tableData.length : 'loading'}</span>;
};

describe('Explore Therapy table requests', () => {
  it.each(tabs.map((tab) => [tab.name, tab]))('%s retains combinations across pages and filter changes', async (_name, tab) => {
    client.query.mockResolvedValue({ data: { [tab.paginationAPIField]: [{ id: 'test-row' }] } });
    const activeFilters = { ...filters(), ...tab.defaultFilters };
    const { rerender } = render(<TableProbe tab={tab} activeFilters={activeFilters} />);
    await act(async () => {});
    rerender(<TableProbe tab={tab} activeFilters={activeFilters} page={1} />);
    await act(async () => {});
    expect(client.query).toHaveBeenLastCalledWith({
      query: tab.api,
      variables: { ...activeFilters, first: 10, offset: 10, order_by: tab.defaultSortField, sort_direction: 'asc' },
    });
    const nextFilters = { ...activeFilters, therapy_string: [''] };
    rerender(<TableProbe tab={tab} activeFilters={nextFilters} />);
    await act(async () => {});
    expect(client.query.mock.calls[2][0].variables).toMatchObject({ therapy_string: [''], offset: 0 });
    expect(activeFilters.therapy_string).toEqual(['A', 'A|B', 'B']);
  });

  it.each(['therapy_name', 'therapy_category', 'race'])('sorts by %s while retaining the current therapy filters', async (sortBy) => {
    client.query.mockResolvedValue({ data: { participantOverview: [] } });
    render(<TableProbe tab={participants} activeFilters={filters()} sortBy={sortBy} sortOrder="desc" />);
    await act(async () => {});
    expect(client.query).toHaveBeenCalledWith({
      query: participants.api,
      variables: { ...filters(), first: 10, offset: 0, order_by: sortBy, sort_direction: 'desc' },
    });
  });
});

describe('Explore Therapy file actions', () => {
  it.each(tabs.map((tab) => [tab.name, tab]))('%s selected action sends current filters and selected IDs', async (_name, tab) => {
    const config = buttonConfig(tab, btnTypes.ADD_SELECTED_FILES);
    client.query.mockResolvedValue(fileResponse(config.responseKeys));
    const addFiles = jest.fn();
    const dispatch = jest.fn();
    const SelectedController = AddSelectedFiles.WrappedComponent;
    const view = (activeFilters) => (
      <TableContext.Provider value={{ context: { selectedRows: ['selected-row'], dispatch } }}>
        <SelectedController
          {...config}
          classes={{}}
          section={tab.name}
          client={client}
          activeFilters={activeFilters}
          addFiles={addFiles}
          setOpenSnackbar={jest.fn()}
          setAlterDisplay={jest.fn()}
        />
      </TableContext.Provider>
    );
    const { container, rerender } = render(view(filters(['A'])));
    const currentFilters = { ...filters(['', 'A', 'A|B', 'B']), ...tab.defaultFilters };
    rerender(view(currentFilters));
    await click(container, config.title);
    expect(client.query).toHaveBeenCalledTimes(1);
    expect(client.query).toHaveBeenCalledWith({
      query: tab.addSelectedFilesQuery,
      variables: { ...currentFilters, first: 10000, [tab.addFilesRequestVariableKey]: ['selected-row'] },
    });
    expect(addFiles).toHaveBeenCalledWith(['test-file']);
    expect(currentFilters.therapy_string).toEqual(['', 'A', 'A|B', 'B']);
  });

  it.each(tabs.map((tab) => [tab.name, tab]))('%s all action sends current filters before cart confirmation', async (_name, tab) => {
    const config = buttonConfig(tab, btnTypes.ADD_ALL_FILES);
    client.query.mockResolvedValue(fileResponse(config.responseKeys));
    const addFiles = jest.fn();
    const view = (activeFilters) => (
      <AddAllFiles
        {...config}
        classes={{}}
        section={tab.name}
        client={client}
        activeFilters={activeFilters}
        addFiles={addFiles}
        setOpenSnackbar={jest.fn()}
        setAlterDisplay={jest.fn()}
      />
    );
    const { container, rerender } = render(view(filters(['A'])));
    const currentFilters = { ...filters(['', 'A', 'A|B', 'B']), ...tab.defaultFilters };
    rerender(view(currentFilters));
    await click(container, config.title);
    expect(client.query).toHaveBeenCalledWith({
      query: tab.addAllFileQuery,
      variables: { ...currentFilters, first: 10000 },
    });
    expect(addFiles).not.toHaveBeenCalled();
  });
});

describe('Explore Therapy CSV request', () => {
  it.each(tabContainers.flatMap((tab) => [false, true, undefined].map((flag) => [tab.name, flag, tab])))(
    '%s honors applyActiveFilters=%s while keeping its table scope', async (_name, applyActiveFilters, tab) => {
      const config = {
        ...tab,
        extendedViewConfig: {
          ...tab.extendedViewConfig,
          download: { ...tab.extendedViewConfig.download, applyActiveFilters },
        },
      };
      client.query.mockResolvedValue({ data: { [tab.paginationAPIField]: [{ participant_id: 'test-row' }] } });
      const DownloadProbe = ({ queryVariables }) => {
        const { extendedViewConfig } = useExtendedViewConfig(config, queryVariables);
        return <DownloadButton download={extendedViewConfig.download} queryVariables={queryVariables} server />;
      };
      const { container, rerender } = render(<DownloadProbe queryVariables={filters(['A'])} />);
      expect(client.query).not.toHaveBeenCalled();
      const currentFilters = Object.freeze({ ...filters(['', 'A|B']), offset: 20, first: 10 });
      rerender(<DownloadProbe queryVariables={currentFilters} />);
      await act(async () => { container.querySelector('button').click(); });
      expect(client.query).toHaveBeenCalledTimes(1);
      expect(client.query).toHaveBeenCalledWith({
        query: tab.api,
        variables: {
          ...(applyActiveFilters ? currentFilters : {}), ...tab.defaultFilters, offset: 0, first: 10000,
        },
      });
      expect(downloadCsvString).toHaveBeenCalledTimes(1);
      expect(currentFilters).toEqual({ ...filters(['', 'A|B']), offset: 20, first: 10 });
    },
  );

  it('exports the current cohort with blank empty lists, readable labels and intact CSV columns', async () => {
    const rows = [
      { participant_id: 'multi', race: ['Asian', 'White'],
        therapy_name: ['drug, regimen', 'Name "quoted"'], therapy_category: ['Targeted', 'Non-Targeted'] },
      { participant_id: 'empty', race: [], therapy_name: '[]', carcinogen_exposure: '[]' },
      { participant_id: 'legacy', race: '[White]', therapy_name: '[Drug [detail], Other]', carcinogen_exposure: '[Unknown]' },
    ];
    client.query.mockResolvedValue({ data: { participantOverview: rows } });
    const table = { query: participants.api, paginationAPIField: participants.paginationAPIField };
    const DownloadProbe = ({ queryVariables }) => {
      const config = {
        ...participants,
        extendedViewConfig: {
          ...participants.extendedViewConfig,
          download: { ...participants.extendedViewConfig.download, applyActiveFilters: true },
        },
      };
      const { extendedViewConfig } = useExtendedViewConfig(config, queryVariables);
      return <DownloadButton download={extendedViewConfig.download} table={table} queryVariables={queryVariables} server />;
    };
    const { container, rerender } = render(<DownloadProbe queryVariables={filters(['A'])} />);
    const currentFilters = filters(['', 'A', 'A|B', 'B']);
    rerender(<DownloadProbe queryVariables={currentFilters} />);
    await act(async () => { container.querySelector('button').click(); });
    expect(client.query).toHaveBeenCalledWith({
      query: participants.api, variables: { ...currentFilters, offset: 0, first: 10000 },
    });
    const [csv, filename] = downloadCsvString.mock.calls[0];
    expect(filename).toMatch(/^CTDC_Participants_download .*\.csv$/);
    const exported = csv2json(csv.replace(/\r\n$/, ''), {
      delimiter: { eol: '\r\n' }, parseValue: (value) => value,
    });
    expect(exported).toEqual([
      expect.objectContaining({ 'Participant ID': 'multi', Race: 'Asian, White', Therapy: 'drug, regimen, Name "quoted"', 'Therapy Category': 'Targeted, Non-Targeted' }),
      expect.objectContaining({ 'Participant ID': 'empty', Race: '', Therapy: '', 'Carcinogen Exposure': '' }),
      expect.objectContaining({ 'Participant ID': 'legacy', Race: 'White', Therapy: 'Drug [detail], Other', 'Carcinogen Exposure': 'Unknown' }),
    ]);
    expect(currentFilters.therapy_string).toEqual(['', 'A', 'A|B', 'B']);
    expect(rows[0].race).toEqual(['Asian', 'White']);
  });

  it('reports a failed export without downloading a file', async () => {
    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
    client.query.mockRejectedValue(new Error('Backend unavailable'));
    const DownloadProbe = () => {
      const { extendedViewConfig, downloadError } = useExtendedViewConfig(participants, filters());
      return <><DownloadButton download={extendedViewConfig.download} queryVariables={{}} server /><span>{downloadError ? 'Download failed' : ''}</span></>;
    };
    const { container } = render(<DownloadProbe />);
    await act(async () => { container.querySelector('button').click(); });
    expect(container.textContent).toContain('Download failed');
    expect(downloadCsvString).not.toHaveBeenCalled();
    errorLog.mockRestore();
  });
});
