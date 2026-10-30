/**
 * Formats one Therapy field from Participant Overview for display.
 * Keeps string values, trims their surrounding whitespace, removes blank entries,
 * and joins the remaining labels with ", ". Returns null for a non-array input or
 * a list with no usable labels, allowing the caller to show N/A or an empty cell.
 * Characters inside a label (including commas and pipes) are preserved.
 *
 * Display only: never use this helper to normalize facet selections or request
 * variables. In that path, [''] is an explicit empty-string selection, while []
 * means no filter. Removing '' there would change the requested cohort.
 *
 * Names, types, categories, and responses are independently aggregated lists.
 * Format each field separately: for example, names ['A', 'B'] and responses
 * ['Partial Response'] do not tell us which therapy had that response. Matching
 * values by array index would invent a relationship the API does not provide.
 *
 * @param {*} values - API field value, normally an array of strings.
 * @returns {string|null} Display text, or null when no usable labels are available.
 *
 * @example
 * formatTherapyValues([' abiraterone ', 'leuprolide', '', null]);
 * // 'abiraterone, leuprolide'
 *
 * @example
 * formatTherapyValues([null, '   ', 42]); // null
 * formatTherapyValues([]);              // null
 * formatTherapyValues(['']);            // null for display; retain '' in filters
 * formatTherapyValues('A|B');            // null: scalar strings are not API lists
 */
export const formatTherapyValues = (values) => {
  if (!Array.isArray(values)) return null;
  const labels = values
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean);
  return labels.length ? labels.join(', ') : null;
};
