// TEMPORARY scaffolding-preview data for the Portfolio page (CTDC-2064), used only while the real
// program/Initiatives GraphQL queries (CTDC-2066/2067) are not yet live. Remove this file and the
// USE_PORTFOLIO_MOCK_DATA flag in portfolioController.js once backend ships - see
// /memories/repo/portfolio-page-ctdc-2064.md for the tracked follow-up.
export const mockPrograms = [
  {
    program_name: 'Comparative Oncology Program',
    program_short_name: 'COP',
    crdc_id: 'crdc-program-cop',
    program_short_description: 'A core resource supporting comparative oncology research across institutions.',
    program_sort_order: 1,
    program_external_url: 'https://ccr.cancer.gov/Comparative-Oncology-Program',
    studies: [
      { study_short_name: 'COTC007B', study_name: 'Preclinical Comparison Study' },
      { study_short_name: 'COTC021', study_name: 'Targeted Therapy Study' },
    ],
  },
  {
    program_name: 'Pediatric Cancer Research Program',
    program_short_name: 'PCRP',
    crdc_id: 'crdc-program-pcrp',
    program_short_description: 'Focused on advancing treatment options for pediatric cancer patients.',
    program_sort_order: 2,
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
