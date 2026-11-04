import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { parse, visit } from 'graphql';
import { csv2json } from 'json-2-csv';
import { useQuery } from '@apollo/client';
import { CartContext } from '@bento-core/cart';
import { TableContext } from '@bento-core/paginated-table';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import ParticipantCard from './search/Cards/participant/ParticipantCard';
import DropDownView from './fileCentricCart/components/dropdown/DropDownView';
import GraphqlView from '../components/GraphqlClient/GraphqlView';
import { downloadCsvString } from './fileCentricCart/utils';
import { myFileTablePaginationOptions } from './fileCentricCart/tableConfig/PaginationOptions';
import { GET_MY_CART_DATA_QUERY, GET_MY_CART_DATA_QUERY_DESC, manifestData } from '../bento/fileCentricCartWorkflowData';
import { SEARCH_PAGE_RESULT_PARTICIPANTS, queryResultAPI } from '../bento/search';
import client from '../utils/graphqlClient';
import { globalStatsData } from '../bento/globalStatsData';
import { migrateTherapyFilters } from '../store/utils';

jest.mock('@apollo/client', () => ({ ...jest.requireActual('@apollo/client'), useQuery: jest.fn() }));
jest.mock('../utils/graphqlClient', () => ({
  __esModule: true,
  default: { query: jest.fn() },
  client: { query: jest.fn(), mutate: jest.fn() },
}));
jest.mock('../bento-core', () => ({
  TableContext: jest.requireActual('@bento-core/paginated-table').TableContext,
  ToolTip: ({ children }) => children,
}));
jest.mock('./fileCentricCart/components/dropdown/downloadFileManifestDialog', () => () => null);
jest.mock('./fileCentricCart/utils', () => ({
  ...jest.requireActual('./fileCentricCart/utils'), downloadCsvString: jest.fn(),
}));
jest.mock('graphiql', () => jest.fn(() => null));
jest.mock('bento-components', () => ({ cn: require('classnames') }));
jest.mock('isomorphic-fetch', () => jest.fn());
jest.mock('../components/Stats/AllStatsController', () => () => null);
jest.mock('./about/aboutHeader', () => () => null);

// These are synthetic scalar search/cart responses, not Participant Overview arrays.
const files = [
  { data_file_uuid: 'test-file-1', data_file_name: 'one.vcf', drs_uri: 'drs://test/one',
    study_short_name: 'TEST', participant_id: 'test-participant', therapy_name: '[A|B, Name "quoted"]',
    therapy_string: 'must not be exported' },
  { data_file_uuid: 'test-file-2', data_file_name: 'two.pdf', drs_uri: 'drs://test/two',
    study_short_name: 'TEST', participant_id: 'test-participant', therapy_name: '[]' },
];
const names = (query) => {
  const fields = [];
  visit(query, { Field: ({ name }) => { fields.push(name.value); } });
  return fields;
};
// Ignore the CSV record terminator and keep values such as "[]" as strings.
const readManifest = (csv) => csv2json(csv.replace(/\r\n$/, ''), {
  delimiter: { eol: '\r\n' }, parseValue: (value) => value,
});
const latestGraphiQL = () => GraphiQL.mock.calls[GraphiQL.mock.calls.length - 1][0];

