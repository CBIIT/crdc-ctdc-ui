import { getAuthenticatedIdp } from './authUtil';

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
