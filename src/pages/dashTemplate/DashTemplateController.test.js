jest.mock('../../utils/graphqlClient', () => ({
  client: { query: jest.fn(), mutate: jest.fn() },
}));

import { buildParticipantIdFilter } from './DashTemplateController';

describe('buildParticipantIdFilter', () => {
  it('returns autocomplete selections only', () => {
    expect(buildParticipantIdFilter([], [{ title: 'MSB-01068' }])).toEqual(['MSB-01068']);
  });

  it('returns upload selections only', () => {
    expect(buildParticipantIdFilter([{ subject_id: 'MSB-00140' }], [])).toEqual(['MSB-00140']);
  });

  it('combines upload and autocomplete selections', () => {
    expect(buildParticipantIdFilter(
      [{ subject_id: 'MSB-00140' }],
      [{ title: 'MSB-01068' }],
    )).toEqual(['MSB-00140', 'MSB-01068']);
  });

  it('returns an empty array when neither is set', () => {
    expect(buildParticipantIdFilter(undefined, undefined)).toEqual([]);
    expect(buildParticipantIdFilter([], [])).toEqual([]);
  });
});
