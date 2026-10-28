import { THERAPY_COMBINATION_SEPARATOR } from '../../bento/siteWideConfig';

/**
 * Extracts the backend combination strings from aggregation buckets.
 * Keeps the original order and empty-string values; counts are not needed here.
 *
 * Parameters:
 * @param {Object[]} data - Aggregation buckets with a `group` string.
 *
 * Returns:
 * @return {string[]} - The `group` values used as the combination vocabulary.
 *
 * Example:
 *   Input: [{ group: 'A|B', subjects: 3 }, { group: '', subjects: 2 }]
 *   Output: ['A|B', '']
 */
const extractGroupValues = (data) => data.map(item => item.group);

/**
 * Validates the separator before generating or splitting combination strings.
 * A valid separator is used literally, including any surrounding spaces.
 *
 * Parameters:
 * @param {string} separator - Separator agreed with the backend/index encoding.
 *
 * Returns:
 * @return {void} - Returns normally when the separator is valid.
 * @throws {Error} - If the separator is empty, whitespace-only, or not a string.
 *
 * Example:
 *   validateSeparator('~');  // Valid; combinations may use 'A~B'.
 *   validateSeparator('');   // Throws instead of splitting names into characters.
 */
const validateSeparator = (separator) => {
  if (typeof separator !== 'string' || separator.trim().length === 0) {
    throw new Error('THERAPY_COMBINATION_SEPARATOR must be a non-empty, non-whitespace string.');
  }
};

/**
 * Converts selected individual therapy names into terms for `therapy_string`.
 * Uses the backend vocabulary to include only supported complete combinations.
 *
 * This function:
 *   - Keeps selected names as singleton terms, even if absent from the vocabulary.
 *   - Adds a combination only when all its names are selected and it exists in
 *     the vocabulary. Selecting A alone does not include the A+B combination.
 *   - Preserves [''] (the selected "No value" option) separately from [] (no filter).
 *   - Sends each complete request term once, even when a selected name also
 *     appears as a singleton in the backend vocabulary.
 *   - Leaves Redux/saved selections unchanged; only API request terms are expanded.
 *
 * Parameters:
 * @param {Object} activeFilters - API filters containing arrays of selected values.
 * @param {string} filterApiKey - Selected-name field, normally 'therapy_string'.
 * @param {Object[]} possibleCombinations - Backend buckets containing `group` strings.
 * @param {string} [separator=THERAPY_COMBINATION_SEPARATOR] - Literal separator from
 *   siteWideConfig by default; must match the backend vocabulary encoding.
 *
 * Returns:
 * @return {string[]} - Sorted, unique request terms, including an explicitly selected ''.
 *   Deduplication preserves literal names and complete-combination matching.
 *   Therapy Type/Category values are not processed by this helper.
 * @throws {Error} - If the configured or explicitly supplied separator is invalid.
 *
 * Example (separator '~'):
 *   activeFilters: { therapy_string: ['B', 'A'] }
 *   possibleCombinations: [{ group: 'A~B', subjects: 3 }]
 *   Output: ['A', 'A~B', 'B']
 *   Saved selections remain ['B', 'A'].
 */
const generateValidTherapyCombinations = (
  activeFilters, filterApiKey, possibleCombinations, separator = THERAPY_COMBINATION_SEPARATOR,
) => {
  validateSeparator(separator);
  const validCombinations = extractGroupValues(possibleCombinations);
  return generateValidCombinations(activeFilters[filterApiKey], validCombinations, separator);
};

/**
 * Builds supported combinations from the selected therapy names.
 *
 * This function:
 *   - Copies and sorts selected names to match the backend combination order.
 *   - Builds vocabulary prefixes so recursion can stop exploring unsupported paths.
 *   - Splits prefixes and joins selected names using the same literal separator.
 *   - Keeps selected singleton names and adds complete vocabulary matches.
 *   - Removes repeated complete terms from the final request array.
 *   - Restores an explicitly selected empty string at the start of the result.
 *
 * Parameters:
 * @param {string[]} strings - Selected individual names; may include ''.
 * @param {string[]} validCombinations - Supported strings extracted from the backend.
 * @param {string} joinByChar - Separator already validated by the calling helper.
 *
 * Returns:
 * @return {string[]} - Sorted, unique request terms without changing either input array.
 *   Selected singletons remain present even when missing from the vocabulary.
 *   Unsupported combinations are never added.
 *
 * Example:
 *   strings: ['B', 'A', '']
 *   validCombinations: ['A', 'A|B', 'A|B|C', 'B']
 *   joinByChar: '|'
 *   Output: ['', 'A', 'A|B', 'B']
 *   A and B occur once, although each is both selected and in the vocabulary.
 *   'A|B|C' is excluded because C was not selected.
 */
