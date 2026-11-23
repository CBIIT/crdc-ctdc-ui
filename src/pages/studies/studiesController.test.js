import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { useQuery } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import env from '../../utils/env';
import StudiesContainer from './studiesController';
import Studies from './studiesView';
import { GET_STUDY_DATA_QUERY, pageData } from '../../bento/studiesData';
import { convertToCSV } from '../../components/PaginatedTable/utils';

jest.mock('@apollo/client', () => ({ useQuery: jest.fn() }));
jest.mock('axios', () => ({ get: jest.fn() }));
jest.mock('../../utils/env', () => ({ __esModule: true, default: { REACT_APP_STATIC_CONTENT_URL: '' } }));
jest.mock('./studiesView', () => jest.fn(() => null));
jest.mock('../../bento-core', () => ({ cellTypes: {}, headerTypes: {}, formatBytes: String }));
jest.mock('../../components/Wrappers/Wrappers', () => ({
  Typography: ({ children }) => require('react').createElement('span', null, children),
}));

const repositoryConfig = `repositories:
  - repository_name: TCIA
    repository_url: https://nbia.cancerimagingarchive.net/
    aliases: [The Cancer Imaging Archive]
`;
let container;
const render = async (path = '/studies') => {
  await act(async () => { ReactDOM.render(<MemoryRouter initialEntries={[path]}><StudiesContainer /></MemoryRouter>, container); });
};
const getRows = () => Studies.mock.calls[Studies.mock.calls.length - 1][0].data.getAllStudies;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  env.REACT_APP_STATIC_CONTENT_URL = 'https://static.example.org/qa/';
  axios.get.mockResolvedValue({ data: repositoryConfig });
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

it.each(['NCT00352534', 'NCT00533949', 'NCT00946712', 'NCT01026220', 'NCT00980460'])(
  'resolves %s from its study image collections and external YAML',
  async (studyId) => {
    const study = {
      study_id: studyId,
      image_collection_count: 1,
      image_collection: [{ repository_name: 'The Cancer Imaging Archive' }],
    };
    useQuery.mockReturnValue({ data: { getAllStudies: [study] } });
    await render();

    expect(useQuery).toHaveBeenCalledWith(GET_STUDY_DATA_QUERY);
    expect(useQuery.mock.calls.every(([query]) => query === GET_STUDY_DATA_QUERY)).toBe(true);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('https://static.example.org/qa/repositories/repositories.yml', { timeout: 10000 });
    const row = getRows()[0];
    expect(row.unique_repository).toEqual(['TCIA']);
    expect(row.repositories).toEqual([{
      repository_name: 'TCIA', repository_url: 'https://nbia.cancerimagingarchive.net/',
    }]);
    expect(row.image_collection_count).toBe(1);
    expect(study.unique_repository).toBeUndefined();
    const { keysToInclude, header } = pageData.table.extendedViewConfig.download;
    expect(convertToCSV([row], keysToInclude, header)).toContain('"TCIA"');
  },
);

