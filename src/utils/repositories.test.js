import axios from 'axios';
import { getImageCollectionRepositories, loadRepositoryConfig, parseRepositoryConfig } from './repositories';

jest.mock('axios', () => ({ get: jest.fn() }));

const config = `repositories:
  - repository_name: TCIA
    repository_url: https://nbia.cancerimagingarchive.net/
    aliases: [The Cancer Imaging Archive]
  - repository_name: IDC
    repository_url: https://portal.imaging.datacommons.cancer.gov/
    aliases: [Imaging Data Commons]
`;

afterEach(() => { jest.clearAllMocks(); });

it('matches aliases and case, deduplicates parents, and preserves source data', () => {
  const collections = Object.freeze([
    Object.freeze({ repository_name: ' The Cancer Imaging Archive ', image_collection_name: 'AREN0532', image_collection_url: 'https://doi.org/10.7937/6PJ1-M859' }),
    { repository_name: 'tcia' },
    { repository_name: 'Imaging Data Commons' },
    { repository_name: ' IDC ' },
  ]);
  expect(getImageCollectionRepositories(collections, parseRepositoryConfig(config))).toEqual([
    { repository_name: 'TCIA', repository_url: 'https://nbia.cancerimagingarchive.net/' },
    { repository_name: 'IDC', repository_url: 'https://portal.imaging.datacommons.cancer.gov/' },
  ]);
  expect(collections[0].repository_name).toBe(' The Cancer Imaging Archive ');
});

it('preserves unknown names without using collection URLs, including case-insensitive duplicates', () => {
  expect(getImageCollectionRepositories([
    { repository_name: ' New Archive ', image_collection_url: 'https://example.org/collection' },
    { repository_name: 'new archive' },
  ], parseRepositoryConfig(config))).toEqual([{ repository_name: 'New Archive', repository_url: null }]);
});

it('supports a newly configured repository without a hardcoded frontend mapping', () => {
  const lookup = parseRepositoryConfig(`repositories:
  - repository_name: NEW
    repository_url: https://example.org/
    aliases: [New Archive]
`);
  expect(getImageCollectionRepositories([{ repository_name: 'new archive' }], lookup))
    .toEqual([{ repository_name: 'NEW', repository_url: 'https://example.org/' }]);
});

it('allows configured names without URLs', () => {
  const lookup = parseRepositoryConfig('repositories: [{repository_name: NEW, aliases: [New Archive]}]');
  expect(getImageCollectionRepositories([{ repository_name: 'New Archive' }], lookup))
    .toEqual([{ repository_name: 'NEW', repository_url: null }]);
});

it('shows source names without links when configuration is absent', () => {
  expect(getImageCollectionRepositories([{ repository_name: 'The Cancer Imaging Archive' }]))
    .toEqual([{ repository_name: 'The Cancer Imaging Archive', repository_url: null }]);
});

it.each([null, undefined, {}, [null, {}, { repository_name: null }, { repository_name: ' ' }, { repository_name: 123 }]])(
  'omits missing or malformed collection names: %p', (collections) => {
    expect(getImageCollectionRepositories(collections)).toEqual([]);
  },
);

it('rejects ambiguous aliases rather than assigning an incorrect link', () => {
  expect(() => parseRepositoryConfig(`repositories:
  - repository_name: A
    aliases: [Shared Name]
  - repository_name: B
    aliases: [shared name]
`)).toThrow(/Conflicting repository/);
});

// Exercise rejection of executable URLs from external configuration.
// eslint-disable-next-line no-script-url
it.each(['javascript:alert(1)', '/relative', 'https://user:password@example.org/'])(
  'rejects an unsafe or non-absolute URL: %s', (url) => {
    expect(() => parseRepositoryConfig(`repositories:\n  - repository_name: A\n    repository_url: ${url}`)).toThrow();
  },
);

it.each(['<html>Not found</html>', '{}', 'repositories: {}', 'repositories: [null]',
  'repositories: [{repository_name: " "}]', 'repositories: [{repository_name: A, aliases: invalid}]',
  'repositories: []\nrepositories: []'])(
  'rejects malformed configuration: %s', (content) => {
    expect(() => parseRepositoryConfig(content)).toThrow();
  },
);

it('fetches the environment-specific YAML with a bounded timeout', async () => {
  axios.get.mockResolvedValue({ data: config });
  const lookup = await loadRepositoryConfig('https://static.example.org/qa/');
  expect(axios.get).toHaveBeenCalledWith('https://static.example.org/qa/repositories/repositories.yml', { timeout: 10000 });
  expect(lookup.get('tcia').repository_name).toBe('TCIA');
});

// The deployed environment can contain an unresolved substitution placeholder.
// eslint-disable-next-line no-template-curly-in-string
it.each([undefined, '', ' ', '${REACT_APP_STATIC_CONTENT_URL}'])(
  'does not request a missing or unresolved static-content base URL: %s', async (baseUrl) => {
    expect((await loadRepositoryConfig(baseUrl)).size).toBe(0);
    expect(axios.get).not.toHaveBeenCalled();
  },
);
