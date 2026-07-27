import { onClearAllAndSelectFacetValue } from '../pages/dashTemplate/sideBar/BentoFilterUtils';

/*
* redirect to cases page and filter by study code
*/
export function navigatedToDashboard(studyCode) {
  onClearAllAndSelectFacetValue('study', studyCode);
}

export const convertCRDCLinksToValue = (data, key) => {
  if (!key) {
    const objString = Object.entries(data)[0][0];
    const dataArr = Object.entries(data)[0][1];
    const processedArr = dataArr
      .map((element) => ({
        ...element, CRDCLinks: element.CRDCLinks.length, links: element.CRDCLinks,
      }));
    const tempArr = [
      [objString, processedArr],
    ];
    return Object.fromEntries(tempArr);
  }

  const processedArr = data[key]
    .map((element) => ({
      ...element, CRDCLinks: element.CRDCLinks.length, links: element.CRDCLinks,
    }));

  return { ...data, [key]: processedArr };
};

/* 
* Remove square brackets from a string 
* ex. "[Gemtuzumab ozogamicin, Bicalutamide]" => "Gemtuzumab ozogamicin, Bicalutamide"
*/
export const removeSquareBracketsFromString = (text) => {
  return text.replace(/\[|\]/g, '');
};

/**
 * Convert string to proper title case following grammar rules
 * - Capitalizes first and last words
 * - Capitalizes all major words
 * - Keeps articles, prepositions, and conjunctions lowercase (unless first/last)
 * @param {string} str - The string to convert to title case
 * @returns {string} - String in proper title case
 */
export const toTitleCase = (str) => {
  if (!str || typeof str !== "string") {
    return str;
  }

  // Words that should stay lowercase (unless first or last word)
  const smallWords = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "from",
    "in",
    "into",
    "nor",
    "of",
    "off",
    "on",
    "or",
    "out",
    "over",
    "per",
    "so",
    "the",
    "to",
    "up",
    "via",
    "with",
    "yet",
  ]);

  const words = str.toLowerCase().split(" ");

  return words
    .map((word, index) => {
      const isFirstWord = index === 0;
      const isLastWord = index === words.length - 1;

      // Always capitalize first and last words
      if (isFirstWord || isLastWord) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

      // Check if it's a small word
      if (smallWords.has(word)) {
        return word; // Keep lowercase
      }

      // Capitalize all other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};
