/**
 * Generates a standardized CSV filename for clinical data export
 *
 * @param {string} studyShortName - Study identifier
 * @param {string} title - Data category title
 * @returns {string} Formatted filename
 *
 * @example
 * generateFileName("CMB", "Diagnosis")
 * // => "CTDC_Clinical_Data-CMB-DIAGNOSIS"
 */
export const generateFileName = (studyShortName, title) => {
  return `CTDC_Clinical_Data-${studyShortName}-${title.toUpperCase()}`.replace(
    /\s+/g,
    "_",
  );
};

/**
 * Transforms table configuration rows into view-ready data rows
 *
 *
 * @param {Object} params - Parameters object
 * @param {Array} params.tableRows - Table row configuration from studyDetailData
 * @param {Object} params.descriptions - Node descriptions keyed by node name
 * @param {Object} params.nodeData - Combined clinical and trial data
 * @param {Object} params.participantCount - Participant counts by node type
 * @param {Object} params.nodeCount - Record counts by node type
 * @param {string} params.studyShortName - Study identifier for filename generation
 * @param {boolean} params.noClinicalMetadata - True when all clinical and clinical trial metadata is absent
 * @returns {Array} Array of enriched row objects ready for display
 *
 * @example
 * const rows = prepareTableRows({
 *   tableRows: table.rows,
 *   descriptions: { diagnosis: "Patient diagnosis info" },
 *   nodeData: { diagnosisNodeData: [...] },
 *   participantCount: { diagnosis: 150 },
 *   nodeCount: { diagnosis: 200 },
 *   studyShortName: "CMB"
 * });
 */
export const prepareTableRows = ({
  tableRows,
  descriptions,
  nodeData,
  participantCount,
  nodeCount,
  studyShortName,
  noClinicalMetadata = false,
}) => {
  return tableRows.map((row) => {
    const rowNodeData = nodeData?.[row.csvDownload] || [];

    return {
      ...row,
      clinicalDataNode: row.title,
      clinicalDataDescription: descriptions[row.countKey] || "",
      recordCount: noClinicalMetadata ? 0 : nodeCount[row.countKey] || 0,
      participantCount: noClinicalMetadata
        ? 0
        : participantCount[row.countKey] || 0,
      csvDataRow: noClinicalMetadata ? [] : rowNodeData,
      fileName: generateFileName(studyShortName, row.title),
      node: noClinicalMetadata ? [] : rowNodeData,
      isCsvDisabled: noClinicalMetadata,
      metadata: row.manifest,
    };
  });
};
