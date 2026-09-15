import { getAuthenticatedIdp, getFileDownloadIdp } from './authUtil';

describe('getAuthenticatedIdp', () => {
  it('normalizes the persisted uppercase IDP field', () => {
    expect(getAuthenticatedIdp({ IDP: ' RAS ' })).toBe('ras');
  });

  it('supports the lowercase IdP field', () => {
    expect(getAuthenticatedIdp({ idp: 'DCF' })).toBe('dcf');
  });

  it('falls back to ras when no IdP is available', () => {
    expect(getAuthenticatedIdp()).toBe('ras');
    expect(getAuthenticatedIdp({ IDP: ' ' })).toBe('ras');
  });
});

describe('getFileDownloadIdp', () => {
  it('uses the RAS file path only for RAS logins', () => {
    expect(getFileDownloadIdp({ IDP: ' RAS ' })).toBe('ras');
    expect(getFileDownloadIdp({ idp: 'ras' })).toBe('ras');
  });

  it('uses the default file path for non-RAS or unknown logins', () => {
    expect(getFileDownloadIdp({ IDP: 'DCF' })).toBe('');
    expect(getFileDownloadIdp({ IDP: 'NIH' })).toBe('');
    expect(getFileDownloadIdp()).toBe('');
  });
});
