import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { TableContextProvider } from '../../bento-core';
import { pageData, tableLayOut } from '../../bento/studiesData';
import { downloadJson } from '../PaginatedTable/utils';
import StudiesTable from './StudiesTable';

jest.mock('@apollo/client', () => ({ useApolloClient: () => ({ query: jest.fn() }) }));
jest.mock('../../utils/graphqlClient', () => ({ query: jest.fn() }));
jest.mock('../../bento-core', () => ({
  ...jest.requireActual('@bento-core/table'),
  ...jest.requireActual('@bento-core/paginated-table'),
  ToolTip: jest.requireActual('@bento-core/tool-tip').default,
}));
jest.mock('../PaginatedTable/utils', () => ({
  ...jest.requireActual('../PaginatedTable/utils'),
  downloadJson: jest.fn(),
}));

let container;
let table;
const initialRows = [{
  study_id: 'NCT00352534',
  study_name: 'Wilms Tumor Study',
  participant_file_count: 12,
  study_file_count: 3,
  image_collection_count: 1,
  numberOfPublications: 0,
  unique_repository: ['The Cancer Imaging Archive'],
  repositories: [{ repository_name: 'The Cancer Imaging Archive', repository_url: null }],
  study_type: 'Interventional Study',
}, {
  study_id: 'NCT04314401',
  study_name: 'CM Biobank',
  unique_repository: [],
  repositories: [],
}];

const render = (data) => act(() => {
  ReactDOM.render(
    <TableContextProvider>
      <StudiesTable data={data} table={table} tableLayOut={tableLayOut} rowsPerPage={10} />
    </TableContextProvider>,
    container,
  );
});

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  // The shared table initializer mutates its download configuration.
  table = {
    ...pageData.table,
    extendedViewConfig: {
      ...pageData.table.extendedViewConfig,
      download: { ...pageData.table.extendedViewConfig.download },
    },
  };
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  jest.clearAllMocks();
});

it('downloads current repository names after static content resolves without resetting table state', () => {
  render(initialRows);
  act(() => { fireEvent.click(screen.getByRole('button', { name: 'Download Table Contents As CSV' })); });
  expect(downloadJson.mock.calls[0][0]).toEqual(initialRows);

  act(() => { fireEvent.click(screen.getByRole('button', { name: 'Study Code' })); });
  const header = screen.getByRole('button', { name: 'Study Code' }).closest('th');
  expect(screen.getAllByRole('link', { name: /^NCT/ }).map((link) => link.textContent))
    .toEqual(['NCT04314401', 'NCT00352534']);

  const resolvedRows = initialRows.map((row) => (row.unique_repository.length ? {
    ...row,
    unique_repository: ['TCIA'],
    repositories: [{ repository_name: 'TCIA', repository_url: 'https://nbia.cancerimagingarchive.net/' }],
  } : row));
  render(resolvedRows);
  expect(screen.getByRole('button', { name: 'Study Code' }).closest('th')).toBe(header);
  expect(screen.getAllByRole('link', { name: /^NCT/ }).map((link) => link.textContent))
    .toEqual(['NCT04314401', 'NCT00352534']);

  act(() => { fireEvent.click(screen.getByRole('button', { name: 'Download Table Contents As CSV' })); });
  expect(downloadJson.mock.calls[1][0]).toEqual(resolvedRows);
  expect(downloadJson.mock.calls[1][1]).toEqual(expect.objectContaining({
    keysToInclude: pageData.table.extendedViewConfig.download.keysToInclude,
    header: pageData.table.extendedViewConfig.download.header,
    downloadFileName: 'CTDC_Studies_download',
  }));
});
