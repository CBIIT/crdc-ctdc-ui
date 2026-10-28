import { THERAPY_COMBINATION_SEPARATOR } from '../../bento/siteWideConfig';

/**
 * Extracts the `group` values from an array of data objects.
 * @param {Object[]} data - Array of objects containing `group` property.
 * @return {string[]} - Array of group values.
 */
const extractGroupValues = (data) => data.map(item => item.group);

// Reject an invalid separator rather than splitting a name into characters or
// silently changing the encoding. Keep nonblank separators literal (no trimming).
const validateSeparator = (separator) => {
  if (typeof separator !== 'string' || separator.trim().length === 0) {
    throw new Error('THERAPY_COMBINATION_SEPARATOR must be a non-empty, non-whitespace string.');
  }
};

/**
 * Expands selected individual names into backend-supported complete combinations.
 * A alone must not match A+B. Selecting A and B admits A, B, and their combination
 * only if that combination exists in the current backend vocabulary.
 *
 * Both this helper and facet reconstruction default to siteWideConfig's separator.
 * An explicit separator lets tests exercise a different backend encoding.
 * Example with '~': selected ['A', 'B'] and vocabulary [{ group: 'A~B' }]
 * produces ['A', 'A~B', 'B']; stored selections remain ['A', 'B'].
 * A selected empty string [''] remains ['']; no selection [] remains [].
 */
const generateValidTherapyCombinations = (
  activeFilters, filterApiKey, possibleCombinations, separator = THERAPY_COMBINATION_SEPARATOR,
) => {
  validateSeparator(separator);
  const validCombinations = extractGroupValues(possibleCombinations);
  return generateValidCombinations(activeFilters[filterApiKey], validCombinations, separator);
};

/**
 * Keeps selected singleton names and adds only supported complete combinations.
 * Prefix checking, splitting, and joining must all use the same literal separator.
 * For ['A', 'B', ''] and vocabulary ['A|B'], using '|' returns
 * ['', 'A', 'A|B', 'B']. Names outside that vocabulary are still retained as
 * singletons, preserving the existing filtering behavior. Existing duplicate
 * terms are left unchanged by this separator refactor.
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

  return result;
}

/**
 * Aggregates therapy data by combining entries with multiple values in `group`
 * and summing the `subjects` count for each therapy.
 * 
 * @param {Object} searchParticipants - Data object containing facet data by `dataApiKey`.
 * @param {string} dataApiKey - Key for accessing the combination buckets.
 * @param {string} separator - Literal backend separator; defaults to siteWideConfig.
 * @return {Object} - Object with `dataApiKey` and aggregated therapy data.
 * 
 * Example:
 * Input: [
 *   { "group": "Atezolizumab", "subjects": 13 },
 *   { "group": "Atezolizumab|Encorafenib + Cetuximab", "subjects": 1 }
 * ]
 * Output: [
 *   { "group": "Atezolizumab", "subjects": 14 },
 *   { "group": "Encorafenib + Cetuximab", "subjects": 1 }
 * ]
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
