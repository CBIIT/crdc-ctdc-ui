import axios from 'axios';
import env from '../../utils/env';
import { MAX_BLOB_SIZE } from '../../bento/siteWideConfig';
import { buildFileServiceUrl, fetchFileToDownload } from './downloadUtils';

jest.mock('axios');

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
  const originalCreateObjectURL = window.URL.createObjectURL;
  const originalRevokeObjectURL = window.URL.revokeObjectURL;
  const signedUrl = 'https://signed-url.example/object?X-Amz-Signature=abc%2F123&X-Amz-Expires=60';
  const blobUrl = 'blob:http://localhost/download-id';
  let clickMock;
  let consoleErrorSpy;
  let consoleWarnSpy;
  let createdLink;
  let openSpy;
  let fileBlob;

  const createDownloadOptions = (overrides = {}) => ({
    fileId: 'dg.4DFC/file-uuid-123',
    signOut: jest.fn(),
    setShowModal: jest.fn(),
    fileName: 'test-file.txt',
    fileFormat: 'txt',
    fileSize: 1024,
    showUnauthorizedNotification: jest.fn(),
    showDownloadErrorNotification: jest.fn(),
    ...overrides,
  });

  const mockFetchResponse = ({ status = 200, statusText = 'OK', body = signedUrl } = {}) => {
    global.fetch.mockResolvedValue({
      status,
      statusText,
      text: jest.fn().mockResolvedValue(body),
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    env.REACT_APP_FILE_SERVICE_API = 'https://files.example.org/api/files/';
    global.fetch = jest.fn();
    fileBlob = new Blob(['file contents'], { type: 'text/plain' });
    axios.mockResolvedValue({ data: fileBlob });
    window.URL.createObjectURL = jest.fn().mockReturnValue(blobUrl);
    window.URL.revokeObjectURL = jest.fn();
    clickMock = jest.fn();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});

    const createElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      const element = createElement(tagName, options);
      if (tagName === 'a') {
        createdLink = element;
        jest.spyOn(element, 'click').mockImplementation(clickMock);
      }
      return element;
    });
  });

  afterEach(() => {
    expect(openSpy).not.toHaveBeenCalled();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    axios.mockReset();
    global.fetch = originalFetch;
    if (originalCreateObjectURL === undefined) {
      delete window.URL.createObjectURL;
    } else {
      window.URL.createObjectURL = originalCreateObjectURL;
    }
    if (originalRevokeObjectURL === undefined) {
      delete window.URL.revokeObjectURL;
    } else {
      window.URL.revokeObjectURL = originalRevokeObjectURL;
    }
    createdLink = undefined;
  });

  it.each([
    ['raw URL', signedUrl],
    ['JSON string', JSON.stringify(signedUrl)],
    ['JSON url', JSON.stringify({ url: signedUrl })],
    ['JSON presigned_url', JSON.stringify({ presigned_url: signedUrl })],
    ['JSON fileURL', JSON.stringify({ fileURL: signedUrl })],
  ])('downloads a viewable file from a %s response', async (_, body) => {
    mockFetchResponse({ body });

    const options = createDownloadOptions();
    await fetchFileToDownload(options);

    expect(options.showDownloadErrorNotification).not.toHaveBeenCalled();
    expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://files.example.org/api/files/dg.4DFC/file-uuid-123',
      { method: 'GET' },
    );
    expect(axios).toHaveBeenCalledWith({
      url: signedUrl,
      method: 'GET',
      responseType: 'blob',
    });
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(fileBlob);
    expect(createdLink.href).toBe(blobUrl);
    expect(createdLink.download).toBe('test-file.txt');
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it.each([
    'pdf', 'txt', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'html', 'xml', 'json',
  ])('downloads %s as a blob without navigating away or changing the signed URL', async (fileFormat) => {
    mockFetchResponse();

    await fetchFileToDownload(createDownloadOptions({ fileFormat, fileName: 'report' }));

    expect(axios).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith({
      url: signedUrl,
      method: 'GET',
      responseType: 'blob',
    });
    expect(createdLink.href).toBe(blobUrl);
    expect(createdLink.download).toBe(`report.${fileFormat}`);
    expect(createdLink.target).toBe('');
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(document.body.contains(createdLink)).toBe(false);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it.each([
    ['PDF', 'report.pdf'],
    ['.pdf', 'report.pdf'],
    [' .PDF ', 'report.pdf'],
    [' TXT ', 'report.txt'],
  ])('normalizes format metadata: %s', async (fileFormat, expectedName) => {
    mockFetchResponse();

    await fetchFileToDownload(createDownloadOptions({ fileFormat, fileName: 'report' }));

    expect(axios).toHaveBeenCalledTimes(1);
    expect(createdLink.download).toBe(expectedName);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it.each([
    ['report.pdf', 'report.pdf'],
    ['report.PDF', 'report.PDF'],
    [' report.PDF ', 'report.PDF'],
    ['archive.zip', 'archive.zip.pdf'],
    ['', 'download.pdf'],
    [undefined, 'download.pdf'],
    [null, 'download.pdf'],
    [123, 'download.pdf'],
  ])('handles the download filename %j', async (fileName, expectedName) => {
    mockFetchResponse();

    await fetchFileToDownload(createDownloadOptions({ fileFormat: 'pdf', fileName }));

    expect(createdLink.download).toBe(expectedName);
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it.each([0, MAX_BLOB_SIZE - 1, MAX_BLOB_SIZE, String(MAX_BLOB_SIZE)])(
    'uses a Blob for viewable files within the byte limit: %j',
    async (fileSize) => {
      mockFetchResponse();

      await fetchFileToDownload(createDownloadOptions({ fileSize, fileFormat: 'pdf' }));

      expect(axios).toHaveBeenCalledTimes(1);
      expect(createdLink.href).toBe(blobUrl);
      expect(createdLink.target).toBe('');
      expect(createdLink.hasAttribute('download')).toBe(true);
    },
  );

  it.each([MAX_BLOB_SIZE + 1, 1024 ** 3, String(MAX_BLOB_SIZE + 1)])(
    'opens oversized viewable files in a new tab without fetching a Blob: %j',
    async (fileSize) => {
      mockFetchResponse();

      await fetchFileToDownload(createDownloadOptions({ fileSize, fileFormat: ' .PDF ' }));

      expect(axios).not.toHaveBeenCalled();
      expect(window.URL.createObjectURL).not.toHaveBeenCalled();
      expect(createdLink.getAttribute('href')).toBe(signedUrl);
      expect(createdLink.target).toBe('_blank');
      expect(createdLink.rel).toBe('noopener noreferrer');
      expect(createdLink.hasAttribute('download')).toBe(false);
      expect(clickMock).toHaveBeenCalledTimes(1);
      expect(document.body.contains(createdLink)).toBe(false);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    },
  );

  it.each([undefined, null, '', '   ', '50 MB', -1, 1.5, NaN, Infinity, false, {}, [1024]])(
    'uses the new-tab fallback for unknown or invalid viewable file sizes: %j',
    async (fileSize) => {
      mockFetchResponse();

      await fetchFileToDownload(createDownloadOptions({ fileSize }));

      expect(axios).not.toHaveBeenCalled();
      expect(window.URL.createObjectURL).not.toHaveBeenCalled();
      expect(createdLink.getAttribute('href')).toBe(signedUrl);
      expect(createdLink.target).toBe('_blank');
      expect(createdLink.rel).toBe('noopener noreferrer');
      expect(clickMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    },
  );

  it.each([MAX_BLOB_SIZE + 1, undefined])(
    'keeps non-viewable files in the current page regardless of size: %j',
    async (fileSize) => {
      mockFetchResponse();

      await fetchFileToDownload(createDownloadOptions({ fileSize, fileFormat: 'zip' }));

      expect(axios).not.toHaveBeenCalled();
      expect(createdLink.getAttribute('href')).toBe(signedUrl);
      expect(createdLink.target).toBe('');
      expect(createdLink.rel).toBe('');
      expect(clickMock).toHaveBeenCalledTimes(1);
    },
  );

  it('waits for the blob request to finish before triggering the download', async () => {
    mockFetchResponse();
    let resolveBlob;
    axios.mockImplementation(() => new Promise((resolve) => { resolveBlob = resolve; }));

    const pendingDownload = fetchFileToDownload(createDownloadOptions());
    await Promise.resolve();
    await Promise.resolve();

    expect(axios).toHaveBeenCalledTimes(1);
    expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
    resolveBlob({ data: fileBlob });
    await pendingDownload;

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(fileBlob);
    expect(clickMock).toHaveBeenCalledTimes(1);
  });

  it('removes the link and releases its blob URL after the download starts', async () => {
    mockFetchResponse();

    await fetchFileToDownload(createDownloadOptions());

    expect(document.body.contains(createdLink)).toBe(false);
    expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
    jest.runOnlyPendingTimers();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(blobUrl);
  });

  it('cleans up the blob and link if triggering the download throws', async () => {
    mockFetchResponse();
    clickMock.mockImplementation(() => { throw new Error('Download failed'); });

    const options = createDownloadOptions();
    await fetchFileToDownload(options);

    expect(options.showDownloadErrorNotification).toHaveBeenCalledTimes(1);
    expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();

    expect(document.body.contains(createdLink)).toBe(false);
    jest.runOnlyPendingTimers();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(blobUrl);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'Download failed');
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(createdLink.href).toBe(blobUrl);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('shows the general notification if creating the Blob URL fails', async () => {
    mockFetchResponse();
    window.URL.createObjectURL.mockImplementation(() => { throw new Error('Blob URL failed'); });
    const options = createDownloadOptions();

    await fetchFileToDownload(options);

    expect(options.showDownloadErrorNotification).toHaveBeenCalledTimes(1);
    expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
    expect(document.body.contains(createdLink)).toBe(false);
    expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'Blob URL failed');
  });

  it('tries the unchanged signed URL in a protected new tab when the Blob request has no response', async () => {
    mockFetchResponse();
    const error = Object.assign(new Error('Network Error'), { request: { status: 0 } });
    axios.mockRejectedValue(error);
    const options = createDownloadOptions({ fileFormat: 'pdf' });

    await fetchFileToDownload(options);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith({ url: signedUrl, method: 'GET', responseType: 'blob' });
    expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
    expect(createdLink.getAttribute('href')).toBe(signedUrl);
    expect(createdLink.target).toBe('_blank');
    expect(createdLink.rel).toBe('noopener noreferrer');
    expect(createdLink.hasAttribute('download')).toBe(false);
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(document.body.contains(createdLink)).toBe(false);
    expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();
    expect(options.showDownloadErrorNotification).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Blob request failed; trying the signed URL in a new tab.', 'Network Error',
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('cleans up and stops if clicking the fallback link throws', async () => {
    mockFetchResponse();
    axios.mockRejectedValue(Object.assign(new Error('Network Error'), { request: { status: 0 } }));
    clickMock.mockImplementation(() => { throw new Error('Fallback failed'); });

    const options = createDownloadOptions();
    await fetchFileToDownload(options);

    expect(options.showDownloadErrorNotification).toHaveBeenCalledTimes(1);
    expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();

    expect(axios).toHaveBeenCalledTimes(1);
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(createdLink.target).toBe('_blank');
    expect(document.body.contains(createdLink)).toBe(false);
    expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'Fallback failed');
  });

  it.each([401, 403, 404, 500])(
    'does not fall back or save an error response when the Blob request returns HTTP %s',
    async (status) => {
      mockFetchResponse();
      const message = `Request failed with status code ${status}`;
      const error = Object.assign(new Error(message), {
        request: { status },
        response: { status, data: new Blob(['Error response']) },
      });
      axios.mockRejectedValue(error);

      const options = createDownloadOptions();
      await fetchFileToDownload(options);

      expect(options.showDownloadErrorNotification).toHaveBeenCalledTimes(1);
      expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();

      expect(window.URL.createObjectURL).not.toHaveBeenCalled();
      expect(createdLink).toBeUndefined();
      expect(clickMock).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', message);
    },
  );

  it('does not fall back when setting up the Blob request fails', async () => {
    mockFetchResponse();
    axios.mockRejectedValue(new Error('Invalid request configuration'));

    const options = createDownloadOptions();
    await fetchFileToDownload(options);

    expect(options.showDownloadErrorNotification).toHaveBeenCalledTimes(1);
    expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();

    expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    expect(createdLink).toBeUndefined();
    expect(clickMock).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'Invalid request configuration');
  });

  it.each(['', '   ', undefined, null, 123, false, {}, ['pdf']])(
    'uses direct navigation for missing or non-string formats: %j',
    async (fileFormat) => {
      const url = 'https://signed-url.example/report.pdf?X-Amz-Signature=abc%2F123';
      mockFetchResponse({ body: JSON.stringify({ url }) });

      await fetchFileToDownload(createDownloadOptions({ fileFormat, fileName: 'report.pdf' }));

      expect(axios).not.toHaveBeenCalled();
      expect(createdLink.getAttribute('href')).toBe(url);
      expect(createdLink.target).toBe('');
      expect(createdLink.hasAttribute('download')).toBe(false);
      expect(clickMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    },
  );

  it.each(['.', '..pdf', '. pdf', 'application/pdf', 'unknown', 'pdf/zip'])(
    'keeps direct navigation for an unrecognized format: %s',
    async (fileFormat) => {
      mockFetchResponse({ body: 'https://signed-url.example/report.pdf' });

      await fetchFileToDownload(createDownloadOptions({ fileFormat, fileName: 'report.pdf' }));

      expect(axios).not.toHaveBeenCalled();
      expect(createdLink.href).toBe('https://signed-url.example/report.pdf');
      expect(createdLink.target).toBe('');
      expect(clickMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    },
  );

  it.each(['zip', 'csv', 'bam', 'gz'])('keeps normal download handling for %s files', async (fileFormat) => {
    mockFetchResponse();

    await fetchFileToDownload(createDownloadOptions({ fileFormat, fileName: `data.${fileFormat}` }));

    expect(axios).not.toHaveBeenCalled();
    expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    expect(createdLink.getAttribute('href')).toBe(signedUrl);
    expect(createdLink.target).toBe('');
    expect(createdLink.rel).toBe('');
    expect(createdLink.hasAttribute('download')).toBe(false);
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(document.body.contains(createdLink)).toBe(false);
  });

  it('uses only fileFormat when the filename and URL suggest a different format', async () => {
    mockFetchResponse({ body: 'https://signed-url.example/report.pdf' });

    await fetchFileToDownload(createDownloadOptions({ fileFormat: 'zip', fileName: 'report.pdf' }));

    expect(axios).not.toHaveBeenCalled();
    expect(createdLink.href).toBe('https://signed-url.example/report.pdf');
    expect(createdLink.target).toBe('');
    expect(clickMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    'https://signed-url.example/folder.pdf/opaque-object?filename=report.pdf',
    'https://signed-url.example/opaque-object#report.pdf',
    'https://signed-url.example/report.pdf',
  ])('does not infer the format from the signed URL: %s', async (url) => {
    mockFetchResponse({ body: url });

    await fetchFileToDownload(createDownloadOptions({ fileName: '', fileFormat: '' }));

    expect(axios).not.toHaveBeenCalled();
    expect(createdLink.getAttribute('href')).toBe(url);
    expect(createdLink.target).toBe('');
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it.each(['fetch', 'body'])('does not download if reading the %s fails', async (stage) => {
    const error = new Error('Network error');
    if (stage === 'fetch') {
      global.fetch.mockRejectedValue(error);
    } else {
      global.fetch.mockResolvedValue({ status: 200, text: jest.fn().mockRejectedValue(error) });
    }

    const options = createDownloadOptions();
    await fetchFileToDownload(options);

    expect(options.showDownloadErrorNotification).toHaveBeenCalledTimes(1);
    expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();

    expect(axios).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', error.message);
  });

  it.each(['not-a-url', '', '{"url":null}'])('does not download an invalid URL response: %s', async (body) => {
    mockFetchResponse({ body });

    const options = createDownloadOptions();
    await fetchFileToDownload(options);

    expect(options.showDownloadErrorNotification).toHaveBeenCalledTimes(1);
    expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();

    expect(axios).not.toHaveBeenCalled();
    expect(createdLink).toBeUndefined();
    expect(clickMock).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'Missing File URL');
  });

  it.each([
    [401, 'Unauthorized'],
    [403, 'Forbidden'],
  ])('shows the existing access notification for a %s file-service response', async (status, statusText) => {
    const options = createDownloadOptions();
    mockFetchResponse({ status, statusText });

    await fetchFileToDownload(options);

    expect(options.showUnauthorizedNotification).toHaveBeenCalledTimes(1);
    expect(options.showDownloadErrorNotification).not.toHaveBeenCalled();
    expect(options.signOut).not.toHaveBeenCalled();
    expect(options.setShowModal).not.toHaveBeenCalled();
    expect(axios).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
  });

  it.each([
    [204, 'No Content'],
    [400, 'Bad Request'],
    [404, 'Not Found'],
    [500, 'Server Error'],
    [503, 'Service Unavailable'],
  ])('shows only the general download notification for a %s file-service response', async (status, statusText) => {
    const options = createDownloadOptions();
    mockFetchResponse({ status, statusText });

    await fetchFileToDownload(options);

    expect(options.showDownloadErrorNotification).toHaveBeenCalledTimes(1);
    expect(options.showUnauthorizedNotification).not.toHaveBeenCalled();
    expect(axios).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error:',
      `Failed to fetch the file from "${options.fileId}". Server responded with: ${status} (${statusText})`,
    );
  });
});
