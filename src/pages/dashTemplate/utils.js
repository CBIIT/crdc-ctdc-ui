/**
 * Extracts the `group` values from an array of data objects.
 * @param {Object[]} data - Array of objects containing `group` property.
 * @return {string[]} - Array of group values.
 */
const extractGroupValues = (data) => data.map(item => item.group);

/**
 * Updates filter state based on targeted therapy combinations.
 *
 * Generates valid combinations for active filters in a specific category (targeted_therapy), 
 * based on allowed combinations from possible combinations.
 * 
 * @param {Object} activeFilters - Object of current filters with keys representing categories.
 * @param {string} filterApiKey - Key to access the specific filter category within `activeFilters`.
 * @param {Object[]} possibleCombinations - List of valid combinations, each with a `group` property.
 * @return {string[]} - Array of valid therapy combinations.
 */
const generateValidTherapyCombinations = (activeFilters, filterApiKey, possibleCombinations) => {
  const validCombinations = extractGroupValues(possibleCombinations)

  if (validCombinations) return generateValidCombinations(activeFilters[filterApiKey], validCombinations,  "|")

  return [];
}

/**
 * Generates valid combinations of input strings based on specified valid combinations.
 *
 * This function:
 *   - Generates combinations of input strings.
 *   - Validates each combination against a predefined list of allowed combinations.
 *   - Includes an empty string ("") in the result if it was present in the input list.
 *
 * Parameters:
 * @param {string[]} strings - The input strings to combine, e.g., ["A", "B", "C"].
 * @param {string[]} validCombinations - The allowed combinations to match against, e.g., ["A|B", "B|C"].
 * @param {string} joinByChar - Separator for combining elements (default is '|').
 *
 * Returns:
 * @return {string[]} - Sorted array of unique, valid combinations based on input strings and allowed combinations.
 *                      Includes an empty string at the start if it was in the input.
 *
 * Example:
 *    const inputStrings = ["A", "B", "C", ""];
 *    const validCombinations = ["A|B", "B|C", ""];
 *    generateValidCombinations(inputStrings, validCombinations); 
 *    Output: ["", "A|B", "B|C"]
 */
function generateValidCombinations(strings, validCombinations, joinByChar = '|') {
  let result = [];
  const validSet = new Set(validCombinations);
  const validPrefixes = new Set();
  const includeNoValue = strings.includes('');

  // Handle empty string: remove from `strings` for now, add to result later if necessary
  if (includeNoValue) {
    strings = strings.filter(str => str !== '');
  }
  
  validSet.delete(''); // Remove the empty string(No value) from validSet

  // Add initial selected strings to result. Will include target therapy that are not inside valid combination. Ex. Lenalidomide
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
  strings.sort();

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
 * @param {string} dataApiKey - Key for accessing targeted data.
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
const updateTargetedTherapyFacetData = (searchParticipants, dataApiKey) => {
  const facetItemData = searchParticipants[dataApiKey];
  const therapyCounts = new Map();

  facetItemData.forEach(({ group, subjects }) => {
    group.split('|').forEach(therapy => { 
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
  updateTargetedTherapyFacetData,
  applySubstitutions
}