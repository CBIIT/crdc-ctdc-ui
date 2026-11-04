/**
 * Formats a string list for display or a CSV cell. Trims labels, omits blank or
 * non-string entries, and joins them with ", ". A scalar string is treated as one
 * label for compatibility with older responses. Returns null if no labels remain.
 * Commas, pipes and brackets inside labels are preserved, not parsed or split.
 *
 * Format independently aggregated fields separately; this does not reconstruct
 * related records. Display/export only: never normalize facet selections here,
 * because [] and [''] have different filter meanings.
 *
 * @param {string[]|string|null|undefined} value - API field value.
 * @returns {string|null} Formatted labels, or null for the caller's empty fallback.
 */
export const formatListValues = (value) => {
  const values = Array.isArray(value) ? value : [value];
  const labels = values
    .filter((label) => typeof label === 'string')
    .map((label) => label.trim())
    .filter(Boolean);
  return labels.length ? labels.join(', ') : null;
};
