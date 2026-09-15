import env from '../../utils/env';
import { buildFileServiceUrl, fetchFileToDownload } from './DocumentDownloadView';

describe('buildFileServiceUrl', () => {
  beforeEach(() => {
    env.REACT_APP_FILE_SERVICE_API = 'https://files.example.org/api/files/';
  });

  it('builds the standard file-service UUID path when no idp is provided', () => {
    expect(buildFileServiceUrl({ fileId: 'file-uuid-123' }))
      .toBe('https://files.example.org/api/files/file-uuid-123');
  });

  it('preserves GUID prefix and UUID as separate path segments', () => {
    expect(buildFileServiceUrl({ fileId: 'dg.4DFC/file-uuid-123' }))
      .toBe('https://files.example.org/api/files/dg.4DFC/file-uuid-123');
  });

  it('builds the RAS path when an idp is provided', () => {
    expect(buildFileServiceUrl({
      fileId: 'dg.4DFC/file-uuid-123',
      studyAccession: 'phs000000.v1.p1',
      idp: 'ras',
    })).toBe('https://files.example.org/api/files/ras/phs000000.v1.p1/dg.4DFC/file-uuid-123');
  });

  it('builds the RAS path for a bare UUID', () => {
    expect(buildFileServiceUrl({
      fileId: 'file-uuid-123',
      studyAccession: 'phs000000.v1.p1',
      idp: 'ras',
    })).toBe('https://files.example.org/api/files/ras/phs000000.v1.p1/file-uuid-123');
  });

  it('builds the RAS path without study accession when only IDP is available', () => {
    expect(buildFileServiceUrl({
      fileId: 'dg.4DFC/file-uuid-123',
      studyAccession: '',
      idp: 'ras',
    })).toBe('https://files.example.org/api/files/ras/dg.4DFC/file-uuid-123');
  });
});

describe('fetchFileToDownload', () => {
  const originalFetch = global.fetch;
  let clickMock;
  let consoleErrorSpy;
  let createdLink;
  let createElementSpy;

  const createDownloadOptions = (overrides = {}) => ({
    fileId: 'dg.4DFC/file-uuid-123',
    signOut: jest.fn(),
    setShowModal: jest.fn(),
    fileName: 'test-file.txt',
    fileFormat: 'txt',
    showUnauthorizedNotification: jest.fn(),
    ...overrides,
  });

  const mockFetchResponse = ({ status = 200, statusText = 'OK', body = '' }) => {
    global.fetch.mockResolvedValue({
      status,
      statusText,
      text: jest.fn().mockResolvedValue(body),
    });
  };

  beforeEach(() => {
    env.REACT_APP_FILE_SERVICE_API = 'https://files.example.org/api/files/';
    global.fetch = jest.fn();
    clickMock = jest.fn();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const createElement = document.createElement.bind(document);
    createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation((tagName, options) => {
        const element = createElement(tagName, options);

        if (tagName === 'a') {
          createdLink = element;
          jest.spyOn(element, 'click').mockImplementation(clickMock);
        }

        return element;
      });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
    createdLink = undefined;
  });

  it('downloads a raw signed URL string response', async () => {
    mockFetchResponse({
      body: 'https://signed-url.example/file.txt',
    });

    await fetchFileToDownload(createDownloadOptions());

    expect(global.fetch).toHaveBeenCalledWith(
      'https://files.example.org/api/files/dg.4DFC/file-uuid-123',
      { method: 'GET' },
    );
    expect(createdLink.href).toBe('https://signed-url.example/file.txt');
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('downloads a JSON url response', async () => {
    mockFetchResponse({
      body: JSON.stringify({ url: 'https://signed-url.example/file.txt' }),
    });

    await fetchFileToDownload(createDownloadOptions());

    expect(createdLink.href).toBe('https://signed-url.example/file.txt');
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('does not download an invalid response body', async () => {
    mockFetchResponse({
      body: 'not-a-url',
    });

    await fetchFileToDownload(createDownloadOptions());

    expect(createElementSpy).not.toHaveBeenCalledWith('a');
    expect(clickMock).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'Missing File URL');
  });

  it('signs out and opens the timeout modal for forbidden responses', async () => {
    const options = createDownloadOptions();
    mockFetchResponse({
      status: 403,
      statusText: 'Forbidden',
    });

    await fetchFileToDownload(options);

    expect(options.signOut).toHaveBeenCalledTimes(1);
    expect(options.setShowModal).toHaveBeenCalledWith(true);
    expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
  });

  it('shows the unauthorized notification for unauthorized responses', async () => {
    const options = createDownloadOptions();
    mockFetchResponse({
      status: 401,
      statusText: 'Unauthorized',
    });

    await fetchFileToDownload(options);

    expect(options.showUnauthorizedNotification).toHaveBeenCalledTimes(1);
    expect(options.signOut).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
  });

  it('shows the unauthorized notification for other non-200 responses', async () => {
    const options = createDownloadOptions();
    mockFetchResponse({
      status: 500,
      statusText: 'Server Error',
    });

    await fetchFileToDownload(options);

    expect(options.showUnauthorizedNotification).toHaveBeenCalledTimes(1);
    expect(options.signOut).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
  });
});
