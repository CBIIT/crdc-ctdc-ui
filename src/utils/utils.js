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