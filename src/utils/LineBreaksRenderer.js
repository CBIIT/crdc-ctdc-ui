import React from 'react';
import DOMPurify from 'dompurify';

/**
 * LineBreaksRenderer: A React component for rendering text with line breaks.
 * Optionally utilizes DOMPurify for HTML sanitization and ensures proper rendering in React.
 *
 * @param {string} htmlContent - The text content to be rendered.
 * @param {boolean} [sanitize=true] - Flag to indicate whether HTML sanitization should be applied.
 * @param {string} [props.classes] - Optional classes to apply custom styles.
 * @returns {JSX.Element} - React component
 */
const LineBreaksRenderer = ({ htmlContent, sanitize = true, classes }) => {
  const sanitizedHTML = sanitize
    ? DOMPurify.sanitize(htmlContent, { ALLOWED_TAGS: ['br'] })
    : htmlContent;

  // Render the sanitized text with <br> tags replaced by new lines
  return <span className={classes} dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

export default LineBreaksRenderer;
