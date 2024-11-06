import { clearAllAndSelectFacet } from "@bento-core/facet-filter";
import store from "../../store";

// import { onClearAllAndSelectFacetValue } from "./sideBar/BentoFilterUtils"
export const getFacetValues = (facet, facetValues) => {
  const selectedFacetValues = {}
  facetValues.forEach((element)=>{
    selectedFacetValues[element] = true
  })
  return {[facet]: selectedFacetValues};

}


const onClearAllAndSelectFacetValue = (facet, facetValue) => {
  console.log("|| onClearAllAndSelectFacetValue: ", facet, facetValue)
  const filterValue = getFacetValues(facet, facetValue );
  console.log("|| onClearAllAndSelectFacetValue filterValue: ", filterValue)

  store.dispatch(clearAllAndSelectFacet(filterValue));
}

const getTargetedTherapyStringFilter = (activeFilters, filterApiKey, filterParticipantCountByTargetedTherapyString, dashData) => {
  let result = []
  console.log("|| targeted_therapy_string: ", activeFilters[filterApiKey])
  const validCombinations = extractGroupValues(filterParticipantCountByTargetedTherapyString)
  console.log("|| validCombinations: ", validCombinations)

  if (validCombinations) { // Initial Load will be empty
    result = generateValidCombinations(activeFilters[filterApiKey], validCombinations,  "|")
    
    // onClearAllAndSelectFacetValue(filterApiKey, result)
  }
  console.log("||| After targeted_therapy_string: ", result)

  return result;
}

function extractGroupValues(data) {
  return data.map(item => item.group);
}


/*
 * Generates valid combinations of input strings based on specified valid combinations,
 * while allowing an optional separator between elements in each combination.
 * 
 * The function operates by:
 *   - Validating input strings against a predefined list of valid combinations.
 *   - Generating only those combinations that align with valid prefixes (i.e., partial matches allowed in the valid combinations list).
 *   - Optionally including an empty string ("") in the result if it was present in the initial input list.
 * 
 * Parameters:
 * @param {string[]} strings - An array of input strings to combine, e.g., ["A", "B", "C"].
 * @param {string[]} validCombinations - An array of valid combinations to filter results against, e.g., ["A|B", "B|C"].
 * @param {string} joinByChar - The character used to separate elements in each combination (default is '|').
 * 
 * Returns:
 * @return {string[]} - A sorted array of unique, valid combinations derived from the input strings.
 *                      If an empty string ("") was in the input strings, it will appear only once in the result.
 * 
 * Example usage:
 * const inputStrings = ["A", "B", "C", ""];
 * const validCombinations = ["A|B", "B|C", ""];
 * generateValidCombinations(inputStrings, validCombinations); 
 * 
 * // Output: ["", "A|B", "B|C"]
 *
 * Explanation:
 * - The function starts by checking if an empty string exists in `strings`.
 *   If found, `includeNoValue` is set to true, and the empty string is removed from `strings`.
 * - A set of valid prefixes is created from the `validCombinations` array to support efficient pruning
 *   during combination generation.
 * - The function uses a recursive helper, `combine`, to explore all possible combinations of input strings,
 *   stopping early when a combination does not match any valid prefix.
 * - Only fully valid combinations are added to the result.
 * - After combination generation, if `includeNoValue` is true, `""` is added to the result
 *   (only if it was present in `strings` initially and not already in the result).
 */
// strings - activeFilter
function generateValidCombinations(strings, validCombinations, joinByChar = '|') {
  const result = [];
  const validSet = new Set(validCombinations);
  const validPrefixes = new Set();
  let includeNoValue = false;

  // Check if the strings array includes an empty string and remove it from valid combinations if needed
  if (strings.includes('')) {
    includeNoValue = true;
    strings = strings.filter(str => str !== ''); // Remove the empty string from strings
  }
  // If empty string is not in input strings, remove it from validSet
  else {
    validSet.delete('');
  }

  // Create prefixes from valid combinations to enable pruning
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

  // Recursive function to generate combinations with early pruning
  function combine(current, remaining) {
    const combinedString = current.join(joinByChar);

    // Only proceed if the current combination is a valid prefix
    if (!validPrefixes.has(combinedString)) {
      return; // Stop exploring this branch if it's not a valid prefix
    }

    // If the full combination is valid, add it to the result
    if (validSet.has(combinedString)) {
      result.push(combinedString);
    }

    for (let i = 0; i < remaining.length; i++) {
      combine([...current, remaining[i]], remaining.slice(i + 1));
    }
  }

  // Start the combination process
  combine([], strings);

  // Sort result for a cleaner output
  result.sort();

  // Only add an empty string to the results if it was included in the input and not already in result
  if (includeNoValue && !result.includes('')) {
    result.unshift(''); // Add the empty string at the beginning
  }

  return result;
}


