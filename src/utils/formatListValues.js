/**
 * Formats strings, numbers and booleans for display or a CSV cell. Trims labels,
 * omits null/blank entries, and joins with ", ". Unexpected API objects and
 * nested arrays are preserved as JSON text so callers never lose their data.
 * Legacy scalar list strings such as "[A, B]" have their outer brackets removed
 * for display, without splitting them into inferred list elements. Other
 * supported scalar values are treated as one label.
 * Actual array labels retain their literal commas, pipes and brackets.
 * Returns null only if no nonempty values remain.
 *
 * Format independently aggregated fields separately; this does not reconstruct
 * related records. Display/export only: never normalize facet selections here,
 * because [] and [''] have different filter meanings.
 *
 * @param {*} value - JSON API field value, or undefined when missing.
 * @returns {string|null} Formatted labels, or null for the caller's empty fallback.
 */
export const formatListValues = (value) => {
  let values = Array.isArray(value) ? value : [value];
  if (typeof value === 'string') {
    const text = value.trim();
    values = [text.startsWith('[') && text.endsWith(']') ? text.slice(1, -1) : text];
  }
  const labels = values
    .filter((label) => label != null)
    .map((label) => (typeof label === 'object' ? JSON.stringify(label) : String(label).trim()))
    .filter(Boolean);
  return labels.length ? labels.join(', ') : null;
};
