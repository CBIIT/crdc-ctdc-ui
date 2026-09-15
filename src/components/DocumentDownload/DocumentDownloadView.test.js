import env from '../../utils/env';
import { buildFileServiceUrl } from './DocumentDownloadView';

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
