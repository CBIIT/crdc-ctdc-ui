// Preview-only data for the dev-only /program-details-mock route, copied from the approved Figma frames
// ("CTDC Program Details, NCTN / NCI-Match - APPROVED 11/4/2026"). The four distinct study rows come from the
// NCTN design; repeats get a suffixed id so the table has enough rows to paginate. The NCI-Match frame has no
// body content, so its description is reused from the Portfolio card. The NCTN description is extended past the
// Figma text so it runs longer than the video, to test the description/video row formatting. Video link and resource URLs are stand-ins.
import nctnVideoThumbnail from '../assets/portfolio/mock/nctn-video-thumbnail.png';

const designStudies = [
  { study_id: 'NCT00945009', study_accession: 'phs004158', study_name: 'Treatment for Patients With Bilateral, Multicentric, or Bilaterally-Predisposed Unilateral Wilms Tumor' },
  { study_id: 'NCT00352534', study_accession: 'phs004139', study_name: 'Treatment for Very Low and Standard Risk Favorable Histology Wilms Tumor' },
  { study_id: 'NCT01026220', study_accession: 'phs004161', study_name: 'A Non-Randomized Phase III Study of Response Adapted Therapy for the Treatment of Children With Newly Diagnosed High Risk Hodgkin Lymphoma' },
  { study_id: 'NCT00274937', study_accession: 'phs004296', study_name: 'Treatment of Childhood Nasopharyngeal Carcinoma With Neoadjuvant Chemotherapy and Concomitant Chemoradiotherapy: A Groupwide Phase III Study' },
];

const buildStudies = (count) => Array.from({ length: count }, (_, i) => {
  const base = designStudies[i % designStudies.length];
  const repeat = Math.floor(i / designStudies.length);
  const id = repeat === 0 ? base.study_id : `${base.study_id}-${repeat + 1}`;
  return {
    ...base,
    study_id: id,
    study_short_name: id,
    study_type: 'Interventional Study',
    participant_file_count: 120 + i,
    study_file_count: i % 2 === 0 ? 3 : 0,
    image_collection_count: i % 3 === 0 ? 1 : 0,
    numberOfPublications: 0,
    unique_repository: i % 4 === 0 ? ['TCIA'] : [],
  };
});

const withProgram = (studies, programShortName) => studies.map((study) => ({
  ...study,
  program_short_name: programShortName,
}));

const nctnStudies = buildStudies(12);
const matchStudies = buildStudies(2);
const initiativeStudies = [{
  study_id: 'NCT04314401',
  study_short_name: 'CMB',
  study_name: 'Cancer Moonshot Biobank',
  study_accession: 'phs002192',
  study_type: 'Observational Study',
  participant_file_count: 1366,
  study_file_count: 2,
  image_collection_count: 0,
  numberOfPublications: 0,
  unique_repository: [],
}];

export const mockPrograms = {
  NCTN: {
    program_name: 'NCI National Clinical Trials Network',
    program_short_name: 'NCTN',
    program_full_description: 'NCI’s National Clinical Trials Network (NCTN) is a collection of organizations and clinicians that coordinates and supports cancer clinical trials at more than 2,200 sites across the United States, Canada, and internationally. NCTN provides the infrastructure for NCI-funded treatment and primary advanced imaging trials to improve the lives of people with cancer. NCTN clinical trials help to establish new standards of care, set the stage for approval of new therapies by the Food and Drug Administration, test new treatment approaches, and validate new biomarkers. The network brings together adult and pediatric cancer research groups, community oncology practices, and academic cancer centers so that patients across the country can take part in the same high-quality studies close to home. Data collected through these trials, including clinical outcomes, imaging, and specimen-derived results, are shared with the research community to support new discoveries, secondary analyses, and the design of future studies. Each trial is overseen by a coordinating group that manages protocol development, quality assurance, and regulatory compliance, and results are reviewed by independent data monitoring committees before they are reported. Participation in NCTN trials is open to people of all ages and backgrounds, and the network works closely with patient advocates to make sure that study designs reflect the needs and priorities of the people they are meant to help. Training programs supported by the network prepare the next generation of clinical investigators, research nurses, and data managers, while shared biorepositories preserve tumor and blood samples so they can be used for correlative studies long after a trial has closed. Together, these resources make the network one of the largest and most productive clinical research infrastructures in the world.',
    studies: nctnStudies,
    studyRows: withProgram(nctnStudies, 'NCTN'),
  },
  'NCI-MATCH': {
    program_name: 'NCI Molecular Analysis for Therapy Choice Trial',
    program_short_name: 'NCI-MATCH',
    program_full_description: 'NCI-MATCH, also known as MATCH, is a precision medicine cancer treatment clinical trial that sought to find out if treating cancer based on specific genetic changes in a person’s tumor is effective, no matter the cancer type. In this trial, which is no longer enrolling patients, people with cancer had genomic sequencing and other tests to determine the genetic makeup of their cancer cells. People whose tumors had genetic changes that matched one of the treatments in the trial may have received that treatment if they met other eligibility criteria....',
    studies: matchStudies,
    studyRows: withProgram(matchStudies, 'NCI-MATCH'),
  },
};

export const mockInitiative = {
  unaffiliatedStudies: initiativeStudies,
  studyRows: withProgram(initiativeStudies, 'Not Applicable'),
};

export const mockCuratedContent = {
  NCTN: {
    hostVideos: [
      {
        title: 'NCTN program overview video',
        thumbnail: nctnVideoThumbnail,
        videoUrl: 'https://www.youtube.com/watch?v=m0xp_cCO7kA',
      },
    ],
  },
};

export const mockInitiativesContent = {
  name: 'Cancer Moonshot Biobank (CMB)',
  hostVideos: [],
};