function generateValidCombinations(strings, validCombinations, joinByChar) {
  let result = [];
  const validSet = new Set(validCombinations);
  const validPrefixes = new Set();
  const includeNoValue = strings.includes('');

  // Handle empty string: remove from `strings` for now, add to result later if necessary
  if (includeNoValue) {
    strings = strings.filter(str => str !== '');
  }
  
  validSet.delete(''); // Remove the empty string(No value) from validSet

  // Preserve selected singleton names even when absent from the combination vocabulary.
  result = [...strings]

  // Generate prefixes from `validCombinations` to identify valid partial matches
  validCombinations.forEach(combination => {
    const parts = combination.split(joinByChar);
    let prefix = '';
    for (let i = 0; i < parts.length; i++) {
      prefix = prefix ? prefix + joinByChar + parts[i] : parts[i];
      validPrefixes.add(prefix);
    }
  });

  // Sort the input strings alphabetically for consistency
  strings = [...strings].sort();

  // Recursive helper to generate and validate combinations
  function combine(current, remaining) {
    const combinedString = current.join(joinByChar);

    // Skip prefix check if current is empty (initial call)
    if (current.length > 0) {
      // Skip if the current combination does not match any valid prefix
      if (!validPrefixes.has(combinedString)) return;

      // Add to result if it's a fully valid combination
      if (validSet.has(combinedString)) result.push(combinedString);
    }
    // Recursively combine remaining elements
    for (let i = 0; i < remaining.length; i++) {
      combine([...current, remaining[i]], remaining.slice(i + 1));
    }
  }

  // Start generating combinations
  combine([], strings);

  // Sort final result for cleaner output
  result.sort();

  // Add empty string at the start if it was in the original input
  if (includeNoValue && !result.includes('')) result.unshift('');

  // Selected singletons can also be found during traversal. Keep one copy of
  // each complete term, preserving the sorted order and selected empty string.
  return [...new Set(result)];
}

/**
 * Reconstructs individual Therapy facet options from backend combination buckets.
 * Each name in a combination receives that bucket's `subjects` count. Counts for
 * the same name across buckets are summed, while the original buckets stay unchanged.
 * An empty `group` remains an empty option for the facet's "No value" label.
 *
 * Parameters:
 * @param {Object} searchParticipants - API data containing combination buckets.
 * @param {string} dataApiKey - Property holding the bucket array to reconstruct.
 * @param {string} [separator=THERAPY_COMBINATION_SEPARATOR] - Literal backend separator;
 *   defaults to the same siteWideConfig setting used for request combinations.
 *
 * Returns:
 * @return {Object} - An object containing only `dataApiKey`, with per-name buckets.
 *   An empty input array produces an empty output array. Names are not deduplicated
 *   within a raw combination; each occurrence contributes the bucket count.
 * @throws {Error} - If the configured or explicitly supplied separator is invalid.
 *
 * Example (dataApiKey 'buckets', separator '|'):
 *   Input: { buckets: [
 *     { group: 'Atezolizumab', subjects: 13 },
 *     { group: 'Atezolizumab|Encorafenib + Cetuximab', subjects: 1 },
 *     { group: '', subjects: 2 }
 *   ] }
 *   Output: { buckets: [
 *     { group: 'Atezolizumab', subjects: 14 },
 *     { group: 'Encorafenib + Cetuximab', subjects: 1 },
 *     { group: '', subjects: 2 }
 *   ] }
 */
const updateTherapyFacetData = (
  searchParticipants, dataApiKey, separator = THERAPY_COMBINATION_SEPARATOR,
) => {
  validateSeparator(separator);
  const facetItemData = searchParticipants[dataApiKey];
  const therapyCounts = new Map();

  facetItemData.forEach(({ group, subjects }) => {
    group.split(separator).forEach(therapy => {
      therapyCounts.set(therapy, (therapyCounts.get(therapy) || 0) + subjects);
    });
  });

  // Convert the Map back to an array format
  const newResult = Array.from(therapyCounts, ([group, subjects]) => ({ group, subjects }));

  return { [dataApiKey]: newResult };
};

/**
 * Applies text replacement rules in order, replacing every match for each rule.
 * Later rules operate on the result of earlier rules.
 *
 * Parameters:
 * @param {string} str - Original text to format.
 * @param {Object[]} substitutionRules - Rules with `replace` and `with` values
 *   accepted by String.replaceAll (a RegExp must use the global flag).
 *
 * Returns:
 * @return {string} - Text after all replacements; the original string is unchanged.
 *
 * Example:
 *   str: 'A_B_C'
 *   substitutionRules: [{ replace: '_', with: ', ' }]
 *   Output: 'A, B, C'
 */
const applySubstitutions = (str, substitutionRules) => {
  substitutionRules.forEach(rule => {
    const { replace, with: replaceWith } = rule;
    str = str.replaceAll(replace, replaceWith);
  });

  return str;
};

export {
  generateValidTherapyCombinations,
  updateTherapyFacetData,
  applySubstitutions
}
