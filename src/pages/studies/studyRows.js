// TODO(CTDC-2175): Temporary fallback interop data for studies not yet loaded into OpenSearch. Remove once the missing studies are indexed.
export const INTEROP_FALLBACK = {
  NCT00980460: {
    unique_repository: ['TCIA'],
  },
};

// Adds the fields the Studies table needs (publications count, additional CRDC nodes) to each study row.
export const mergeInteropData = (studies, interOpData) => {
  const interOpStudiesMap = (interOpData?.getInteropData || []).reduce((acc, entry) => {
    const s = entry?.data?.getAllStudies;
    if (s?.study_id) acc[s.study_id] = s;
    return acc;
  }, {});
  return (studies || []).map((study) => {
    const interOpStudy = interOpStudiesMap[study.study_id] || INTEROP_FALLBACK[study.study_id];
    return {
      ...study,
      numberOfPublications: 0, // TODO: Fetch this value from the backend API when it's implemented
      unique_repository: interOpStudy?.unique_repository || [],
    };
  });
};
