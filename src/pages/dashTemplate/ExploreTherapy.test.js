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
import { downloadJson, convertToCSV } from '@bento-core/paginated-table/node_modules/@bento-core/table/dist/util/downloadTable';
import { tabContainers } from '../../bento/dashboardTabData';
import { configColumn } from './tabs/tableConfig/Column';
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
jest.mock('@bento-core/paginated-table/node_modules/@bento-core/table/dist/util/downloadTable', () => ({
  ...jest.requireActual('@bento-core/paginated-table/node_modules/@bento-core/table/dist/util/downloadTable'),
  downloadJson: jest.fn(),
}));

const client = { query: jest.fn() };
const tabs = tabContainers.filter(({ name }) => ['Participants', 'Biospecimens', 'Files'].includes(name));
const participants = tabs.find(({ name }) => name === 'Participants');
const containers = [];
const filters = (therapy = ['A', 'A|B', 'B']) => ({
  therapy_string: therapy,
  study_short_name: ['test-study'],
  participant_id: ['test-participant'],
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

  it('sorts by therapy_name while continuing to filter by therapy_string', async () => {
    client.query.mockResolvedValue({ data: { participantOverview: [] } });
    render(<TableProbe tab={participants} activeFilters={filters()} sortBy="therapy_name" sortOrder="desc" />);
    await act(async () => {});
    expect(client.query).toHaveBeenCalledWith({
      query: participants.api,
      variables: { ...filters(), first: 10, offset: 0, order_by: 'therapy_name', sort_direction: 'desc' },
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
  it('exports the full current cohort after a filter change, using name arrays as data', async () => {
    const rows = [{ participant_id: 'test-participant', therapy_name: ['drug, regimen', 'B'] }];
    client.query.mockResolvedValue({ data: { participantOverview: rows } });
    const table = {
      query: participants.api,
      paginationAPIField: participants.paginationAPIField,
      columns: configColumn(participants.columns),
      page: 1,
      rowsPerPage: 10,
    };
    const view = (queryVariables) => (
      <DownloadButton
        download={participants.extendedViewConfig.download}
        table={table}
        queryVariables={queryVariables}
        server
      />
    );
    const { container, rerender } = render(view(filters(['A'])));
    const currentFilters = filters(['', 'A', 'A|B', 'B']);
    rerender(view(currentFilters));
    await act(async () => { container.querySelector('button').click(); });
    expect(client.query).toHaveBeenCalledWith({
      query: participants.api,
      variables: { ...currentFilters, page: 0, first: 10000 },
    });
    expect(downloadJson).toHaveBeenCalledWith(rows, table, 'CTDC_Participants_download');
    const therapyColumn = table.columns.find(({ dataField }) => dataField === 'therapy_name');
    expect(therapyColumn.header).toBe('Therapy');
    expect(convertToCSV(rows, ['participant_id', 'therapy_name'], ['Participant ID', 'Therapy']))
      .toBe('Participant ID,Therapy\r\n"test-participant","drug, regimen,B"\r\n');
    expect(currentFilters.therapy_string).toEqual(['', 'A', 'A|B', 'B']);
  });
});
