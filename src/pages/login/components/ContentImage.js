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
