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
 * @param {Object} params.caseCount - Participant counts by node type
 * @param {Object} params.nodeCount - Record counts by node type
 * @param {string} params.studyShortName - Study identifier for filename generation
 * @returns {Array} Array of enriched row objects ready for display
 *
 * @example
 * const rows = prepareTableRows({
 *   tableRows: table.rows,
 *   descriptions: { diagnosis: "Patient diagnosis info" },
 *   nodeData: { diagnosisNodeData: [...] },
 *   caseCount: { diagnosis: 150 },
 *   nodeCount: { diagnosis: 200 },
 *   studyShortName: "CMBb"
 * });
 */
export const prepareTableRows = ({
  tableRows,
  descriptions,
  nodeData,
  caseCount,
  nodeCount,
  studyShortName,
}) => {
  return tableRows.map((row) => ({
    ...row,
    clinicalDataNode: row.title,
    clinicalDataDescription: descriptions[row.countKey] || "",
    recordCount: nodeCount[row.countKey] || 0,
    caseCount: caseCount[row.countKey] || 0,
    csvDataRow: nodeData?.[row.csvDownload] || [],
    fileName: generateFileName(studyShortName, row.title),
    node: nodeData?.[row.csvDownload] || [],
    metadata: row.manifest,
  }));
};
