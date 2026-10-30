/**
 * Keeps response-validation diagnostics separate from the message shown in Explore.
 * Only frontend validation creates this error; backend messages cannot supply
 * user-facing copy through an arbitrary `userMessage` property.
 *
 * Example:
 *   new ExploreResponseError('Expected an array at searchParticipants.someField',
 *     'The response is missing the Therapy data needed to display the filters.');
 */
export class ExploreResponseError extends Error {
  constructor(message, userMessage) {
    super(message);
    this.name = 'ExploreResponseError';
    this.userMessage = userMessage;
  }
}

/**
 * Explains a failed Explore request without displaying developer diagnostics.
 * Distinguishes missing Therapy data, service/query failures, connection failures,
 * and unexpected errors. Uses structured error information rather than parsing
 * server messages. The caller logs the original error object and stack.
 *
 * @param {*} error - The original Apollo, validation, or unexpected error.
 * @returns {string} A message suitable for the Explore error panel.
 *
 * Example:
 *   { networkError: { statusCode: 503, message: 'Upstream URL and diagnostics' } }
 *   => 'The Backend Service could not complete the Explore request (HTTP 503).'
 */
export const getExploreErrorMessage = (error) => {
  if (error instanceof ExploreResponseError) return error.userMessage;

  const networkError = error?.networkError || error;
  const status = Number(networkError?.statusCode || networkError?.response?.status);
  const hasHttpResponse = Number.isInteger(status) && status >= 100 && status <= 599;
  const hasQueryError = Array.isArray(error?.graphQLErrors) && error.graphQLErrors.length > 0;
  if (hasHttpResponse || hasQueryError) {
    const statusText = hasHttpResponse && status >= 400 ? ` (HTTP ${status})` : '';
    return `The Backend Service could not complete the Explore request${statusText}.`;
  }
  if (error?.networkError) {
    return 'Explore could not connect to the Backend Service.';
  }
  return 'An unexpected error interrupted the Explore request.';
};
