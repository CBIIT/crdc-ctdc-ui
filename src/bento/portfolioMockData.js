// TEMPORARY scaffolding-preview data for the Portfolio page (CTDC-2064), used only while the real
// program/Initiatives GraphQL queries (CTDC-2066/2067) are not yet live. Remove this file and the
// USE_PORTFOLIO_MOCK_DATA flag in portfolioController.js once backend ships - see
// /memories/repo/portfolio-page-ctdc-2064.md for the tracked follow-up.
export const mockPrograms = [
  {
    program_name: 'NCI National Clinical Trials Network',
    program_short_name: 'NCTN',
    crdc_id: 'crdc-program-nctn',
    program_short_description: 'NCI’s National Clinical Trials Network (NCTN) is a collection of organizations and clinicians that coordinates and supports cancer clinical trials at more than 2,200 sites across the United States, Canada, and internationally. NCTN provides the infrastructure for NCI-funded treatment and primary advanced imaging trials to improve the lives of people with cancer.',
    program_full_description: "NCI's National Clinical Trials Network (NCTN) is a collection of organizations and clinicians that coordinates and supports cancer clinical trials at more than 2,200 sites across the United States, Canada, and internationally. NCTN provides the infrastructure for NCI-funded treatment and primary advanced imaging trials to improve the lives of people with cancer. NCTN clinical trials help to establish new standards of care, set the stage for approval of new therapies by the Food and Drug Administration, test new treatment approaches, and validate new biomarkers.",
    program_sort_order: 2,
    program_external_url: 'https://www.cancer.gov/research/infrastructure/clinical-trials/nctn',
    studies: [
      { study_short_name: 'AREN0532', study_name: 'Treatment for Very Low and Standard Risk Favorable Histology Wilms Tumor' },
    ],
  },
  {
    program_name: 'NCI Molecular Analysis for Therapy Choice Trial (NCI-MATCH)',
    program_short_name: 'NCI-MATCH',
    crdc_id: 'crdc-program-NCI-MATCH',
    program_short_description: 'NCI-MATCH, also known as MATCH, is a precision medicine cancer treatment clinical trial that sought to find out if treating cancer based on specific genetic changes in a person’s tumor is effective, no matter the cancer type. In this trial, which is no longer enrolling patients, people with cancer had genomic sequencing and other tests to determine the genetic makeup of their cancer cells. People whose tumors had genetic changes that matched one of the treatments in the trial may have received that treatment if they met other eligibility criteria..',
    program_sort_order: 1,
    program_external_url: 'https://ccr.cancer.gov/Comparative-Oncology-Program',
    studies: [
      { study_short_name: 'COTC007B', study_name: 'Preclinical Comparison Study' },
      { study_short_name: 'COTC021', study_name: 'Targeted Therapy Study' },
    ],
  },
  {
    program_name: 'Cancer Immune Monitoring and Analysis Centers, Cancer Immunologic Data Center Network (CIMAC-CIDC Network)',
    program_short_name: 'CIMAC-CIDC',
    crdc_id: 'crdc-program-CIMAC-CIDC',
    program_short_description: 'The Cancer Immunologic Data Center (CIDC), run by the NCI, is the data hub for the CIMACs-CIDC network. It collects and secures clinical data and biomarker results from immunotherapy clinical trials. Using centralized pipelines, the CIDC standardizes assay data across diverse trials to enable cross-trial analyses. This database helps researchers discover biomarkers for treatment response and resistance, and data is shared with the broader scientific community through the NCI Data Commons.',
    program_sort_order: 4,
    program_external_url: '',
    studies: [
      { study_short_name: 'PCRP-001', study_name: 'Pediatric Trial One' },
    ],
  },
];

export const mockUnaffiliatedStudies = [
  { study_short_name: 'NCT00980460', study_name: 'Unaffiliated Study One' },
  { study_short_name: 'NCT01234567', study_name: 'Unaffiliated Study Two' },
];
