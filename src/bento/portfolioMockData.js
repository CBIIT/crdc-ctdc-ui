// Preview-only data for the dev-only /portfolio-mock route, copied from the approved Figma Portfolio frame
// ("CTDC Program - APPROVED"). Study counts match the design; the study rows themselves are placeholders and the
// resource URLs are stand-ins (the design has none).
import cimacCidcImage from '../assets/portfolio/mock/cimac-cidc.png';
import cmbImage from '../assets/portfolio/mock/cmb.png';
import nciMatchImage from '../assets/portfolio/mock/nci-match.png';
import nctnImage from '../assets/portfolio/mock/nctn.png';

const placeholderStudies = (prefix, count) => Array.from({ length: count }, (_, i) => ({
  study_id: `${prefix}-${i + 1}`,
  study_short_name: `${prefix}-${i + 1}`,
  study_name: `${prefix} placeholder study ${i + 1}`,
}));

export const mockPrograms = [
  {
    program_name: 'NCI National Clinical Trials Network (NCTN)',
    program_short_name: 'NCTN',
    program_short_description: 'NCI’s National Clinical Trials Network (NCTN) is a collection of organizations and clinicians that coordinates and supports cancer clinical trials at more than 2,200 sites across the United States, Canada, and internationally. NCTN provides the infrastructure for NCI-funded treatment and primary advanced imaging trials to improve the lives of people with cancer.',
    program_external_url: 'https://www.cancer.gov/research/infrastructure/clinical-trials/nctn',
    studies: placeholderStudies('NCTN', 12),
  },
  {
    program_name: 'NCI Molecular Analysis for Therapy Choice Trial (NCI-MATCH)',
    program_short_name: 'NCI-MATCH',
    program_short_description: 'NCI-MATCH, also known as MATCH, is a precision medicine cancer treatment clinical trial that sought to find out if treating cancer based on specific genetic changes in a person’s tumor is effective, no matter the cancer type. In this trial, which is no longer enrolling patients, people with cancer had genomic sequencing and other tests to determine the genetic makeup of their cancer cells. People whose tumors had genetic changes that matched one of the treatments in the trial may have received that treatment if they met other eligibility criteria....',
    program_external_url: 'https://www.cancer.gov/about-cancer/treatment/clinical-trials/nci-supported/nci-match',
    studies: placeholderStudies('NCI-MATCH', 2),
  },
  {
    program_name: 'Cancer Immune Monitoring and Analysis Centers, Cancer Immunologic Data Center Network (CIMAC-CIDC Network)',
    program_short_name: 'CIMAC-CIDC',
    program_short_description: 'The Cancer Immunologic Data Center (CIDC), run by the NCI, is the data hub for the CIMACs-CIDC network. It collects and secures clinical data and biomarker results from immunotherapy clinical trials. Using centralized pipelines, the CIDC standardizes assay data across diverse trials to enable cross-trial analyses. This database helps researchers discover biomarkers for treatment response and resistance, and data is shared with the broader scientific community through the NCI Data Commons.',
    program_external_url: 'https://datascience.cancer.gov/data-commons/cimac-cidc',
    studies: placeholderStudies('CIMAC-CIDC', 38),
  },
];

export const mockUnaffiliatedStudies = placeholderStudies('CMB', 1);

export const mockCuratedContent = {
  NCTN: { primaryImage: nctnImage, primaryImageAlt: 'NCI National Clinical Trials Network' },
  'NCI-MATCH': { primaryImage: nciMatchImage, primaryImageAlt: 'NCI Molecular Analysis for Therapy Choice Trial' },
  'CIMAC-CIDC': { primaryImage: cimacCidcImage, primaryImageAlt: 'Cancer Immune Monitoring and Analysis Centers' },
};

export const mockInitiativesContent = {
  name: 'Cancer Moonshot Biobank (CMB)',
  description: '"Cancer Moonshot Biobank" is a longitudinal study. This means it collects and stores samples and information over time, throughout the course of a patient\'s cancer treatment. By looking at samples and information collected from the same people over time, researchers hope to better understand how cancer changes over time and over the course of medical treatments.”',
  primaryImage: cmbImage,
  primaryImageAlt: 'Cancer Moonshot Biobank',
  externalUrl: 'https://www.cancer.gov/research/key-initiatives/moonshot-cancer-initiative/biobank',
};