describe('Remaining Therapy consumers (C7)', () => {
  let container;

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
    useQuery.mockImplementation(function useMockQuery(query, options) {
      const ids = options.variables.data_file_uuid;
      React.useEffect(() => {
        options.onCompleted({ filesInList: files.filter((file) => ids.includes(file.data_file_uuid)) });
      }, [JSON.stringify(ids)]);
      return { loading: false };
    });
  });

  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    jest.restoreAllMocks();
  });

  const render = async (element) => {
    await act(async () => { ReactDOM.render(element, container); });
  };
  const renderMenu = (allFiles = true, selectedRows = [], comment = '') => render(
    <CartContext.Provider value={{ context: { cart: { comment } } }}>
      <TableContext.Provider value={{ context: { selectedRows } }}>
        <DropDownView filesId={files.map((file) => file.data_file_uuid)} allFiles={allFiles} />
      </TableContext.Provider>
    </CartContext.Provider>,
  );
  const download = async () => {
    await act(async () => { container.querySelector('button').click(); });
    const label = [...container.querySelectorAll('span')]
      .find((element) => element.childElementCount === 0 && element.textContent === 'Download File Manifest');
    expect(label).toBeDefined();
    await act(async () => { label.click(); });
  };

  it.each([
    ['[A, B]', 'A, B'], ['A|B', 'A|B'], ['[Name "quoted", B]', 'Name "quoted", B'],
    ['[]', ''], ['', ''], [null, ''], [undefined, ''],
  ])('renders scalar search Therapy %j as %j without throwing', async (value, expected) => {
    await render(<ParticipantCard index={0} data={{ participant_id: 'test-participant', therapy_name: value, targeted_therapy: 'obsolete' }} />);
    const label = [...container.querySelectorAll('h6')].find((element) => element.textContent === 'Therapy:');
    expect(label.nextElementSibling.textContent).toBe(expected);
    expect(container.textContent).not.toContain('obsolete');
  });

  it('uses the migrated participant search query while preserving search and pagination variables', async () => {
    const participants = [{ participant_id: 'test-participant', therapy_name: '[A, B]' }];
    client.query.mockResolvedValue({ data: { globalSearch: { participants } } });
    const variables = { input: 'test-participant', first: 10, offset: 20 };
    expect(await queryResultAPI('participants', variables, false)).toBe(participants);
    expect(client.query).toHaveBeenCalledWith({ query: SEARCH_PAGE_RESULT_PARTICIPANTS, variables, context: { clientName: '' } });
    expect(names(SEARCH_PAGE_RESULT_PARTICIPANTS)).toContain('therapy_name');
    expect(names(SEARCH_PAGE_RESULT_PARTICIPANTS)).not.toContain('targeted_therapy');
  });

  it.each([GET_MY_CART_DATA_QUERY, GET_MY_CART_DATA_QUERY_DESC])('requests the scalar Therapy name in each cart sort query', (query) => {
    expect(names(query)).toContain('therapy_name');
    expect(names(query)).not.toContain('targeted_therapy');
    expect(names(query)).not.toContain('therapy_string');
  });

  it('keeps both migrated cart queries wired to their sort directions', () => {
    const dispatch = jest.fn();
    const options = myFileTablePaginationOptions({ dispatch, sortBy: 'data_file_name' });
    options.customizeSortByColumn('data_file_name', 'asc');
    expect(JSON.stringify(dispatch.mock.calls[0][0])).toContain(JSON.stringify(GET_MY_CART_DATA_QUERY_DESC));
    options.customizeSortByColumn('data_file_name', 'desc');
    expect(JSON.stringify(dispatch.mock.calls[1][0])).toContain(JSON.stringify(GET_MY_CART_DATA_QUERY));
  });

  it('downloads all files with the Therapy column, scalar values, required IDs and escaped comments', async () => {
    await renderMenu(true, [], 'Review "A", then B\nSecond line');
    await download();
    const [csv, filename] = downloadCsvString.mock.calls[0];
    const exported = readManifest(csv);
    expect(filename).toMatch(/^CTDC File Manifest .*\.csv$/);
    expect(exported).toHaveLength(2);
    expect(csv.split('\r\n')[0].split(',')).toEqual(manifestData.header);
    expect(manifestData.header).toContain('Therapy');
    expect(manifestData.header).not.toContain('Targeted Therapy');
    expect(exported[0]).toEqual(expect.objectContaining({
      name: 'one.vcf', drs_uri: 'drs://test/one', study_short_name: 'TEST', participant_id: 'test-participant',
      Therapy: files[0].therapy_name, 'User Comment': 'Review "A", then B\nSecond line',
    }));
    expect(exported[1].Therapy).toBe('[]');
    expect(csv).not.toContain('must not be exported');
    expect(useQuery.mock.calls[0][1].variables).toEqual({ data_file_uuid: ['test-file-1', 'test-file-2'], first: 2 });
  });

  it('requests and exports only selected files after changing from all-file mode', async () => {
    await renderMenu();
    await renderMenu(false, ['test-file-2']);
    await download();
    const exported = readManifest(downloadCsvString.mock.calls[0][0]);
    expect(exported.map((row) => row['File ID'])).toEqual(['test-file-2']);
    expect(useQuery.mock.calls[useQuery.mock.calls.length - 1][1].variables)
      .toEqual({ data_file_uuid: ['test-file-2'], first: 1 });
  });

  it('does not download a manifest when selected-file mode has no selected rows', async () => {
    await renderMenu(false, []);
    await download();
    expect(downloadCsvString).not.toHaveBeenCalled();
  });

  it('supplies runnable GraphiQL examples and the three Therapy variables', async () => {
    await render(<GraphqlView />);
    const { query, variables } = latestGraphiQL();
    const parsedVariables = JSON.parse(variables);
    expect(parsedVariables).toEqual(expect.objectContaining({ therapy_string: [], therapy_type: [], therapy_category: [] }));
    expect(parsedVariables).not.toHaveProperty('targeted_therapy');
    const fields = names(parse(query));
    expect(fields).toContain('numberOfTherapies');
    expect(fields).not.toContain('numberOfTargetedTherapies');
    const overview = query.slice(query.indexOf('# query participantOverview(')).split('\n')
      .map((line) => line.replace(/^# ?/, '')).join('\n');
    expect(names(parse(overview))).toEqual(expect.arrayContaining(['therapy_name', 'therapy_type', 'therapy_category']));
    expect(query).not.toContain('targeted_therapy');
    expect(query).not.toContain('reported_gender');
  });

  it('sends GraphiQL Therapy variables unchanged, including an explicit empty-string selection', async () => {
    await render(<GraphqlView />);
    fetch.mockResolvedValue({ json: () => Promise.resolve({ data: { searchParticipants: { numberOfTherapies: 2 } } }) });
    const { query, fetcher } = latestGraphiQL();
    const variables = { therapy_string: ['A', 'A|B', ''], therapy_type: ['Example type'], therapy_category: ['Targeted'] };
    await fetcher({ query, variables });
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ query, variables });
  });

  it('retains cart file IDs and unrelated filters while migrating the old saved Therapy key', () => {
    const cartReducer = { filesId: ['test-file-1'], comment: 'keep this comment' };
    const before = { cartReducer, statusReducer: { filterState: { targeted_therapy_string: { A: true }, sex: { Female: true } } } };
    const migrated = migrateTherapyFilters(before);
    expect(migrated.cartReducer).toBe(cartReducer);
    expect(migrated.statusReducer.filterState).toEqual({ therapy_string: { A: true }, sex: { Female: true } });
    expect(before.statusReducer.filterState).toHaveProperty('targeted_therapy_string');
    expect(globalStatsData.find(({ statTitle }) => statTitle === 'THERAPIES').statAPI).toBe('numberOfTherapies');
  });
});
