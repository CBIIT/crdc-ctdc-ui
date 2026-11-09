import { ExploreResponseError, getExploreErrorMessage } from './exploreErrors';

const diagnostic = 'Internal details at https://internal.example/graphql: searchParticipants.private_field';
// Preserve the Apollo error shape without loading its transport or React bindings.
const networkFailure = (details = {}) => Object.assign(new Error(diagnostic), {
  networkError: Object.assign(new Error(diagnostic), details),
});
describe('Explore error presentation', () => {
  it.each([400, 503])('reports HTTP %s while preserving the original diagnostics', (statusCode) => {
    const error = networkFailure({ statusCode });
    const originalNetworkError = error.networkError;
    const originalStack = error.stack;
    expect(getExploreErrorMessage(error))
      .toBe(`The Backend Service could not complete the Explore request (HTTP ${statusCode}).`);
    expect(error.networkError).toBe(originalNetworkError);
    expect(error.networkError.message).toBe(diagnostic);
    expect(error.stack).toBe(originalStack);
  });

  it('uses the response status if the network error has no statusCode', () => {
    expect(getExploreErrorMessage(networkFailure({ response: { status: 503 } })))
      .toContain('(HTTP 503)');
  });

  it('treats an unreadable HTTP 200 response as a service failure, not a lost connection', () => {
    expect(getExploreErrorMessage(networkFailure({ name: 'ServerParseError', statusCode: 200 })))
      .toBe('The Backend Service could not complete the Explore request.');
  });

  it('reports a backend query failure without requiring an error code or echoing field names', () => {
    const error = Object.assign(new Error(diagnostic), {
      graphQLErrors: [{ message: diagnostic }],
    });
    expect(getExploreErrorMessage(error))
      .toBe('The Backend Service could not complete the Explore request.');
  });

  it('reports a connection failure when Apollo has no HTTP response', () => {
    expect(getExploreErrorMessage(networkFailure()))
      .toBe('Explore could not connect to the Backend Service.');
  });

  it('uses locally authored response guidance while retaining the diagnostic error', () => {
    const userMessage = 'The response is missing the Therapy information needed to display the filters.';
    const error = new ExploreResponseError(diagnostic, userMessage);
    expect(getExploreErrorMessage(error)).toBe(userMessage);
    expect(error.message).toBe(diagnostic);
    expect(error).toBeInstanceOf(Error);
  });

  it.each([null, undefined, diagnostic, new Error(diagnostic), { userMessage: diagnostic }])(
    'does not invent a cause or expose arbitrary text for an unknown error',
    (error) => {
      expect(getExploreErrorMessage(error))
        .toBe('An unexpected error interrupted the Explore request.');
    },
  );
});
