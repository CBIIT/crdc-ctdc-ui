/**
 * Small adapter for image assets loaded from loginView.yaml.
 * Assumptions: assets may be either a string path or an object with src/alt,
 * and missing assets should simply not render instead of breaking the page.
 */
import React from "react";

export function getAsset(assets, key) {
  const asset = assets[key];

  if (typeof asset === "string") {
    return { src: asset };
  }

  return asset || {};
}

function ContentImage({ asset, className, fallbackAlt, style }) {
  if (!asset || !asset.src) return null;

  return (
    <img
      src={asset.src}
      alt={asset.alt || fallbackAlt || ""}
      className={className}
      style={style}
    />
  );
}

export default ContentImage;
