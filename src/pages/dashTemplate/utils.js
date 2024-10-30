
const getTargetedTherapyStringFilter = (targeted_therapy_string) => {
  let result = []
  console.log("||| targeted_therapy_string: ", targeted_therapy_string)
  result = generateCombinations(targeted_therapy_string, "|")
  console.log("After ||| targeted_therapy_string: ", result)

  return result;
}



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

  
const updateTargetedTherapyWidgetData = (participantCountByTargetedTherapyString) => {
  let newResult = []
  participantCountByTargetedTherapyString.forEach(element => {
    if (element.group.includes('|')) {
      newResult.push()
      return {...element, group: seperateTargetedTherapyStringByComma(element.group)}
    }
    return element
  });

  console.log("||| ------- After: participantCountByTargetedTherapyString: ", participantCountByTargetedTherapyString)
  
  return {
    participantCountByTargetedTherapyString: participantCountByTargetedTherapyString
  }
}

/*
Given this:
[
  { "group": "Atezolizumab", "subjects": 13},
  { "group": "Atezolizumab|Encorafenib + Cetuximab", "subjects": 1 }
]
Output:
[
  { "group": "Atezolizumab", "subjects": 13 },
  { "group": "Atezolizumab, Encorafenib + Cetuximab", "subjects": 1 }
  { "group": "Atezolizumab", groupWith: ["Encorafenib + Cetuximab"] "subjects": 1 }
  { "group": "Encorafenib + Cetuximab", groupWith: ["Atezolizumab"] "subjects": 1 }
]
  */
const seperateTargetedTherapyStringByComma = (str) => {
  return str.replaceAll('|', ', ')
}

  


export {
  getTargetedTherapyStringFilter,
  updateTargetedTherapyWidgetData
}