/*
Given this:
[
  { "group": "Atezolizumab", "subjects": 13},
  { "group": "Atezolizumab|Encorafenib + Cetuximab", "subjects": 1 }
]
Output:
[
  { "group": "Atezolizumab", "subjects": 14 },
  { "group": "Encorafenib + Cetuximab", "subjects": 1 }
]
  */
const updateTargetedTherapyFacetData = (searchParticipants, dataApiKey) => {
  const facetItemData = searchParticipants[dataApiKey]
  // console.log("||| ------- Before: participantCountByTargetedTherapyString: ", facetItemData);

  let therapyCounts = {};

  facetItemData.forEach(element => {
    let therapies = element.group.split('|').map(therapy => therapy);

    therapies.forEach(therapy => {
      if (!therapyCounts[therapy]) {
        therapyCounts[therapy] = 0;
      }
      therapyCounts[therapy] += element.subjects;
    });
  });

  // Convert the therapyCounts object back to an array format
  const newResult = Object.keys(therapyCounts).map(therapyKey => ({
    group: therapyKey,
    subjects: therapyCounts[therapyKey]
  }));


  return {
    [dataApiKey]: newResult
  };
}

const applySubstitutions = (str, substitutionRules) => {
  let transformedStr = str;

  substitutionRules.forEach(rule => {
    const { replace, with: replaceWith } = rule;
    transformedStr = transformedStr.replaceAll(replace, replaceWith);
  });

  return transformedStr;
};

  


export {
  getTargetedTherapyStringFilter,
  updateTargetedTherapyFacetData,
  applySubstitutions
}


