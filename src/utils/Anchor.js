import React from "react";
import { Link } from 'react-router-dom';

/**
 * Anchor component create internal links as well as external links
 * External links must contain URL scheme, such as "https://"
 * Other links will be treated as React internal links
 * @param link: link URL or path
 * @param text: text for the link
 * @param classes: style object, must contain styles for class "link"
 * @returns React component contains the link
 * @constructor
 */
const Anchor = ({ link, text, classes }) => {
  return link.match(/\w+:\/\//) ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className={classes.link}>
      {text}
    </a>
  ) : (
    <Link to={link} className={classes.link}>
      {text}
    </Link>
  );
};

export default Anchor;
