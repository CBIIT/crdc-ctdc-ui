import React from "react";
import ExternalLinkIconSvg from "../assets/externalLinkIcon.svg";

/**
 * Renders a list item with an external link and an "outbound" icon
 * @param href: link URL
 * @param text: text for the link
 * @param linkIconClass: style class for the icon
 * @returns React component contains the link and icon wrapped in an <li>
 * @constructor
 */
function ExternalLink({ href, text, linkIconClass }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
      <img
        src={ExternalLinkIconSvg}
        alt="outbound web site icon"
        className={linkIconClass}
      />
    </li>
  );
}

export default ExternalLink;