/*   { "group": "Atezolizumab, Encorafenib + Cetuximab", "subjects": 1 }
  { "group": "Atezolizumab", groupWith: ["Encorafenib + Cetuximab"] "subjects": 1 }



  function generateCombinations(strings, joinByChar='') {
  const result = [];
  let includeNoValue = false; // Use let for a mutable variable

  // Sort the input strings alphabetically first
  strings.sort();

  // Check if the strings array includes an empty string
  if (strings.includes('')) {
    includeNoValue = true;
    // Remove the empty string
    strings = strings.filter(str => str !== ''); // Create a new array without the empty string
  }

  // Recursive function to generate combinations
  function combine(current, remaining) {
    // Push the current combination
    if (current.length >= 1) result.push(current.join(joinByChar));

    for (let i = 0; i < remaining.length; i++) {
      combine([...current, remaining[i]], remaining.slice(i + 1));
    }
  }

  // Start the combination process
  combine([], strings);

  // Sort the result alphabetically based on the concatenated string values
  result.sort();

  // Add an empty string to the results if it was included in the input
  if (includeNoValue) {
    result.unshift(''); // Add the empty string at the beginning
  }

  return result;
}
  






// Example usage

const inputStrings = [
  "Bortezomib",
  "Lenalidomide",
  "Pembrolizumab",
  "Bevacizumab",
  "Daratumumab",
  "",
  "Nivolumab",
  "Atezolizumab",
  "Pomalidomide",
  "Carfilizomib",
  "Panitumumab",
  "Dabrafenib",
  "Durvalumab",
  "Gemtuzumab Ozogamicin",
  "Ipilimumab",
  "Osimertinib",
  "Enzalutamide",
  "Midostaurin",
  "Regorafenib",
  "Cetuximab",
  "Docetaxel",
  "Elotuzumab",
  "Encorafenib",
  "Isatuximab",
  "Selinexor",
  "Abiraterone",
  "Alectinib",
  "Binimetinib",
  "Afatinib",
  "Apalutamide",
  "Belantamab Mafodotin",
  "Cabazitaxel",
  "Cobimetinib",
  "Darolutamide",
  "Encorafenib + Cetuximab",
  "Entrectinib",
  "Erlotinib",
  "Ixazomib",
  "Olaparib",
  "Ramucirumab",
  "Trametinib",
  "Vemurafenib"
];

// TODO:
Since we are saving the state to preserve user facet selections across page refreshes or site navigation,
reloading the explore page while a user selects Target Therapies causes an issue where validCombinations
is not initialized on the initial load. If a user has already made selections, the initial load requires backup data, which can be used temporarily.

const validCombinations = [
  "Pembrolizumab", "", "Bevacizumab", "Bortezomib|Lenalidomide", "Nivolumab", 
  "Atezolizumab", "Bortezomib|Daratumumab|Lenalidomide", "Durvalumab", 
  "Enzalutamide", "Osimertinib", "Ipilimumab|Nivolumab", "Lenalidomide", 
  "Panitumumab", "Bevacizumab|Panitumumab", "Bortezomib", "Bortezomib|Daratumumab", 
  "Dabrafenib", "Gemtuzumab Ozogamicin", "Gemtuzumab Ozogamicin|Midostaurin", 
  "Abiraterone", "Alectinib", "Bevacizumab|Cetuximab", 
  "Bortezomib|Carfilizomib|Daratumumab|Elotuzumab|Lenalidomide|Pomalidomide", 
  "Bortezomib|Carfilizomib|Daratumumab|Lenalidomide", 
  "Bortezomib|Daratumumab|Lenalidomide|Pomalidomide", 
  "Daratumumab|Lenalidomide", "Daratumumab|Pomalidomide", "Docetaxel", 
  "Midostaurin", "Regorafenib", "Afatinib", "Apalutamide", 
  "Atezolizumab|Encorafenib + Cetuximab", 
  "Belantamab Mafodotin|Bortezomib|Carfilizomib|Daratumumab|Lenalidomide|Pomalidomide|Selinexor", 
  "Bevacizumab|Cetuximab|Encorafenib|Regorafenib", "Bevacizumab|Nivolumab", 
  "Bevacizumab|Pembrolizumab", "Bevacizumab|Regorafenib", 
  "Binimetinib|Dabrafenib|Encorafenib|Nivolumab|Pembrolizumab", 
  "Binimetinib|Encorafenib|Pembrolizumab", "Bortezomib|Carfilizomib|Daratumumab", 
  "Bortezomib|Carfilizomib|Daratumumab|Lenalidomide|Pomalidomide", 
  "Bortezomib|Carfilizomib|Daratumumab|Lenalidomide|Pomalidomide|Selinexor", 
  "Bortezomib|Carfilizomib|Lenalidomide", 
  "Bortezomib|Daratumumab|Elotuzumab|Lenalidomide|Pomalidomide", 
  "Bortezomib|Daratumumab|Ixazomib|Lenalidomide", 
  "Bortezomib|Daratumumab|Lenalidomide|Regorafenib", 
  "Bortezomib|Isatuximab|Lenalidomide|Pomalidomide|Selinexor", 
  "Cabazitaxel|Olaparib", "Carfilizomib|Daratumumab", "Carfilizomib|Isatuximab|Pomalidomide", 
  "Cobimetinib|Vemurafenib", "Dabrafenib|Ipilimumab|Nivolumab|Pembrolizumab", 
  "Dabrafenib|Trametinib", "Daratumumab", "Darolutamide|Docetaxel", 
  "Entrectinib", "Erlotinib", "Ipilimumab|Pembrolizumab", "Isatuximab|Pomalidomide", 
  "Osimertinib|Pembrolizumab", "Pembrolizumab|Ramucirumab"
];

// const sortedValidCombinations = generateValidCombinations(inputStrings, validCombinations, '|');

// console.log(sortedValidCombinations);

*/