it('queries repository names from image_collection without the derived backend field or interop', () => {
  const query = GET_STUDY_DATA_QUERY.loc.source.body;
  expect(query).toMatch(/image_collection\s*\{\s*repository_name\s*\}/);
  expect(query).not.toMatch(/getInteropData|repository_url|repositories\s*\{/);
});

it('deduplicates the CMB collection repositories without changing its collection or file counts', async () => {
  axios.get.mockResolvedValue({ data: `${repositoryConfig}
  - repository_name: IDC
    repository_url: https://portal.imaging.datacommons.cancer.gov/
` });
  useQuery.mockReturnValue({ data: { getAllStudies: [{
    study_id: 'NCT04314401',
    participant_file_count: 3209,
    study_file_count: 3,
    image_collection_count: 12,
    image_collection: Array.from({ length: 6 }, () => [
      { repository_name: 'TCIA' }, { repository_name: 'IDC' },
    ]).flat(),
  }] } });
  await render();
  const row = getRows()[0];
  expect(row.unique_repository).toEqual(['TCIA', 'IDC']);
  expect(row.repositories).toEqual([
    { repository_name: 'TCIA', repository_url: 'https://nbia.cancerimagingarchive.net/' },
    { repository_name: 'IDC', repository_url: 'https://portal.imaging.datacommons.cancer.gov/' },
  ]);
  expect(row).toEqual(expect.objectContaining({
    participant_file_count: 3209, study_file_count: 3, image_collection_count: 12,
  }));
  const { keysToInclude, header } = pageData.table.extendedViewConfig.download;
  expect(convertToCSV([row], keysToInclude, header)).toContain('"3209","3","12","Not Applicable","TCIA, IDC"');
});

it('leaves the indicator empty when collection metadata contains no repository', async () => {
  useQuery.mockReturnValue({ data: { getAllStudies: [{
    study_id: 'NO_REPOSITORY', image_collection: [{ repository_name: null }],
  }] } });
  await render();
  expect(getRows()[0].repositories).toEqual([]);
  expect(getRows()[0].unique_repository).toEqual([]);
});

it('keeps studies visible while configuration is pending, then adds configured links', async () => {
  let finishLoading;
  axios.get.mockReturnValue(new Promise((resolve) => { finishLoading = resolve; }));
  useQuery.mockReturnValue({ data: { getAllStudies: [{
    image_collection: [{ repository_name: 'The Cancer Imaging Archive' }],
  }] } });
  await render();
  expect(getRows()[0].repositories).toEqual([{
    repository_name: 'The Cancer Imaging Archive', repository_url: null,
  }]);
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  await act(async () => { finishLoading({ data: repositoryConfig }); });
  expect(getRows()[0].unique_repository).toEqual(['TCIA']);
  expect(getRows()[0].repositories[0].repository_url).toBe('https://nbia.cancerimagingarchive.net/');
});

it.each(['download failure', 'invalid YAML'])('shows source names without links on %s', async (failure) => {
  if (failure === 'download failure') axios.get.mockRejectedValue(new Error('Timed out'));
  else axios.get.mockResolvedValue({ data: 'repositories: [invalid' });
  useQuery.mockReturnValue({ data: { getAllStudies: [{
    image_collection: [{ repository_name: 'The Cancer Imaging Archive', image_collection_url: 'https://example.org/collection' }],
  }] } });
  await render();
  expect(getRows()[0].repositories).toEqual([{
    repository_name: 'The Cancer Imaging Archive', repository_url: null,
  }]);
  expect(getRows()[0].unique_repository).toEqual(['The Cancer Imaging Archive']);
  expect(console.warn).toHaveBeenCalled();
});

it('supports a new repository through static content without another frontend mapping', async () => {
  axios.get.mockResolvedValue({ data: `repositories:
  - repository_name: NEW
    repository_url: https://example.org/
    aliases: [New Archive]
` });
  useQuery.mockReturnValue({ data: { getAllStudies: [{ image_collection: [{ repository_name: 'New Archive' }] }] } });
  await render();
  expect(getRows()[0].repositories).toEqual([{ repository_name: 'NEW', repository_url: 'https://example.org/' }]);
});

it('preserves unknown names without links, including in CSV', async () => {
  useQuery.mockReturnValue({ data: { getAllStudies: [{ image_collection: [{ repository_name: 'New Archive' }] }] } });
  await render();
  const row = getRows()[0];
  expect(row.repositories).toEqual([{ repository_name: 'New Archive', repository_url: null }]);
  expect(row.unique_repository).toEqual(['New Archive']);
  const { keysToInclude, header } = pageData.table.extendedViewConfig.download;
  expect(convertToCSV([row], keysToInclude, header)).toContain('"New Archive"');
});

it('shows source names when the static-content URL is not configured', async () => {
  env.REACT_APP_STATIC_CONTENT_URL = '';
  useQuery.mockReturnValue({ data: { getAllStudies: [{ image_collection: [{ repository_name: 'TCIA' }] }] } });
  await render();
  expect(axios.get).not.toHaveBeenCalled();
  expect(getRows()[0].repositories).toEqual([{ repository_name: 'TCIA', repository_url: null }]);
});

it('ignores a configuration response arriving after unmount', async () => {
  let finishLoading;
  axios.get.mockReturnValue(new Promise((resolve) => { finishLoading = resolve; }));
  useQuery.mockReturnValue({ data: { getAllStudies: [] } });
  await render();
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  Studies.mockClear();
  await act(async () => { finishLoading({ data: repositoryConfig }); });
  expect(Studies).not.toHaveBeenCalled();
});

it('shows the study query error instead of an indefinite loading spinner', async () => {
  useQuery.mockReturnValue({ error: new Error('Unable to load studies') });
  await render();
  expect(screen.getByText(/Unable to load studies/)).toBeInTheDocument();
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  expect(Studies).not.toHaveBeenCalled();
});

it('shows loading only while the study query is pending', async () => {
  useQuery.mockReturnValue({ loading: true });
  await render();
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  expect(Studies).not.toHaveBeenCalled();
});

it('renders a successful empty study list', async () => {
  useQuery.mockReturnValue({ data: { getAllStudies: [] } });
  await render();
  expect(getRows()).toEqual([]);
});

it('filters enriched study rows by portfolio study short names', async () => {
  useQuery.mockReturnValue({ data: { getAllStudies: [
    { study_id: 'one', study_short_name: 'FIRST', image_collection: [{ repository_name: 'The Cancer Imaging Archive' }] },
    { study_id: 'two', study_short_name: 'SECOND' },
  ] } });
  await render('/studies?studyIds=FIRST');
  expect(getRows()).toHaveLength(1);
  expect(getRows()[0]).toEqual(expect.objectContaining({ study_id: 'one', unique_repository: ['TCIA'] }));
});

it.each([null, undefined, {}])('shows unavailable data when the study list is missing: %p', async (data) => {
  useQuery.mockReturnValue({ data });
  await render();
  expect(screen.getByText('Study data is unavailable.')).toBeInTheDocument();
});
