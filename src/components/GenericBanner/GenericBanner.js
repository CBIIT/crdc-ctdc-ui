import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import yaml from 'js-yaml';
import env from '../../utils/env';

/**
 * GenericBanner: A React component that displays a site-wide, configurable banner.
 * 
 * - Fetches banner content and style from a remote YAML file (URL provided via the yamlUrl prop).
 * - Banner is only rendered if a non-empty banner_text is provided in the YAML, 
 *   and banner_show is not false.
 * - If remote YAML fetching/parsing fails, or banner_text is empty, nothing is shown.
 * - There is no fallback to children or local content: banner is remote-config only.
 * 
 * Example YAML structure:
 * 
 * banner_show: true
 * banner_text: "This is an important announcement!"
 * banner_style:
 *   background: "#e3fcef"
 *   color: "#006644"
 */

// Utility to support both flat and nested YAML keys using dot notation
function getNested(obj, keyStr) {
  if (!obj || !keyStr) return undefined;
  return keyStr.split('.').reduce((a, k) => (a || {})[k], obj);
}

const GenericBanner = ({
  style,
  yamlUrl,
  bannerTextKey = "banner_text",
  bannerStyleKey = "banner_style",
  bannerShowKey = "banner_show",
  ...rest
}) => {
  const STATIC_CONTENT_URL = env.REACT_APP_STATIC_CONTENT_URL;

  console.log("GenericBanner: Using STATIC_CONTENT_URL =", STATIC_CONTENT_URL);
  // Compute the YAML content URL, handle missing env var
  let yamlUrlToUse = "";

  if (yamlUrl) {
    yamlUrlToUse = yamlUrl;
  } else if (STATIC_CONTENT_URL) {
    // Cleanly ensure trailing slash before appending banners path
    yamlUrlToUse = STATIC_CONTENT_URL.replace(/\/?$/, '/') + "banners/banner_content.yaml";
  } else {
    yamlUrlToUse = "";
    
    console.warn(
      "GenericBanner: No yamlUrl prop or REACT_APP_STATIC_CONTENT_URL environment variable supplied. The banner will not be displayed."
    );
    
  }

  const [remoteText, setRemoteText] = useState(undefined);
  const [remoteStyle, setRemoteStyle] = useState({});
  const [show, setShow] = useState(true);

  useEffect(() => {
    // If no URL provided, don't render anything
    if (!yamlUrlToUse) {
      setShow(false);
      setRemoteText(undefined);
      setRemoteStyle({});
      return;
    }

    fetch(yamlUrlToUse)
      .then(res => res.text())
      .then(str => {
        const data = yaml.load(str);
        const text = getNested(data, bannerTextKey); // Get banner text from YAML (may be nested)
        const showVal = getNested(data, bannerShowKey); // Get banner_show control (optional)
        
        // Only show if banner_show is not false, and text is non-empty
        if (
          (typeof showVal === "boolean" && !showVal) ||
          !text || String(text).trim() === ""
        ) {
          setShow(false);
          setRemoteText(undefined);
          setRemoteStyle({});
        } else {
          setShow(true);
          setRemoteText(text);
          setRemoteStyle(getNested(data, bannerStyleKey) || {});
        }
      })
      .catch((err) => {
        // Hide banner if fetch/parsing fails
        console.error("GenericBanner:Failed to fetch or parse banner YAML:", err);
        setShow(false);
        setRemoteText(undefined);
        setRemoteStyle({});
      });
  }, [yamlUrlToUse, bannerTextKey, bannerStyleKey, bannerShowKey]);

  // Default banner styles, merged with props and remote YAML
  const mergedStyle = {
    width: "100%",
    background: "#E8F1F7",    // White by default
    color: "#1F3A4D",         // Black text
    padding: "10px 32px",
    fontWeight: 600,
    height: "auto",
    minHeight: "46px",
    ...style,
    ...remoteStyle,
  };

  // Do not render banner if show is false (i.e., on error or explicitly hidden)
  if (!show) return null;

  return (
    <div style={mergedStyle} data-testid="generic-banner" {...rest}>
      {remoteText}
    </div>
  );
};

GenericBanner.propTypes = {
  style: PropTypes.object,
  yamlUrl: PropTypes.string,
  bannerTextKey: PropTypes.string,
  bannerStyleKey: PropTypes.string,
  bannerShowKey: PropTypes.string,
};

export default GenericBanner;